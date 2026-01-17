// Tax Data for Maki Optimization Application
// 2024/2025 Tax Year Data

const TAX_DATA = {
  // Federal Tax Brackets for 2024
  federalBrackets: {
    single: [
      { min: 0, max: 11600, rate: 0.10 },
      { min: 11600, max: 47150, rate: 0.12 },
      { min: 47150, max: 100525, rate: 0.22 },
      { min: 100525, max: 191950, rate: 0.24 },
      { min: 191950, max: 243725, rate: 0.32 },
      { min: 243725, max: 609350, rate: 0.35 },
      { min: 609350, max: Infinity, rate: 0.37 }
    ],
    marriedFilingJointly: [
      { min: 0, max: 23200, rate: 0.10 },
      { min: 23200, max: 94300, rate: 0.12 },
      { min: 94300, max: 201050, rate: 0.22 },
      { min: 201050, max: 383900, rate: 0.24 },
      { min: 383900, max: 487450, rate: 0.32 },
      { min: 487450, max: 731200, rate: 0.35 },
      { min: 731200, max: Infinity, rate: 0.37 }
    ],
    marriedFilingSeparately: [
      { min: 0, max: 11600, rate: 0.10 },
      { min: 11600, max: 47150, rate: 0.12 },
      { min: 47150, max: 100525, rate: 0.22 },
      { min: 100525, max: 191950, rate: 0.24 },
      { min: 191950, max: 243725, rate: 0.32 },
      { min: 243725, max: 365600, rate: 0.35 },
      { min: 365600, max: Infinity, rate: 0.37 }
    ],
    headOfHousehold: [
      { min: 0, max: 16550, rate: 0.10 },
      { min: 16550, max: 63100, rate: 0.12 },
      { min: 63100, max: 100500, rate: 0.22 },
      { min: 100500, max: 191950, rate: 0.24 },
      { min: 191950, max: 243700, rate: 0.32 },
      { min: 243700, max: 609350, rate: 0.35 },
      { min: 609350, max: Infinity, rate: 0.37 }
    ]
  },

  // Standard Deductions for 2024
  standardDeductions: {
    single: 14600,
    marriedFilingJointly: 29200,
    marriedFilingSeparately: 14600,
    headOfHousehold: 21900
  },

  // Federal Capital Gains Rates (Long-term)
  capitalGainsRates: {
    single: [
      { min: 0, max: 47025, rate: 0.00 },
      { min: 47025, max: 518900, rate: 0.15 },
      { min: 518900, max: Infinity, rate: 0.20 }
    ],
    marriedFilingJointly: [
      { min: 0, max: 94050, rate: 0.00 },
      { min: 94050, max: 583750, rate: 0.15 },
      { min: 583750, max: Infinity, rate: 0.20 }
    ],
    marriedFilingSeparately: [
      { min: 0, max: 47025, rate: 0.00 },
      { min: 47025, max: 291850, rate: 0.15 },
      { min: 291850, max: Infinity, rate: 0.20 }
    ],
    headOfHousehold: [
      { min: 0, max: 63000, rate: 0.00 },
      { min: 63000, max: 551350, rate: 0.15 },
      { min: 551350, max: Infinity, rate: 0.20 }
    ]
  },

  // State Tax Data
  states: {
    AL: { name: 'Alabama', type: 'progressive', brackets: [
      { min: 0, max: 500, rate: 0.02 },
      { min: 500, max: 3000, rate: 0.04 },
      { min: 3000, max: Infinity, rate: 0.05 }
    ]},
    AK: { name: 'Alaska', type: 'none', brackets: [] },
    AZ: { name: 'Arizona', type: 'flat', rate: 0.025 },
    AR: { name: 'Arkansas', type: 'progressive', brackets: [
      { min: 0, max: 5000, rate: 0.02 },
      { min: 5000, max: 10000, rate: 0.04 },
      { min: 10000, max: Infinity, rate: 0.049 }
    ]},
    CA: { name: 'California', type: 'progressive', brackets: [
      { min: 0, max: 10412, rate: 0.01 },
      { min: 10412, max: 24684, rate: 0.02 },
      { min: 24684, max: 38959, rate: 0.04 },
      { min: 38959, max: 54081, rate: 0.06 },
      { min: 54081, max: 68350, rate: 0.08 },
      { min: 68350, max: 349137, rate: 0.093 },
      { min: 349137, max: 418961, rate: 0.103 },
      { min: 418961, max: 698271, rate: 0.113 },
      { min: 698271, max: Infinity, rate: 0.123 }
    ]},
    CO: { name: 'Colorado', type: 'flat', rate: 0.044 },
    CT: { name: 'Connecticut', type: 'progressive', brackets: [
      { min: 0, max: 10000, rate: 0.03 },
      { min: 10000, max: 50000, rate: 0.05 },
      { min: 50000, max: 100000, rate: 0.055 },
      { min: 100000, max: 200000, rate: 0.06 },
      { min: 200000, max: 250000, rate: 0.065 },
      { min: 250000, max: 500000, rate: 0.069 },
      { min: 500000, max: Infinity, rate: 0.0699 }
    ]},
    DE: { name: 'Delaware', type: 'progressive', brackets: [
      { min: 0, max: 2000, rate: 0.022 },
      { min: 2000, max: 5000, rate: 0.039 },
      { min: 5000, max: 10000, rate: 0.048 },
      { min: 10000, max: 20000, rate: 0.052 },
      { min: 20000, max: 25000, rate: 0.0555 },
      { min: 25000, max: 60000, rate: 0.066 },
      { min: 60000, max: Infinity, rate: 0.066 }
    ]},
    FL: { name: 'Florida', type: 'none', brackets: [] },
    GA: { name: 'Georgia', type: 'progressive', brackets: [
      { min: 0, max: 750, rate: 0.01 },
      { min: 750, max: 2250, rate: 0.02 },
      { min: 2250, max: 3750, rate: 0.03 },
      { min: 3750, max: 5250, rate: 0.04 },
      { min: 5250, max: 7000, rate: 0.05 },
      { min: 7000, max: Infinity, rate: 0.0575 }
    ]},
    HI: { name: 'Hawaii', type: 'progressive', brackets: [
      { min: 0, max: 2400, rate: 0.014 },
      { min: 2400, max: 4800, rate: 0.032 },
      { min: 4800, max: 9600, rate: 0.055 },
      { min: 9600, max: 14400, rate: 0.064 },
      { min: 14400, max: 19200, rate: 0.068 },
      { min: 19200, max: 24000, rate: 0.072 },
      { min: 24000, max: 36000, rate: 0.076 },
      { min: 36000, max: 48000, rate: 0.079 },
      { min: 48000, max: 150000, rate: 0.0825 },
      { min: 150000, max: 175000, rate: 0.09 },
      { min: 175000, max: 200000, rate: 0.10 },
      { min: 200000, max: Infinity, rate: 0.11 }
    ]},
    ID: { name: 'Idaho', type: 'flat', rate: 0.058 },
    IL: { name: 'Illinois', type: 'flat', rate: 0.0495 },
    IN: { name: 'Indiana', type: 'flat', rate: 0.0315 },
    IA: { name: 'Iowa', type: 'flat', rate: 0.06 },
    KS: { name: 'Kansas', type: 'progressive', brackets: [
      { min: 0, max: 15000, rate: 0.031 },
      { min: 15000, max: 30000, rate: 0.0525 },
      { min: 30000, max: Infinity, rate: 0.057 }
    ]},
    KY: { name: 'Kentucky', type: 'flat', rate: 0.04 },
    LA: { name: 'Louisiana', type: 'progressive', brackets: [
      { min: 0, max: 12500, rate: 0.0185 },
      { min: 12500, max: 50000, rate: 0.035 },
      { min: 50000, max: Infinity, rate: 0.0425 }
    ]},
    ME: { name: 'Maine', type: 'progressive', brackets: [
      { min: 0, max: 24500, rate: 0.058 },
      { min: 24500, max: 58050, rate: 0.0675 },
      { min: 58050, max: Infinity, rate: 0.0715 }
    ]},
    MD: { name: 'Maryland', type: 'progressive', brackets: [
      { min: 0, max: 1000, rate: 0.02 },
      { min: 1000, max: 2000, rate: 0.03 },
      { min: 2000, max: 3000, rate: 0.04 },
      { min: 3000, max: 100000, rate: 0.0475 },
      { min: 100000, max: 125000, rate: 0.05 },
      { min: 125000, max: 150000, rate: 0.0525 },
      { min: 150000, max: 250000, rate: 0.055 },
      { min: 250000, max: Infinity, rate: 0.0575 }
    ]},
    MA: { name: 'Massachusetts', type: 'flat', rate: 0.05 },
    MI: { name: 'Michigan', type: 'flat', rate: 0.0425 },
    MN: { name: 'Minnesota', type: 'progressive', brackets: [
      { min: 0, max: 30070, rate: 0.0535 },
      { min: 30070, max: 98760, rate: 0.068 },
      { min: 98760, max: 183340, rate: 0.0785 },
      { min: 183340, max: Infinity, rate: 0.0985 }
    ]},
    MS: { name: 'Mississippi', type: 'flat', rate: 0.05 },
    MO: { name: 'Missouri', type: 'progressive', brackets: [
      { min: 0, max: 1207, rate: 0.015 },
      { min: 1207, max: 2414, rate: 0.02 },
      { min: 2414, max: 3621, rate: 0.025 },
      { min: 3621, max: 4828, rate: 0.03 },
      { min: 4828, max: 6035, rate: 0.035 },
      { min: 6035, max: 7242, rate: 0.04 },
      { min: 7242, max: 8449, rate: 0.045 },
      { min: 8449, max: Infinity, rate: 0.0495 }
    ]},
    MT: { name: 'Montana', type: 'progressive', brackets: [
      { min: 0, max: 20500, rate: 0.0475 },
      { min: 20500, max: Infinity, rate: 0.0575 }
    ]},
    NE: { name: 'Nebraska', type: 'progressive', brackets: [
      { min: 0, max: 3700, rate: 0.0246 },
      { min: 3700, max: 22170, rate: 0.0351 },
      { min: 22170, max: 35730, rate: 0.0501 },
      { min: 35730, max: Infinity, rate: 0.0664 }
    ]},
    NV: { name: 'Nevada', type: 'none', brackets: [] },
    NH: { name: 'New Hampshire', type: 'none', brackets: [] },
    NJ: { name: 'New Jersey', type: 'progressive', brackets: [
      { min: 0, max: 20000, rate: 0.014 },
      { min: 20000, max: 35000, rate: 0.0175 },
      { min: 35000, max: 40000, rate: 0.035 },
      { min: 40000, max: 75000, rate: 0.05525 },
      { min: 75000, max: 500000, rate: 0.0637 },
      { min: 500000, max: 1000000, rate: 0.0897 },
      { min: 1000000, max: Infinity, rate: 0.1075 }
    ]},
    NM: { name: 'New Mexico', type: 'progressive', brackets: [
      { min: 0, max: 5500, rate: 0.017 },
      { min: 5500, max: 11000, rate: 0.032 },
      { min: 11000, max: 16000, rate: 0.047 },
      { min: 16000, max: 210000, rate: 0.049 },
      { min: 210000, max: Infinity, rate: 0.059 }
    ]},
    NY: { name: 'New York', type: 'progressive', brackets: [
      { min: 0, max: 8500, rate: 0.04 },
      { min: 8500, max: 11700, rate: 0.045 },
      { min: 11700, max: 13900, rate: 0.0525 },
      { min: 13900, max: 80650, rate: 0.055 },
      { min: 80650, max: 215400, rate: 0.06 },
      { min: 215400, max: 1077550, rate: 0.0685 },
      { min: 1077550, max: 5000000, rate: 0.0965 },
      { min: 5000000, max: 25000000, rate: 0.103 },
      { min: 25000000, max: Infinity, rate: 0.109 }
    ]},
    NC: { name: 'North Carolina', type: 'flat', rate: 0.0475 },
    ND: { name: 'North Dakota', type: 'flat', rate: 0.0295 },
    OH: { name: 'Ohio', type: 'progressive', brackets: [
      { min: 0, max: 26050, rate: 0.0275 },
      { min: 26050, max: 46100, rate: 0.031 },
      { min: 46100, max: 92150, rate: 0.035 },
      { min: 92150, max: 115300, rate: 0.0375 },
      { min: 115300, max: Infinity, rate: 0.0399 }
    ]},
    OK: { name: 'Oklahoma', type: 'progressive', brackets: [
      { min: 0, max: 1000, rate: 0.0025 },
      { min: 1000, max: 2500, rate: 0.0075 },
      { min: 2500, max: 3750, rate: 0.0175 },
      { min: 3750, max: 4900, rate: 0.0275 },
      { min: 4900, max: 7200, rate: 0.0375 },
      { min: 7200, max: Infinity, rate: 0.0475 }
    ]},
    OR: { name: 'Oregon', type: 'progressive', brackets: [
      { min: 0, max: 4050, rate: 0.0475 },
      { min: 4050, max: 10200, rate: 0.0675 },
      { min: 10200, max: 125000, rate: 0.0875 },
      { min: 125000, max: Infinity, rate: 0.099 }
    ]},
    PA: { name: 'Pennsylvania', type: 'flat', rate: 0.0307 },
    RI: { name: 'Rhode Island', type: 'progressive', brackets: [
      { min: 0, max: 73450, rate: 0.0375 },
      { min: 73450, max: 166950, rate: 0.0475 },
      { min: 166950, max: Infinity, rate: 0.0599 }
    ]},
    SC: { name: 'South Carolina', type: 'progressive', brackets: [
      { min: 0, max: 3200, rate: 0.03 },
      { min: 3200, max: 16040, rate: 0.064 },
      { min: 16040, max: Infinity, rate: 0.07 }
    ]},
    SD: { name: 'South Dakota', type: 'none', brackets: [] },
    TN: { name: 'Tennessee', type: 'none', brackets: [] },
    TX: { name: 'Texas', type: 'none', brackets: [] },
    UT: { name: 'Utah', type: 'flat', rate: 0.0465 },
    VT: { name: 'Vermont', type: 'progressive', brackets: [
      { min: 0, max: 45400, rate: 0.0335 },
      { min: 45400, max: 110050, rate: 0.066 },
      { min: 110050, max: 229550, rate: 0.076 },
      { min: 229550, max: Infinity, rate: 0.0875 }
    ]},
    VA: { name: 'Virginia', type: 'progressive', brackets: [
      { min: 0, max: 3000, rate: 0.02 },
      { min: 3000, max: 5000, rate: 0.03 },
      { min: 5000, max: 17000, rate: 0.05 },
      { min: 17000, max: Infinity, rate: 0.0575 }
    ]},
    WA: { name: 'Washington', type: 'none', brackets: [] },
    WV: { name: 'West Virginia', type: 'progressive', brackets: [
      { min: 0, max: 10000, rate: 0.0236 },
      { min: 10000, max: 25000, rate: 0.0315 },
      { min: 25000, max: 40000, rate: 0.0354 },
      { min: 40000, max: 60000, rate: 0.0472 },
      { min: 60000, max: Infinity, rate: 0.0512 }
    ]},
    WI: { name: 'Wisconsin', type: 'progressive', brackets: [
      { min: 0, max: 13810, rate: 0.0354 },
      { min: 13810, max: 27630, rate: 0.0465 },
      { min: 27630, max: 304170, rate: 0.0627 },
      { min: 304170, max: Infinity, rate: 0.0765 }
    ]},
    WY: { name: 'Wyoming', type: 'none', brackets: [] },
    DC: { name: 'District of Columbia', type: 'progressive', brackets: [
      { min: 0, max: 10000, rate: 0.04 },
      { min: 10000, max: 40000, rate: 0.06 },
      { min: 40000, max: 60000, rate: 0.065 },
      { min: 60000, max: 250000, rate: 0.085 },
      { min: 250000, max: 500000, rate: 0.0925 },
      { min: 500000, max: 1000000, rate: 0.0975 },
      { min: 1000000, max: Infinity, rate: 0.1075 }
    ]}
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TAX_DATA;
}
