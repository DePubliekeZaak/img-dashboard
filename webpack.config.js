const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const isProduction = process.env.NODE_ENV == "production";

const config = (env) =>  {

  return {
    entry: {
      scaffold: {
        import: "./src/browser/index.ts",
      },
      actueel: {
        filename: "scripts/actueel.bundle.js",
        import: "./src/pages/actueel/index.ts",
        library: {
          name: 'actueel',
          type: 'window',
          export: 'default',
        }
      },
      nieuw_beleid: {
        filename: "scripts/nieuw-beleid.bundle.js",
        import: "./src/pages/nieuw-beleid/index.ts",
        library: {
          name: 'nieuw-beleid',
          type: 'window',
          export: 'default',
        }
      },
      history: {
        filename: "scripts/historie.bundle.js",
        import: "./src/pages/historie/index.ts",
        library: {
          name: 'historie',
          type: 'window',
          export: 'default',
        }
      },
      aos: {
        filename: "scripts/aos.bundle.js",
        import: "./src/pages/aos/index.ts",
        library: {
          name: 'aos',
          type: 'window',
          export: 'default',
        }
      },
      schademeldingen: {
        filename: "scripts/schademeldingen.bundle.js",
        import: "./src/pages/schademeldingen/index.ts",
        library: {
          name: 'schademeldingen',
          type: 'window',
          export: 'default',
        }
      },
      vergoedingen: {
        filename: "scripts/vergoedingen.bundle.js",
        import: "./src/pages/vergoedingen/index.ts",
        library: {
          name: 'vergoedingen',
          type: 'window',
          export: 'default',
        }
      },
      besluiten: {
        filename: "scripts/besluiten.bundle.js",
        import: "./src/pages/besluiten/index.ts",
        library: {
          name: 'besluiten',
          type: 'window',
          export: 'default',
        }
      },
      duur: {
        filename: "scripts/duur.bundle.js",
        import: "./src/pages/duur/index.ts",
        library: {
          name: 'duur',
          type: 'window',
          export: 'default',
        }
      },
      immateriele_schade: {
        filename: "scripts/immateriele-schade.bundle.js",
        import: "./src/pages/immateriele-schade/index.ts",
        library: {
          name: 'immateriele-schade',
          type: 'window',
          export: 'default',
        }
      },
      waardedalingsregeling: {
        filename: "scripts/waardedalingsregeling.bundle.js",
        import: "./src/pages/waardedalingsregeling/index.ts",
        library: {
          name: 'waardedalingsregeling',
          type: 'window',
          export: 'default',
        }
      },
      waardering: {
        filename: "scripts/waardering.bundle.js",
        import: "./src/pages/waardering/index.ts",
        library: {
          name: 'waardering',
          type: 'window',
          export: 'default',
        }
      },
      history_bezwaren: {
        filename: "scripts/historie-bezwaren.bundle.js",
        import: "./src/pages/historie-bezwaren/index.ts",
        library: {
          name: 'historie-bezwaren',
          type: 'window',
          export: 'default',
        }
      },
      charts: {
        import: "./src/charts/index.ts"
      },
      css: {
        import: "/styling/main.scss"
      }
    },
    output: {
      path: path.resolve(__dirname, "public/"),
      filename: 'scripts/[name].bundle.js',
      assetModuleFilename: (pathData) => {
        const filepath = path
            .dirname(pathData.filename)
            .split("/")
            .slice(1)
            .join("/");
        return `./styles/${filepath}/[name].[hash][ext][query]`;
      },
    },
    mode: 'development',
    optimization: {
      usedExports: false,
    },
    devServer: {
      open:false,
      port: 4444,
      hot: true,
      client: {
        overlay: true,
        progress: true,
        reconnect: true,
      },
    },
    devtool:'source-map',
    plugins: [
      new MiniCssExtractPlugin({
        filename: "./styles/main.css"
      }),
      new webpack.DefinePlugin({
        ENV: JSON.stringify(env.ENV),
        DOMAIN: JSON.stringify(env.DOMAIN),
        APIBASE: JSON.stringify(env.APIBASE)
      })
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
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          type: "asset/resource",
        }
      ],
    },
    resolve: {
      modules: ['public/scripts','node_modules'],
      extensions: [".ts",".js"]
    }
  }
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
