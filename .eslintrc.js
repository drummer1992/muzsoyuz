module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 1
      }
    ],
    "padding-line-between-statements": [
      "error",
      {
        "blankLine": "always",
        "prev": [
          "const",
          "let",
          "var"
        ],
        "next": "*"
      },
      {
        "blankLine": "any",
        "prev": [
          "const",
          "let",
          "var"
        ],
        "next": [
          "const",
          "let",
          "var"
        ]
      },
      {
        "blankLine": "always",
        "prev": "*",
        "next": "return"
      },
      {
        "blankLine": "always",
        "prev": "*",
        "next": "block-like"
      },
      {
        "blankLine": "always",
        "prev": "block-like",
        "next": "*"
      }
    ],
    "padded-blocks": [
      "error",
      "never"
    ],
    "comma-dangle": [
      "error",
      "always-multiline"
    ],
    "comma-spacing": [
      "error",
      {
        "before": false,
        "after": true
      }
    ],
    "array-bracket-spacing": [
      "error",
      "never"
    ],
    "require-atomic-updates": "off",
    "no-mixed-operators": ["error", {
      "groups": [
        ["&&", "?:"],
      ]
    }],
    "operator-linebreak": ["error", "before"],
    "quote-props": [
      "warn",
      "as-needed"
    ],
    "no-constant-condition": [
      "error",
      {
        "checkLoops": false
      }
    ],
    // require function declarations instead of expressions
    "func-style": [
      "warn",
      "declaration",
      {
        "allowArrowFunctions": true
      }
    ],
    // disallow declaration of variables already declared in the outer scope
    // "no-shadow": "warn",

    // require let or const instead of var
    "require-await": "warn",
    "no-var": "warn",
    "no-undef": "warn",
    "max-len": [
      "warn",
      120
    ],
    "no-unexpected-multiline": "error",
    // require or disallow use of semicolons instead of ASI
    "semi": [
      "warn",
      "never"
    ],
    // require the use of === and !== except null comparison
    "eqeqeq": [
      "warn",
      "smart"
    ],
    // specify whether double or single quotes should be used
    "quotes": [
      "warn",
      "single",
      "avoid-escape"
    ],
    // require space before/after arrow function"s arrow
    "arrow-spacing": [
      "warn",
      {
        "before": true,
        "after": true
      }
    ],
    "arrow-parens": [
      "warn",
      "as-needed"
    ],
    // suggest using of const declaration for variables that are never modified after declared
    "prefer-const": [
      "warn",
      {
        "destructuring": "all"
      }
    ],
    // restrict what can be thrown as an exception
    "no-throw-literal": "warn",
    // disallow Unused Expressions
    "no-unused-expressions": [
      "warn",
      {
        "allowShortCircuit": true
      }
    ],
    // require padding inside curly braces
    "object-curly-spacing": [
      "warn",
      "always"
    ],
    "no-sequences": "error",
    "valid-jsdoc": [
      2,
      {
        "requireReturn": false,
        "requireParamDescription": false,
        "requireReturnDescription": false,
        "prefer": {
          "arg": "param",
          "argument": "param",
          "return": "returns"
        },
        "preferType": {
          "string": "String",
          "number": "Number",
          "function": "Function"
        }
      }
    ]
  },
};
