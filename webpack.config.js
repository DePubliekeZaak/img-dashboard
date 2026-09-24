const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

// The JS minimizer. This webpack fork bundles `minimizer-webpack-plugin`
// (its replacement for the classic `terser-webpack-plugin`) as the default
// minimizer, so we use the exact same plugin webpack wires up out of the box.
// Resolve it from webpack's own dependency tree: pnpm does not hoist
// transitive dependencies to the project root, and this keeps the change
// confined to webpack.config.js (no new top-level dependency).
const TerserPlugin = require(require.resolve("minimizer-webpack-plugin", {
  paths: [require.resolve("webpack")],
}));

// Production is driven by the --env ENV=prod flag (set by build:prod / build:dev).
// `serve` runs with ENV=dev and stays in development mode.
const isProduction = (env) => env && env.ENV === "prod";

const config = (env) => {
  const prod = isProduction(env);

  return {
    // ------------------------------------------------------------------
    // ONE APP ENTRY (the scaffold) + webpack-native code splitting
    // ------------------------------------------------------------------
    // The external host loads exactly one script: scripts/dashboard-bundle.js
    // (referenced BY NAME by the host and public/index.html). That script carries
    // webpack's runtime + chunk loader. Every topic page is NOT a separate webpack
    // entry anymore; instead the scaffold holds a route map (src/browser/dashboard/
    // routes.ts) of topic slug -> dynamic import(), so webpack emits each page as a
    // real ASYNC chunk fetched on demand through output.publicPath.
    //
    // There is deliberately no per-topic `library:{window}` contract and no
    // `webpackIgnore` runtime import: pages are loaded as ES modules via the
    // scaffold's route map, and shared/vendor code is extracted by splitChunks.
    entry: {
      scaffold: {
        filename: "scripts/dashboard-bundle.js",
        import: "./src/browser/index.ts",
      },
    },
    output: {
      path: path.resolve(__dirname, "public/"),
      publicPath: prod ? 'https://graphs.publikaan.nl/graphs/' : '/',
      // The scaffold keeps its fixed, host-referenced name. Async chunks (per-page
      // and shared/vendor) are content-hashed so cache-busting is automatic — they
      // are never referenced by name, only by the webpack runtime via publicPath.
      filename: "scripts/dashboard-bundle.js",
      chunkFilename: "scripts/[name].[contenthash].js",
      assetModuleFilename: (pathData) => {
        const filepath = path
          .dirname(pathData.filename)
          .split("/")
          .slice(1)
          .join("/");
        return `./styles/${filepath}/[name].[hash][ext][query]`;
      },
    },
    mode: prod ? "production" : "development",
    optimization: {
      // Enable tree-shaking / side-effect elimination (package.json already has
      // "sideEffects": false).
      usedExports: true,
      minimize: prod,
      // Strip console.* and debugger ONLY from the production artifact. Setting
      // `minimizer` REPLACES webpack's default JS minimizer, so we replicate the
      // default terser options (compress.passes: 2) and keep the default
      // extractComments behavior so *.js.LICENSE.txt files keep being emitted.
      // In dev/serve we leave `minimizer` unset: dev output is unminified anyway,
      // so console.log / debugger stay in for debugging.
      ...(prod
        ? {
            minimizer: [
              new TerserPlugin({
                terserOptions: {
                  compress: {
                    passes: 2,
                    drop_console: true,
                    drop_debugger: true,
                  },
                },
              }),
            ],
          }
        : {}),
      // ------------------------------------------------------------------
      // SPLITCHUNKS — webpack-native shared code extraction
      // ------------------------------------------------------------------
      // chunks: "async" splits ONLY the async (per-page) chunks — the initial
      // scaffold bundle (d3 + styling) stays a single self-contained file so the
      // host still needs exactly one script tag. Among the async page chunks we
      // extract:
      //   - `vendors`   : shared node_modules (d3, lodash, axios, nanostores, ...)
      //   - `shared`    : our shared source (src/charts, src/shared, src/stores,
      //                   src/widgets) used by 2+ pages
      // These are ASYNC chunks loaded by the scaffold's webpack runtime on demand
      // via publicPath. This is exactly what the old (PR #19) splitChunks attempt
      // could not do: there, pages were separate ENTRY bundles and the vendor chunk
      // was an *initial* chunk that no entry could fetch — so `window[<topic>]` was
      // never assigned. Now there is a single entry whose runtime owns the chunk
      // loader, so shared chunks resolve automatically. The old self-contained
      // failure mode no longer applies.
      splitChunks: {
        chunks: "async",
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
            reuseExistingChunk: true,
          },
          shared: {
            test: /[\\/]src[\\/](charts|shared|stores|widgets)[\\/]/,
            name: "shared",
            priority: 5,
            minChunks: 2,
            minSize: 0,
            reuseExistingChunk: true,
          },
        },
      },
    },
    devServer: {
      open: false,
      port: 4446,
      hot: true,
      allowedHosts: 'all',
      client: {
        overlay: true,
        progress: true,
        reconnect: true,
      },
      static: [
        {
          directory: path.join(__dirname, "public"),
          publicPath: "/",
        },
        {
          directory: path.join(__dirname, "public/icons"),
          publicPath: "/styles/icons/",
        },
      ],
    },
    // No source maps shipped to production; keep them in dev.
    devtool: prod ? false : "source-map",
    plugins: [
      new MiniCssExtractPlugin({
        // Keep the CSS name stable (referenced by index.html, deploy_css.sh and the
        // dashboard scaffold's hardcoded stylesheet link).
        filename: "./styles/main.css",
      }),
      new webpack.DefinePlugin({
        ENV: JSON.stringify(env.ENV),
        DOMAIN: JSON.stringify(env.DOMAIN),
        APIBASE: JSON.stringify(env.APIBASE),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/i,
          loader: "ts-loader",
          exclude: ["/node_modules/"],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    resolve: {
      modules: ["public/scripts", "node_modules"],
      extensions: [".ts", ".js"],
    },
  };
};

module.exports = (env) => {
  return config(env);
};
