import { readFileSync } from "fs";
import node from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
// import babel from "rollup-plugin-babel";
import json from "@rollup/plugin-json";
import meta from "./package.json" assert { type: "json" };

// Extract copyrights from the LICENSE.
const copyrights = readFileSync("./LICENSE", "utf-8")
  .split(/\n/g)
  .filter((line) => /^copyright\s+/i.test(line))
  .map((line) => line.replace(/^copyright\s+/i, ""));

const filename = "MultiAutoSelect";

// Observable Plot style
const config = {
  input: "src/index.js",
  external: ["@observablehq/stdlib", "sortablejs", "d3-format"],
  output: {
    indent: false,
    banner: `// ${meta.name} v${meta.version} Copyright ${copyrights.join(", ")}`,
    extend: true,
    globals: {
      "@observablehq/stdlib": "html",
      sortablejs: "Sortable",
      "d3-format": "d3format",
    },
    name: "MultiAutoSelect",
  },
  plugins: [commonjs(), json(), node()],
};

export default [
  {
    ...config,
    output: {
      ...config.output,
      format: "umd",
      file: `dist/${filename}.js`,
    },
  },
  {
    ...config,
    output: {
      ...config.output,
      format: "esm",
      file: `dist/${filename}.esm.js`,
    },
  },
  {
    ...config,
    output: {
      ...config.output,
      format: "umd",
      file: `dist/${filename}.min.js`,
    },
    plugins: [
      ...config.plugins,
      terser({
        output: {
          preamble: config.output.banner,
        },
      }),
    ],
  },
];
