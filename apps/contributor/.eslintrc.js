module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  plugins: ['@typescript-eslint', 'lodash'],
  rules: {
    'no-unused-vars': [0, { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    "no-restricted-syntax": 0,
    "import/no-unresolved": 0,
    "no-console": [0, { allow: ["info", "warn", "error", "debug"] }],
    "no-plusplus": 0,
    "prefer-destructuring": [1, { object: true, array: false }],
    "no-underscore-dangle": 0,
    "lodash/import-scope": [1, "method"],
    "@next/next/no-img-element": 0,
    "no-sparse-arrays": 0,
    "react-hooks/exhaustive-deps": [
      1,
      {
        additionalHooks: '(useFastRefreshEffect|useSlowRefreshEffect)',
      },
    ],
    // Start temporary rules
    // These rules are here just to keep the lint error to 0 during the migration to the new rule set
    // They need to be removed and fixed as soon as possible
    '@typescript-eslint/ban-ts-comment': [1, { 'ts-ignore': false, 'ts-nocheck': false }],
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    radix: 0,
    'import/no-extraneous-dependencies': 0,
    'jsx-a11y/media-has-caption': 0,
    // Exchange
    "no-param-reassign": [2, { props: true, ignorePropertyModificationsFor: ["state", "memo"] }],
    "react/jsx-key": 1,
    "react/require-default-props": 0,
    "react-hooks/rules-of-hooks": 1,
    "no-nested-ternary": 0,
    "max-classes-per-file": 0,
    "react/no-unescaped-entities": 1
  },
}
