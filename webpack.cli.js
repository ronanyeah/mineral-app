const webpack = require("webpack");
const { resolve } = require("path");

const outFolder = resolve("./cli");

module.exports = {
  target: "node",
  mode: "production",
  entry: "./src/cli/index.ts",
  output: {
    filename: "index.js",
    path: outFolder,
  },
  stats: "normal",
  infrastructureLogging: {
    level: "warn",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new webpack.NoEmitOnErrorsPlugin()],
};
