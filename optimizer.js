// Withdrawal Optimizer for Maki Optimization Application

class WithdrawalOptimizer {
    constructor(taxCalculator) {
        this.taxCalculator = taxCalculator;
    }

    /**
     * Optimize withdrawal strategy to minimize taxes
     * @param {Object} accounts - Available account balances
     * @param {number} desiredIncome - Target income amount
     * @param {Object} config - Tax configuration
     * @returns {Object} Optimal withdrawal strategy
     */
    optimize(accounts, desiredIncome, config) {
        const { muniBonds = 0, longTermGains = 0, shortTermGains = 0, ira = 0 } = accounts;

        let remaining = desiredIncome;
        const withdrawals = {
            muniBonds: 0,
            longTermGains: 0,
            shortTermGains: 0,
            ira: 0
        };

        // Strategy: Withdraw in order of tax efficiency
        // 1. Municipal bonds (tax-free federally)
        if (remaining > 0 && muniBonds > 0) {
            const amount = Math.min(remaining, muniBonds);
            withdrawals.muniBonds = amount;
            remaining -= amount;
        }

        // 2. Long-term capital gains (preferential rates)
        if (remaining > 0 && longTermGains > 0) {
            const amount = Math.min(remaining, longTermGains);
            withdrawals.longTermGains = amount;
            remaining -= amount;
        }

        // 3. Short-term capital gains (ordinary income rates)
        if (remaining > 0 && shortTermGains > 0) {
            const amount = Math.min(remaining, shortTermGains);
            withdrawals.shortTermGains = amount;
            remaining -= amount;
        }

        // 4. IRA (fully taxable as ordinary income)
        if (remaining > 0 && ira > 0) {
            const amount = Math.min(remaining, ira);
            withdrawals.ira = amount;
            remaining -= amount;
        }

        // Calculate taxes for this strategy
        const taxResult = this.taxCalculator.calculateTotalTax(withdrawals, config);

        return {
            withdrawals,
            taxResult,
            shortfall: remaining,
            totalWithdrawn: desiredIncome - remaining,
            feasible: remaining === 0
        };
    }

    /**
     * Calculate tax for a custom withdrawal scenario
     * @param {Object} withdrawals - Custom withdrawal amounts
     * @param {Object} config - Tax configuration
     * @returns {Object} Tax calculation result
     */
    calculateCustom(withdrawals, config) {
        const totalWithdrawn = Object.values(withdrawals).reduce((sum, val) => sum + val, 0);
        const taxResult = this.taxCalculator.calculateTotalTax(withdrawals, config);

        return {
            withdrawals,
            taxResult,
            totalWithdrawn,
            feasible: true
        };
    }

