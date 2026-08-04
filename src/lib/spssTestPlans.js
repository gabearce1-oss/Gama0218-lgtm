// Test catalog for the SPSS request flow. Nothing runs here — this defines
// which tests are sanctioned, what each one needs, and what imaging it produces.

// roles: 'dv' single dependent, 'ivs' multi predictors, 'vars' multi variables,
// 'factor' single grouping variable.
export const TEST_CATALOG = [
  {
    id: 'DESC',
    name: 'Descriptives',
    family: 'Description',
    purpose: 'Mean, SD, min, max across selected scale variables. The baseline every run starts from.',
    needs: ['vars'],
    graph: 'Histogram with normal curve per variable',
    assumptions: ['Scale measurement level', 'Missing values excluded listwise'],
  },
  {
    id: 'FREQ',
    name: 'Frequencies',
    family: 'Description',
    purpose: 'Counts and percentages for nominal or ordinal variables — act distribution, status distribution.',
    needs: ['vars'],
    graph: 'Bar chart of category counts',
    assumptions: ['Nominal or ordinal measurement level'],
  },
  {
    id: 'CORR',
    name: 'Bivariate Correlation',
    family: 'Association',
    purpose: 'Pearson r between selected scale variables, two-tailed significance.',
    needs: ['vars'],
    graph: 'Scatterplot matrix',
    assumptions: ['Linear relationship', 'Scale measurement level', 'No extreme outliers'],
  },
  {
    id: 'REG',
    name: 'Linear Regression',
    family: 'Prediction',
    purpose: 'Predict one outcome from a set of predictors. Used to re-derive the RF 1.5 Ω model by hand.',
    needs: ['dv', 'ivs'],
    graph: 'Standardized residual plot + P-P plot',
    assumptions: ['Linearity', 'Independence of residuals', 'Homoscedasticity', 'No multicollinearity (VIF < 10)'],
  },
  {
    id: 'ANOVA',
    name: 'One-Way ANOVA',
    family: 'Group difference',
    purpose: 'Compare a scale outcome across groups — for example Ω by narrative act.',
    needs: ['dv', 'factor'],
    graph: 'Means plot with error bars + boxplot by group',
    assumptions: ['Homogeneity of variance (Levene)', 'Independent groups', 'Approximate normality'],
  },
  {
    id: 'TTEST',
    name: 'Independent-Samples T-Test',
    family: 'Group difference',
    purpose: 'Compare a scale outcome between exactly two groups.',
    needs: ['dv', 'factor'],
    graph: 'Boxplot by group',
    assumptions: ['Two groups only', 'Equal variances tested via Levene'],
  },
  {
    id: 'RELY',
    name: 'Reliability (Cronbach α)',
    family: 'Instrument',
    purpose: 'Internal consistency of a component set — do CLS/BIS/SII/MRF hang together as one instrument?',
    needs: ['vars'],
    graph: 'Item-total correlation table',
    assumptions: ['Three or more items', 'Same measurement direction'],
  },
  {
    id: 'FACT',
    name: 'Factor Analysis (PCA)',
    family: 'Instrument',
    purpose: 'Whether the component scores collapse onto fewer underlying dimensions.',
    needs: ['vars'],
    graph: 'Scree plot + rotated component matrix',
    assumptions: ['KMO > .60', 'Bartlett test significant', 'Cases-to-variables ratio documented'],
  },
];

export const SAMPLING_FRAMES = [
  { id: 'ALL', label: 'Full frame — all 44 Vault II chapters', filter: null },
  { id: 'SCORED', label: 'Scored chapters only', filter: 'CHSTAT = "scored"' },
  { id: 'ACT1', label: 'Act I only', filter: 'ACT = "I"' },
  { id: 'ACT2', label: 'Act II only', filter: 'ACT = "II"' },
  { id: 'ACT3', label: 'Act III only', filter: 'ACT = "III"' },
  { id: 'ELITE', label: 'Elite gate — Ω ≥ 109.5', filter: 'OMEGA >= 109.5' },
];

export const REQUEST_FLOW = [
  'Select the test and the sampling frame — never run everything and read the leftovers.',
  'Declare the variables in their roles before the syntax exists.',
  'Review the assumption checklist; an unmet assumption is recorded, not ignored.',
  'Generate the request form and syntax file together — they are one artifact pair.',
  'Hand both to the analyst. The run happens outside, air-gapped.',
  'Signed output returns as a forensic footprint entry.',
];