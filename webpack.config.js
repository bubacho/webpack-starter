const path = require("path");
const fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const TerserPlugin = require("terser-webpack-plugin");

function generateHtmlPlugins(templateDir) {
   const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
   return templateFiles.map((item) => {
      const parts = item.split(".");
      const name = parts[0];
      const extension = parts[1];
      return new HtmlWebpackPlugin({
         filename: `${name}.html`,
         template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
         inject: false,
      });
   });
}

const htmlPlugins = generateHtmlPlugins("src/html/views");

const config = {
   target: 'web',
   entry: ["./src/js/index.js", "./src/scss/style.scss"],
   output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/bundle.js",
   },
   devServer: {
      historyApiFallback: true
   },
   devtool: "inline-source-map",
   mode: "dev",
   optimization: {
      minimize: true,
      minimizer: [
         new CssMinimizerPlugin({
            minimizerOptions: {
               preset: [
                  "default",
                  {
                     discardComments: { removeAll: true },
                  },
               ],
            },
         }),
         new TerserPlugin({
            extractComments: true,
         }),
      ],
   },
   module: {
      rules: [
         {
            test: /\.vue$/,
            loader: 'vue-loader'
         },
         {
            test: /\.(sass|scss)$/,
            include: path.resolve(__dirname, "src/scss"),
            use: [
               {
                  loader: MiniCssExtractPlugin.loader,
                  options: {},
               },
               {
                  loader: "css-loader",
                  options: {
                     sourceMap: true,
                     url: false,
                  },
               },
               {
                  loader: 'postcss-loader',
               },
               {
                  loader: "sass-loader",
                  options: {
                     implementation: require("sass"),
                     sourceMap: true,
                  },
               },
            ],
         },
         {
            test: /\.html$/,
            include: path.resolve(__dirname, "src/html/includes"),
            use: ["raw-loader"],
         }
      ],
   },
   plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
         filename: "css/style.bundle.css",
      }),
      new CopyPlugin({
         patterns: [
            {
               from: "src/fonts",
               to: "fonts",
            },
            {
               from: "src/favicon",
               to: "favicon",
            },
            {
               from: "src/img",
               to: "img",
            },
            {
               from: "src/uploads",
               to: "uploads",
            },
         ],
      }),
   ].concat(htmlPlugins),
};

module.exports = (env, argv) => {
   if (argv.mode === "production") {
      config.plugins.push(new CleanWebpackPlugin());
   }
   return config;
};