    /**
     * Optimize withdrawal using proportional strategy to smooth taxes
     * Withdraws from all available accounts proportionally instead of exhausting one at a time
     * @param {Object} accounts - Available account balances
     * @param {number} desiredIncome - Target income amount (post-tax unless isGrossAmount is true)
     * @param {Object} config - Tax configuration
     * @param {boolean} isGrossAmount - If true, desiredIncome is treated as gross withdrawal target
     * @returns {Object} Optimal withdrawal strategy
     */
    optimizeProportional(accounts, desiredIncome, config, isGrossAmount = false) {
        const { muniBonds = 0, longTermGains = 0, shortTermGains = 0, ira = 0 } = accounts;

        // Calculate total available
        const totalAvailable = muniBonds + longTermGains + shortTermGains + ira;

        if (totalAvailable === 0) {
            return {
                withdrawals: { muniBonds: 0, longTermGains: 0, shortTermGains: 0, ira: 0 },
                taxResult: this.taxCalculator.calculateTotalTax({ muniBonds: 0, longTermGains: 0, shortTermGains: 0, ira: 0 }, config),
                shortfall: desiredIncome,
                totalWithdrawn: 0,
                feasible: false
            };
        }

        // If isGrossAmount is true, we already have the gross amount and just need to allocate it proportionally
        if (isGrossAmount) {
            const cappedGross = Math.min(desiredIncome, totalAvailable);

            const withdrawals = {
                muniBonds: Math.min((muniBonds / totalAvailable) * cappedGross, muniBonds),
                longTermGains: Math.min((longTermGains / totalAvailable) * cappedGross, longTermGains),
                shortTermGains: Math.min((shortTermGains / totalAvailable) * cappedGross, shortTermGains),
                ira: Math.min((ira / totalAvailable) * cappedGross, ira)
            };

            const actualGross = Object.values(withdrawals).reduce((sum, val) => sum + val, 0);
            const taxResult = this.taxCalculator.calculateTotalTax(withdrawals, config);

            // Check if we had enough funds to meet the desired gross amount
            const feasible = desiredIncome <= totalAvailable;

            return {
                withdrawals,
                taxResult,
                shortfall: feasible ? 0 : (desiredIncome - actualGross),
                totalWithdrawn: actualGross,
                feasible: feasible
            };
        }

        // Otherwise, iterate to find the gross amount needed for desired post-tax income
        let withdrawals = {
            muniBonds: 0,
            longTermGains: 0,
            shortTermGains: 0,
            ira: 0
        };

        // Use iterative approach to find the right gross amount
        let grossEstimate = desiredIncome / 0.8; // Start with 20% tax assumption
        const maxIterations = 30;
        const tolerance = 1; // $1 tolerance

        for (let i = 0; i < maxIterations; i++) {
            // Calculate proportional withdrawals
            const cappedGross = Math.min(grossEstimate, totalAvailable);

            withdrawals = {
                muniBonds: Math.min((muniBonds / totalAvailable) * cappedGross, muniBonds),
                longTermGains: Math.min((longTermGains / totalAvailable) * cappedGross, longTermGains),
                shortTermGains: Math.min((shortTermGains / totalAvailable) * cappedGross, shortTermGains),
                ira: Math.min((ira / totalAvailable) * cappedGross, ira)
            };

            // Calculate actual withdrawals and taxes
            const actualGross = Object.values(withdrawals).reduce((sum, val) => sum + val, 0);
            const taxResult = this.taxCalculator.calculateTotalTax(withdrawals, config);
            const actualPostTax = actualGross - taxResult.totalTax;
            const difference = desiredIncome - actualPostTax;

            // If we're close enough, we're done
            if (Math.abs(difference) < tolerance) {
                return {
                    withdrawals,
                    taxResult,
                    shortfall: 0,
                    totalWithdrawn: actualGross,
                    feasible: true
                };
            }

            // Adjust estimate
            grossEstimate += difference;

            // Ensure we don't go negative or exceed available
            if (grossEstimate < 0) {
                grossEstimate = desiredIncome;
            }
            if (grossEstimate > totalAvailable) {
                // Can't meet desired income, return what we can
                const finalWithdrawals = {
                    muniBonds,
                    longTermGains,
                    shortTermGains,
                    ira
                };
                const finalTaxResult = this.taxCalculator.calculateTotalTax(finalWithdrawals, config);
                return {
                    withdrawals: finalWithdrawals,
                    taxResult: finalTaxResult,
                    shortfall: desiredIncome - (totalAvailable - finalTaxResult.totalTax),
                    totalWithdrawn: totalAvailable,
                    feasible: false
                };
            }
        }

        // Fallback if we didn't converge
        const taxResult = this.taxCalculator.calculateTotalTax(withdrawals, config);
        const actualGross = Object.values(withdrawals).reduce((sum, val) => sum + val, 0);
        return {
            withdrawals,
            taxResult,
            shortfall: desiredIncome - (actualGross - taxResult.totalTax),
            totalWithdrawn: actualGross,
            feasible: Math.abs(desiredIncome - (actualGross - taxResult.totalTax)) < 100
        };
    }

