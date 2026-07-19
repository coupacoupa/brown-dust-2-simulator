import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // The simulation core is a pure, framework-free engine: no React, no
    // components, no browser APIs. This boundary makes that claim checkable.
    files: ["lib/sim/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["react", "react-dom", "next/*"], message: "lib/sim is framework-free — no React/Next imports." },
            { group: ["@/components/*", "@/hooks/*", "@/app/*"], message: "lib/sim must not depend on the UI layer." },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
