// Tax Calculator for Maki Optimization Application

class TaxCalculator {
    constructor(taxData) {
        this.taxData = taxData;
    }

    /**
     * Calculate federal income tax based on filing status and taxable income
     * @param {number} taxableIncome - Income after deductions
     * @param {string} filingStatus - Filing status (single, marriedFilingJointly, etc.)
     * @returns {number} Federal tax amount
     */
    calculateFederalTax(taxableIncome, filingStatus) {
        if (taxableIncome <= 0) return 0;

        const brackets = this.taxData.federalBrackets[filingStatus];
        let tax = 0;

        for (let i = 0; i < brackets.length; i++) {
            const bracket = brackets[i];
            const prevMax = i > 0 ? brackets[i - 1].max : 0;

            if (taxableIncome > bracket.min) {
                const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
                tax += taxableInBracket * bracket.rate;
            }

            if (taxableIncome <= bracket.max) break;
        }

        return tax;
    }

    /**
     * Calculate state income tax
     * @param {number} income - Gross income
     * @param {string} stateCode - Two-letter state code
     * @returns {number} State tax amount
     */
    calculateStateTax(income, stateCode) {
        if (income <= 0) return 0;

        const state = this.taxData.states[stateCode];
        if (!state) return 0;

        if (state.type === 'none') {
            return 0;
        }

        if (state.type === 'flat') {
            return income * state.rate;
        }

        // Progressive tax
        let tax = 0;
        for (let i = 0; i < state.brackets.length; i++) {
            const bracket = state.brackets[i];

            if (income > bracket.min) {
                const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
                tax += taxableInBracket * bracket.rate;
            }

            if (income <= bracket.max) break;
        }

        return tax;
    }

    /**
     * Calculate long-term capital gains tax (federal)
     * @param {number} capitalGains - Long-term capital gains amount
     * @param {number} ordinaryIncome - Ordinary income (used to determine bracket)
     * @param {string} filingStatus - Filing status
     * @returns {number} Capital gains tax amount
     */
    calculateCapitalGainsTax(capitalGains, ordinaryIncome, filingStatus) {
        if (capitalGains <= 0) return 0;

        const brackets = this.taxData.capitalGainsRates[filingStatus];
        let tax = 0;
        let remainingGains = capitalGains;
        let currentIncome = ordinaryIncome;

        for (let i = 0; i < brackets.length; i++) {
            const bracket = brackets[i];

            if (currentIncome < bracket.max) {
                const spaceInBracket = bracket.max - currentIncome;
                const gainsInBracket = Math.min(remainingGains, spaceInBracket);

                tax += gainsInBracket * bracket.rate;
                remainingGains -= gainsInBracket;
                currentIncome += gainsInBracket;
            }

            if (remainingGains <= 0) break;
        }

        return tax;
    }

    /**
     * Calculate total tax for a given withdrawal scenario
     * @param {Object} withdrawals - Withdrawal amounts by account type
     * @param {Object} config - Tax configuration (filing status, state, etc.)
     * @returns {Object} Tax breakdown
     */
    calculateTotalTax(withdrawals, config) {
        const { filingStatus, stateCode } = config;
        const standardDeduction = this.taxData.standardDeductions[filingStatus];

        // Calculate different income types
        const ordinaryIncome = (withdrawals.ira || 0) + (withdrawals.shortTermGains || 0);
        const longTermGains = withdrawals.longTermGains || 0;
        const muniBonds = withdrawals.muniBonds || 0;

        // Federal tax calculation
        const taxableOrdinaryIncome = Math.max(0, ordinaryIncome - standardDeduction);
        const federalOrdinaryTax = this.calculateFederalTax(taxableOrdinaryIncome, filingStatus);
        const federalCapitalGainsTax = this.calculateCapitalGainsTax(longTermGains, taxableOrdinaryIncome, filingStatus);
        const federalTax = federalOrdinaryTax + federalCapitalGainsTax;

        // State tax calculation
        // Most states tax capital gains as ordinary income
        const stateIncome = ordinaryIncome + longTermGains;
        const stateTax = this.calculateStateTax(stateIncome, stateCode);

        // Total income and tax
        const totalIncome = ordinaryIncome + longTermGains + muniBonds;
        const totalTax = federalTax + stateTax;
        const effectiveRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;

        return {
            totalIncome,
            federalTax,
            stateTax,
            totalTax,
            effectiveRate,
            breakdown: {
                ordinaryIncome,
                longTermGains,
                muniBonds,
                taxableOrdinaryIncome,
                federalOrdinaryTax,
                federalCapitalGainsTax
            }
        };
    }

    /**
     * Get marginal tax rate for next dollar of ordinary income
     * @param {number} currentIncome - Current taxable income
     * @param {string} filingStatus - Filing status
     * @param {string} stateCode - State code
     * @returns {number} Marginal rate (as decimal)
     */
    getMarginalRate(currentIncome, filingStatus, stateCode) {
        const brackets = this.taxData.federalBrackets[filingStatus];
        let federalRate = 0;

        for (const bracket of brackets) {
            if (currentIncome >= bracket.min && currentIncome < bracket.max) {
                federalRate = bracket.rate;
                break;
            }
        }

        const state = this.taxData.states[stateCode];
        let stateRate = 0;

        if (state.type === 'flat') {
            stateRate = state.rate;
        } else if (state.type === 'progressive') {
            for (const bracket of state.brackets) {
                if (currentIncome >= bracket.min && currentIncome < bracket.max) {
                    stateRate = bracket.rate;
                    break;
                }
            }
        }

        return federalRate + stateRate;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaxCalculator;
}
