const { resolve } = require("path");
const webpack = require("webpack");

const publicFolder = resolve("./public");

const { RPC } = process.env;

module.exports = (env) => {
  const devMode = Boolean(env.WEBPACK_SERVE);

  const loaderConfig = {
    loader: "elm-webpack-loader",
    options: {
      debug: false,
      optimize: !devMode,
      cwd: __dirname,
    },
  };

  const elmLoader = devMode
    ? [{ loader: "elm-reloader" }, loaderConfig]
    : [loaderConfig];

  return {
    mode: devMode ? "development" : "production",
    entry: "./src/index.ts",
    output: {
      publicPath: "/",
      path: publicFolder,
      filename: "bundle.js",
    },
    stats: devMode ? "errors-warnings" : "normal",
    infrastructureLogging: {
      level: "warn",
    },
    devServer: {
      port: 8000,
      hot: "only",
    },
    module: {
      rules: [
        {
          test: /\.elm$/,
          exclude: [/elm-stuff/, /node_modules/],
          use: elmLoader,
        },
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
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        __RPC_URL: JSON.stringify(RPC),
      }),
    ],
  };
};
