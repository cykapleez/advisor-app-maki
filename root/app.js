// Main Application Controller for Maki Optimization

class MakiOptimizationApp {
    constructor() {
        this.taxCalculator = new TaxCalculator(TAX_DATA);
        this.optimizer = new WithdrawalOptimizer(this.taxCalculator);
        this.optimalResult = null;
        this.currentAccounts = {};
        this.currentConfig = {};

        this.init();
    }

    init() {
        this.populateStateDropdown();
        this.attachEventListeners();
        this.setupNumberFormatting();
        this.setupBalanceSliders();
    }

    setupNumberFormatting() {
        // Add comma formatting to all numeric inputs
        const numericInputs = [
            'desiredIncome',
            'muniBonds',
            'longTermGains',
            'shortTermGains',
            'ira'
        ];

        numericInputs.forEach(inputId => {
            const input = document.getElementById(inputId);

            // Format on input
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/,/g, ''); // Remove existing commas
                if (value && !isNaN(value)) {
                    e.target.value = this.formatNumberWithCommas(parseFloat(value));
                }
            });

            // Format on blur
            input.addEventListener('blur', (e) => {
                let value = e.target.value.replace(/,/g, '');
                if (value && !isNaN(value)) {
                    e.target.value = this.formatNumberWithCommas(parseFloat(value));
                }
            });
        });
    }

    setupBalanceSliders() {
        // Setup synchronization between text inputs and sliders
        const balanceInputs = [
            { textId: 'muniBonds', sliderId: 'muniBondsSlider' },
            { textId: 'longTermGains', sliderId: 'longTermGainsSlider' },
            { textId: 'shortTermGains', sliderId: 'shortTermGainsSlider' },
            { textId: 'ira', sliderId: 'iraSlider' }
        ];

        balanceInputs.forEach(({ textId, sliderId }) => {
            const textInput = document.getElementById(textId);
            const slider = document.getElementById(sliderId);

            // When text input changes, update slider
            textInput.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value.replace(/,/g, '')) || 0;
                slider.value = value;
            });

            // When slider changes, update text input
            slider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                textInput.value = this.formatNumberWithCommas(value);
            });
        });
    }

    formatNumberWithCommas(number) {
        return Math.round(number).toLocaleString('en-US');
    }

    populateStateDropdown() {
        const stateSelect = document.getElementById('state');
        const states = Object.entries(TAX_DATA.states).map(([code, data]) => ({
            code,
            name: data.name
        })).sort((a, b) => a.name.localeCompare(b.name));

        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state.code;
            option.textContent = state.name;
            stateSelect.appendChild(option);
        });

        // Set default to California
        stateSelect.value = 'CA';
    }

    attachEventListeners() {
        // Calculate button
        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.calculateOptimal();
        });

        // Slider event listeners
        const sliders = ['customMuniBonds', 'customLongTermGains', 'customShortTermGains', 'customIra'];
        sliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            slider.addEventListener('input', () => {
                this.updateSliderValue(sliderId);
                this.recalculateCustom();
            });
        });
    }

    getInputValues() {
        return {
            filingStatus: document.getElementById('filingStatus').value,
            stateCode: document.getElementById('state').value,
            desiredIncome: parseFloat(document.getElementById('desiredIncome').value.replace(/,/g, '')) || 0,
            accounts: {
                muniBonds: parseFloat(document.getElementById('muniBonds').value.replace(/,/g, '')) || 0,
                longTermGains: parseFloat(document.getElementById('longTermGains').value.replace(/,/g, '')) || 0,
                shortTermGains: parseFloat(document.getElementById('shortTermGains').value.replace(/,/g, '')) || 0,
                ira: parseFloat(document.getElementById('ira').value.replace(/,/g, '')) || 0
            }
        };
    }

    validateInputs(inputs) {
        const errors = [];

        if (!inputs.stateCode) {
            errors.push('Please select a state');
        }

        if (inputs.desiredIncome <= 0) {
            errors.push('Please enter a desired income amount');
        }

        const totalAvailable = Object.values(inputs.accounts).reduce((sum, val) => sum + val, 0);
        if (totalAvailable === 0) {
            errors.push('Please enter at least one account balance');
        }

        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return false;
        }

        return true;
    }

    calculateOptimal() {
        const inputs = this.getInputValues();

        if (!this.validateInputs(inputs)) {
            return;
        }

        this.currentAccounts = inputs.accounts;
        this.currentConfig = {
            filingStatus: inputs.filingStatus,
            stateCode: inputs.stateCode
        };

        // Calculate multi-year optimal strategy
        this.multiYearResult = this.optimizer.optimizeMultiYear(
            inputs.accounts,
            inputs.desiredIncome,  // This is now post-tax desired income
            this.currentConfig
        );

        // Display results
        this.displayMultiYearResults();
        this.showResults();
    }

    displayMultiYearResults() {
        const { years, summary } = this.multiYearResult;

        // Update summary metrics
        document.getElementById('totalYears').textContent = summary.totalYears;
        document.getElementById('totalTaxesPaid').textContent =
            '$' + this.formatCurrency(summary.totalTaxesPaid);
        document.getElementById('totalWithdrawn').textContent =
            '$' + this.formatCurrency(summary.totalWithdrawn);
        document.getElementById('avgEffectiveRate').textContent =
            summary.avgEffectiveRate.toFixed(2) + '%';

        // Populate year-by-year table
        const tbody = document.querySelector('#yearlyBreakdown tbody');
        tbody.innerHTML = '';

        years.forEach(yearData => {
            const row = document.createElement('tr');

            // Add final year indicator if applicable
            if (yearData.isFinalYear) {
                row.style.background = 'rgba(139, 92, 246, 0.1)';
            }

            // Calculate tax percentage
            const taxPercentage = yearData.grossIncome > 0
                ? (yearData.taxes.totalTax / yearData.grossIncome * 100).toFixed(2)
                : '0.00';

            row.innerHTML = `
                <td>Year ${yearData.year}</td>
                <td>$${this.formatCurrency(yearData.withdrawals.muniBonds || 0)}</td>
                <td>$${this.formatCurrency(yearData.withdrawals.longTermGains || 0)}</td>
                <td>$${this.formatCurrency(yearData.withdrawals.shortTermGains || 0)}</td>
                <td>$${this.formatCurrency(yearData.withdrawals.ira || 0)}</td>
                <td style="font-weight: 600;">$${this.formatCurrency(yearData.grossIncome)}</td>
                <td style="color: var(--accent-red);">$${this.formatCurrency(yearData.taxes.totalTax)}</td>
                <td style="color: var(--text-secondary);">${taxPercentage}%</td>
                <td style="color: var(--accent-green); font-weight: 600;">$${this.formatCurrency(yearData.postTaxIncome)}</td>
            `;

            tbody.appendChild(row);
        });
    }

    displayWithdrawals(containerId, withdrawals) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        const accounts = [
            { key: 'muniBonds', name: 'Municipal Bonds', icon: 'MB', class: 'muni' },
            { key: 'longTermGains', name: 'Long-Term Gains', icon: 'LT', class: 'ltcg' },
            { key: 'shortTermGains', name: 'Short-Term Gains', icon: 'ST', class: 'stcg' },
            { key: 'ira', name: 'Traditional IRA', icon: 'IRA', class: 'ira' }
        ];

        accounts.forEach(account => {
            const amount = withdrawals[account.key] || 0;
            const card = document.createElement('div');
            card.className = 'account-card';
            card.innerHTML = `
        <div class="account-header">
          <div class="account-icon ${account.class}">${account.icon}</div>
          <div class="account-name">${account.name}</div>
        </div>
        <div style="margin-top: 1rem;">
          <div class="slider-label">Withdrawal Amount</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-purple); margin-top: 0.5rem;">
            $${this.formatCurrency(amount)}
          </div>
        </div>
      `;
            container.appendChild(card);
        });
    }

    setupSliders() {
        const { withdrawals } = this.optimalResult;

        // Set slider max values to account balances
        document.getElementById('customMuniBonds').max = this.currentAccounts.muniBonds;
        document.getElementById('customLongTermGains').max = this.currentAccounts.longTermGains;
        document.getElementById('customShortTermGains').max = this.currentAccounts.shortTermGains;
        document.getElementById('customIra').max = this.currentAccounts.ira;

        // Set slider values to optimal withdrawals
        document.getElementById('customMuniBonds').value = withdrawals.muniBonds || 0;
        document.getElementById('customLongTermGains').value = withdrawals.longTermGains || 0;
        document.getElementById('customShortTermGains').value = withdrawals.shortTermGains || 0;
        document.getElementById('customIra').value = withdrawals.ira || 0;

        // Update displayed values
        this.updateSliderValue('customMuniBonds');
        this.updateSliderValue('customLongTermGains');
        this.updateSliderValue('customShortTermGains');
        this.updateSliderValue('customIra');

        // Initial calculation
        this.recalculateCustom();
    }

    updateSliderValue(sliderId) {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(sliderId + 'Value');
        valueDisplay.textContent = '$' + this.formatCurrency(parseFloat(slider.value));
    }

    recalculateCustom() {
        const customWithdrawals = {
            muniBonds: parseFloat(document.getElementById('customMuniBonds').value) || 0,
            longTermGains: parseFloat(document.getElementById('customLongTermGains').value) || 0,
            shortTermGains: parseFloat(document.getElementById('customShortTermGains').value) || 0,
            ira: parseFloat(document.getElementById('customIra').value) || 0
        };

        const customResult = this.optimizer.calculateCustom(customWithdrawals, this.currentConfig);

        // Display custom results
        document.getElementById('customTotalWithdrawn').textContent =
            '$' + this.formatCurrency(customResult.totalWithdrawn);
        document.getElementById('customTotalTax').textContent =
            '$' + this.formatCurrency(customResult.taxResult.totalTax);
        document.getElementById('customFederalTax').textContent =
            '$' + this.formatCurrency(customResult.taxResult.federalTax);
        document.getElementById('customStateTax').textContent =
            '$' + this.formatCurrency(customResult.taxResult.stateTax);
        document.getElementById('customEffectiveRate').textContent =
            customResult.taxResult.effectiveRate.toFixed(2) + '%';

        // Show comparison
        this.displayComparison(customResult);
    }

    displayComparison(customResult) {
        const comparison = this.optimizer.compare(this.optimalResult, customResult);
        const badgeContainer = document.getElementById('comparisonBadge');

        if (Math.abs(comparison.taxDifference) < 1) {
            // Essentially the same
            badgeContainer.innerHTML = `
        <div class="comparison-badge optimal">
          ✓ Optimal Strategy
        </div>
      `;
        } else if (comparison.taxDifference < 0) {
            // Custom is better (unlikely but possible if user found edge case)
            badgeContainer.innerHTML = `
        <div class="comparison-badge better">
          ↓ $${this.formatCurrency(comparison.savings)} less tax
        </div>
      `;
        } else {
            // Custom is worse
            badgeContainer.innerHTML = `
        <div class="comparison-badge worse">
          ↑ $${this.formatCurrency(comparison.savings)} more tax
        </div>
      `;
        }
    }

    showResults() {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.classList.remove('hidden');

        // Smooth scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    formatCurrency(amount) {
        return Math.round(amount).toLocaleString('en-US');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.makiApp = new MakiOptimizationApp();
});
