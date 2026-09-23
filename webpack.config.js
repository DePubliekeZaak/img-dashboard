const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

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
      // Per-page entry bundles keep their stable, fixed names: they are referenced by
      // name from the static HTML / external pages (window.<page> mounted libraries that
      // are loaded at runtime), so they must NOT be content-hashed or those references
      // would break. Only the runtime-managed shared chunks (splitChunks) are content-hashed
      // for long-term caching; webpack's runtime injects those <script> tags itself, so no
      // static reference needs updating.
      filename: "scripts/[name].bundle.js",
      chunkFilename: prod
        ? "scripts/[name].[contenthash:8].js"
        : "scripts/[name].bundle.js",
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
      splitChunks: {
        // IMPORTANT ARCHITECTURE CONSTRAINT: each per-page bundle is loaded STANDALONE
        // by the dashboard scaffold via a runtime import() and consumed synchronously
        // (`new window[topic](...)`), so the page bundles must find their shared chunks
        // ALREADY LOADED. That is satisfied by emitting ONE fixed-named `vendor` chunk
        // (all of node_modules) and preloading it in public/index.html as a <script>
        // BEFORE the scaffold. webpack's chunk runtime picks the preloaded chunk out of
        // the shared `webpackChunkeiti_graphs` array and resolves synchronously, so
        // window.<page> is assigned without turning the library export into a Promise.
        // Webpack's default cache groups are disabled so only this one named chunk is
        // produced (predictable name for the HTML wiring, no numeric auto chunks).
        chunks: "all",
        // Conservative thresholds: only split a chunk large enough to be worth the
        // extra round-trip, and keep the per-page request count low.
        minSize: 20000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: false,
          default: false,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            priority: 10,
            chunks: "all",
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
