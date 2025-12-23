const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const isProduction = process.env.NODE_ENV == "production";

const config = (env) => {
  return {
    entry: {
      scaffold: {
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
      fs_daadwerkelijk_herstel: {
        filename: "scripts/fs_daadwerkelijk_herstel.bundle.js",
        import: "./src/pages/fs_daadwerkelijk_herstel/index.ts",
        library: {
          name: "fs_daadwerkelijk_herstel",
          type: "window",
          export: "default",
        },
      },
      fs_aanvullende_vaste_vergoeding: {
        filename: "scripts/fs_aanvullende_vaste_vergoeding.bundle.js",
        import: "./src/pages/fs_aanvullende_vaste_vergoeding/index.ts",
        library: {
          name: "fs_aanvullende_vaste_vergoeding",
          type: "window",
          export: "default",
        },
      },
      fs_historie: {
        filename: "scripts/fs_historie.bundle.js",
        import: "./src/pages/fs_historie/index.ts",
        library: {
          name: "fs_historie",
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
      ims_herbeoordeling: {
        filename: "scripts/ims-herbeoordeling.bundle.js",
        import: "./src/pages/ims-herbeoordeling/index.ts",
        library: {
          name: "ims-herbeoordeling",
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
      publicPath: process.env.NODE_ENV === 'production' ? 'https://graphs.publikaan.nl/graphs/' : '/',
      filename: "scripts/[name].bundle.js",
      assetModuleFilename: (pathData) => {
        const filepath = path
          .dirname(pathData.filename)
          .split("/")
          .slice(1)
          .join("/");
        return `./styles/${filepath}/[name].[hash][ext][query]`;
      },
    },
    mode: "development",
    optimization: {
      usedExports: false,
    },
    devServer: {
      open: false,
      port: 4444,
      hot: true,
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
    devtool: "source-map",
    plugins: [
      new MiniCssExtractPlugin({
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
  let c = config(env);

  if (isProduction) {
    c.mode = "production";
  } else {
    c.mode = "development";
  }
  return c;
};
