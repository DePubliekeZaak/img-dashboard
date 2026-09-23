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
    entry: {
      scaffold: {
        filename: "scripts/dashboard-bundle.js",
        import: "./src/browser/index.ts",
      },
      actueel: {
        filename: "scripts/actueel.bundle.js",
        import: "./src/pages/actueel/index.ts",
        library: {
          name: "actueel",
          type: "window",
          export: "default",
        },
      },
      regelingen: {
        filename: "scripts/regelingen.bundle.js",
        import: "./src/pages/regelingen/index.ts",
        library: {
          name: "regelingen",
          type: "window",
          export: "default",
        },
      },
      fs_overzicht: {
        filename: "scripts/fs_overzicht.bundle.js",
        import: "./src/pages/fs_overzicht/index.ts",
        library: {
          name: "fs_overzicht",
          type: "window",
          export: "default",
        },
      },
      fs_maatwerk: {
        filename: "scripts/fs_maatwerk.bundle.js",
        import: "./src/pages/fs_maatwerk/index.ts",
        library: {
          name: "fs_maatwerk",
          type: "window",
          export: "default",
        },
      },
      fs_vaste_vergoeding: {
        filename: "scripts/fs_vaste_vergoeding.bundle.js",
        import: "./src/pages/fs_vaste_vergoeding/index.ts",
        library: {
          name: "fs_vaste_vergoeding",
          type: "window",
          export: "default",
        },
      },
      aos: {
        filename: "scripts/aos.bundle.js",
        import: "./src/pages/aos/index.ts",
        library: {
          name: "aos",
          type: "window",
          export: "default",
        },
      },
      ims_overzicht: {
        filename: "scripts/ims-overzicht.bundle.js",
        import: "./src/pages/ims-overzicht/index.ts",
        library: {
          name: "ims-overzicht",
          type: "window",
          export: "default",
        },
      },
      ims_volwassenen: {
        filename: "scripts/ims-volwassenen.bundle.js",
        import: "./src/pages/ims-volwassenen/index.ts",
        library: {
          name: "ims-volwassenen",
          type: "window",
          export: "default",
        },
      },
      ims_kinderen_jongeren: {
        filename: "scripts/ims-kinderen-jongeren.bundle.js",
        import: "./src/pages/ims-kinderen-jongeren/index.ts",
        library: {
          name: "ims-kinderen-jongeren",
          type: "window",
          export: "default",
        },
      },
      wd_overzicht: {
        filename: "scripts/wd-overzicht.bundle.js",
        import: "./src/pages/wd-overzicht/index.ts",
        library: {
          name: "wd-overzicht",
          type: "window",
          export: "default",
        },
      },
      wd_wonen: {
        filename: "scripts/wd-wonen.bundle.js",
        import: "./src/pages/wd-wonen/index.ts",
        library: {
          name: "wd-wonen",
          type: "window",
          export: "default",
        },
      },
      wd_nietwonen: {
        filename: "scripts/wd-nietwonen.bundle.js",
        import: "./src/pages/wd-nietwonen/index.ts",
        library: {
          name: "wd-nietwonen",
          type: "window",
          export: "default",
        },
      },
      wd_namco: {
        filename: "scripts/wd-namco.bundle.js",
        import: "./src/pages/wd-namco/index.ts",
        library: {
          name: "wd-namco",
          type: "window",
          export: "default",
        },
      },
      waardering: {
        filename: "scripts/waardering.bundle.js",
        import: "./src/pages/waardering/index.ts",
        library: {
          name: "waardering",
          type: "window",
          export: "default",
        },
      },
      bezwaren: {
        filename: "scripts/bezwaren.bundle.js",
        import: "./src/pages/bezwaren/index.ts",
        library: {
          name: "bezwaren",
          type: "window",
          export: "default",
        },
      },
      specials: {
        filename: "scripts/specials.bundle.js",
        import: "./src/pages/specials/index.ts",
        library: {
          name: "specials",
          type: "window",
          export: "default",
        },
      },
      gemeente: {
        filename: "scripts/gemeente.bundle.js",
        import: "./src/pages/gemeente/index.ts",
        library: {
          name: "gemeente",
          type: "window",
          export: "default",
        },
      },
      correcties: {
        filename: "scripts/correcties.bundle.js",
        import: "./src/pages/correcties/index.ts",
        library: {
          name: "correcties",
          type: "window",
          export: "default",
        },
      },
      charts: {
        import: "./src/charts/index.ts",
      },
      css: {
        import: "/styling/main.scss",
      },
    },
    output: {
      path: path.resolve(__dirname, "public/"),
      publicPath: prod ? 'https://graphs.publikaan.nl/graphs/' : '/',
      // Every emitted bundle keeps a stable, fixed name. There are no content-hashed
      // chunk files and NO split chunks in this build:
      //   - The per-page entry bundles (and the scaffold) keep their fixed names because
      //     they are referenced BY NAME at runtime: the scaffold loads each page via
      //     `import("${BUNDLE_BASE}<topic>.bundle.js")` and mounts the synchronous
      //     `window[<topic>]` export, and the external app requests dashboard-bundle.js
      //     by its fixed URL. Content-hashing would break those name-based references.
      //   - Each bundle is SELF-CONTAINED: every node_module it needs is inlined into it
      //     (no `splitChunks`, no shared vendor chunk). This is what makes the standalone
      //     runtime import safe - a page bundle never depends on an externally preloaded
      //     chunk, so `window[<topic>]` is assigned synchronously with no preload.
      //
      // chunkFilename is therefore never exercised (there are no async chunks); it is
      // kept unhashed for consistency.
      filename: "scripts/[name].bundle.js",
      chunkFilename: "scripts/[name].bundle.js",
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
      // extractComments behavior so *.bundle.js.LICENSE.txt files keep being
      // emitted. In dev/serve we leave `minimizer` unset: dev output is
      // unminified anyway, so console.log / debugger stay in for debugging.
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
      // IMPORTANT ARCHITECTURE CONSTRAINT: each per-page bundle is loaded STANDALONE
      // by the dashboard scaffold via a runtime import() (`${BUNDLE_BASE}<topic>.bundle.js`)
      // and consumed synchronously (`new window[topic](...)`). The page bundles must
      // therefore be SELF-CONTAINED: they cannot depend on any shared chunk (e.g. a split
      // `vendor` chunk) that has to be preloaded into the shared webpackChunk* array BEFORE
      // they run - the external web app only ever loads dashboard-bundle.js, never our
      // index.html or a vendor preload. Splitting out a `vendor` chunk (as was tried in
      // the PR #19 optimization) broke this: every page bundle AND the scaffold boot were
      // gated on the vendor chunk id being already present, with no async chunk-loader in
      // any bundle to fetch it, so `window[topic]` was never assigned. Reverting splitChunks
      // restores self-contained bundles: each page inlines its own node_modules, sets
      // `window[<topic>]` synchronously, and mounts with zero preloads.
      //
      // Trade-off: node_modules are duplicated across every page bundle (larger per-page
      // download, no shared-cache benefit) - acceptable here given the hard loading
      // constraint. Cache-busting note: page bundles keep fixed unhashed names (referenced
      // by name), so a content change needs the existing manual `?v=` cache-buster approach.
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