    /**
     * Validate withdrawal amounts against account balances
     * @param {Object} withdrawals - Proposed withdrawals
     * @param {Object} accounts - Available balances
     * @returns {Object} Validation result
     */
    validate(withdrawals, accounts) {
        const errors = [];

        for (const [account, amount] of Object.entries(withdrawals)) {
            if (amount > (accounts[account] || 0)) {
                errors.push({
                    account,
                    requested: amount,
                    available: accounts[account] || 0,
                    message: `Insufficient funds in ${account}`
                });
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Optimize multi-year withdrawal strategy to deplete all accounts
     * @param {Object} accounts - Available account balances
     * @param {number} desiredPostTaxIncome - Target post-tax income per year
     * @param {Object} config - Tax configuration
     * @returns {Object} Multi-year withdrawal plan
     */
    optimizeMultiYear(accounts, desiredPostTaxIncome, config) {
        const years = [];
        let currentBalances = { ...accounts };
        let yearNumber = 1;
        const MAX_YEARS = 100; // Safety limit

        while (this.hasRemainingBalance(currentBalances) && yearNumber <= MAX_YEARS) {
            // Calculate how much gross income we need to achieve desired post-tax income
            const grossIncomeNeeded = this.calculateGrossIncomeNeeded(
                desiredPostTaxIncome,
                currentBalances,
                config
            );

            // Optimize withdrawals for this year using proportional strategy
            // Pass isGrossAmount=true since calculateGrossIncomeNeeded already calculated the gross amount
            const yearStrategy = this.optimizeProportional(currentBalances, grossIncomeNeeded, config, true);

            // If we can't meet the desired income, withdraw everything remaining
            if (!yearStrategy.feasible) {
                const totalRemaining = Object.values(currentBalances).reduce((sum, val) => sum + val, 0);
                const finalStrategy = this.optimizeProportional(currentBalances, totalRemaining, config, true);
                const postTaxIncome = totalRemaining - finalStrategy.taxResult.totalTax;

                years.push({
                    year: yearNumber,
                    withdrawals: finalStrategy.withdrawals,
                    grossIncome: totalRemaining,
                    taxes: finalStrategy.taxResult,
                    postTaxIncome: postTaxIncome,
                    isFinalYear: true
                });

                break;
            }

            // Calculate actual post-tax income
            const postTaxIncome = grossIncomeNeeded - yearStrategy.taxResult.totalTax;

            // Store year data
            years.push({
                year: yearNumber,
                withdrawals: yearStrategy.withdrawals,
                grossIncome: grossIncomeNeeded,
                taxes: yearStrategy.taxResult,
                postTaxIncome: postTaxIncome,
                isFinalYear: false
            });

            // Update balances for next year
            currentBalances = this.subtractWithdrawals(currentBalances, yearStrategy.withdrawals);
            yearNumber++;
        }

        // Calculate summary statistics
        const totalTaxesPaid = years.reduce((sum, year) => sum + year.taxes.totalTax, 0);
        const totalWithdrawn = years.reduce((sum, year) => sum + year.grossIncome, 0);
        const avgEffectiveRate = totalWithdrawn > 0 ? (totalTaxesPaid / totalWithdrawn) * 100 : 0;

        return {
            years,
            summary: {
                totalYears: years.length,
                totalTaxesPaid,
                totalWithdrawn,
                avgEffectiveRate,
                totalPostTaxIncome: totalWithdrawn - totalTaxesPaid
            }
        };
    }

    /**
     * Calculate gross income needed to achieve desired post-tax income
     * Uses iterative approach since tax depends on income
     */
    calculateGrossIncomeNeeded(desiredPostTaxIncome, accounts, config) {
        // Start with an estimate (assume ~20% tax rate)
        let grossEstimate = desiredPostTaxIncome / 0.8;
        const maxIterations = 20;
        const tolerance = 1; // $1 tolerance

        for (let i = 0; i < maxIterations; i++) {
            // Calculate taxes on this gross amount using proportional strategy
            // Use isGrossAmount=true since we're testing a specific gross amount
            const testStrategy = this.optimizeProportional(accounts, grossEstimate, config, true);
            const actualPostTax = grossEstimate - testStrategy.taxResult.totalTax;
            const difference = desiredPostTaxIncome - actualPostTax;

            // If we're close enough, we're done
            if (Math.abs(difference) < tolerance) {
                return grossEstimate;
            }

            // Adjust estimate
            grossEstimate += difference;

            // Ensure we don't go negative
            if (grossEstimate < 0) {
                grossEstimate = desiredPostTaxIncome;
            }
        }

        return grossEstimate;
    }

    /**
     * Check if there are any remaining balances
     */
    hasRemainingBalance(accounts) {
        return Object.values(accounts).some(balance => balance > 1); // $1 threshold
    }

    /**
     * Subtract withdrawals from account balances
     */
    subtractWithdrawals(accounts, withdrawals) {
        return {
            muniBonds: Math.max(0, (accounts.muniBonds || 0) - (withdrawals.muniBonds || 0)),
            longTermGains: Math.max(0, (accounts.longTermGains || 0) - (withdrawals.longTermGains || 0)),
            shortTermGains: Math.max(0, (accounts.shortTermGains || 0) - (withdrawals.shortTermGains || 0)),
            ira: Math.max(0, (accounts.ira || 0) - (withdrawals.ira || 0))
        };
    }

    /**
     * Compare two withdrawal strategies
     * @param {Object} strategy1 - First strategy result
     * @param {Object} strategy2 - Second strategy result
     * @returns {Object} Comparison metrics
     */
    compare(strategy1, strategy2) {
        const taxDifference = strategy2.taxResult.totalTax - strategy1.taxResult.totalTax;
        const percentDifference = strategy1.taxResult.totalTax > 0
            ? (taxDifference / strategy1.taxResult.totalTax) * 100
            : 0;

        return {
            taxDifference,
            percentDifference,
            betterStrategy: taxDifference < 0 ? 'strategy2' : 'strategy1',
            savings: Math.abs(taxDifference)
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WithdrawalOptimizer;
}
