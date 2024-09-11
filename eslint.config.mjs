import typescriptEslint from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react";
import {fixupPluginRules} from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import {fileURLToPath} from "node:url";
import js from "@eslint/js";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        "react-hooks": fixupPluginRules(reactHooks),
        react,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
            Atomics: "readonly",
            SharedArrayBuffer: "readonly",
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-var-requires": 0,

        "prettier/prettier": ["error", {
            "no-inline-styles": false,
        }],

        semi: 0,
        "no-tabs": 0,
        "linebreak-style": 1,
        "no-console": 1,
        quotes: [0, "double"],
        "no-trailing-spaces": "error",
        "object-curly-spacing": ["error", "always"],
        "eol-last": ["error", "always"],
        "@typescript-eslint/no-explicit-any": ["error"],
        "@/semi": ["error", "never"],
        "@typescript-eslint/newline-per-chained-call": 0,
        "@typescript-eslint/func-names": 0,
        "@typescript-eslint/no-use-before-define": 0,
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/jsx-one-expression-per-line": 0,
        "react/jsx-filename-extension": 0,
        "import/prefer-default-export": 0,
        "react/jsx-max-props-per-line": 0,
        "react/jsx-first-prop-new-line": 0,
        "react/prop-types": 0,
        "react/jsx-no-bind": 0,
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "react/jsx-closing-bracket-location": 0,
        "react/button-has-type": 0,
        "jsx-a11y/click-events-have-key-events": 0,
        "jsx-a11y/no-static-element-interactions": 0,
        "jsx-a11y/label-has-associated-control": 0,
        "jsx-a11y/label-has-for": 0,
        "jsx-a11y/no-noninteractive-element-interactions": 0,
        "jsx-a11y/control-has-associated-label": 0,
        "react/jsx-props-no-spreading": 0,
        "react/no-unescaped-entities": 0,
        "react/jsx-fragments": 0,

        indent: ["error", 4, {
            SwitchCase: 1,
        }],
    },
}];
