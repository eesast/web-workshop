const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /^\/main/, to: "/main.html" },
        { from: /^\/about/, to: "/about.html" },
        { from: /^\/about-me/, to: "/about-me.html" },
      ],
    },
  },
	webpack: {
    plugins: {
      remove: [
        "HtmlWebpackPlugin",
      ],
      add: [
        new HtmlWebpackPlugin(
          {
            inject: false,
            filename: "index.html",
            template: "public/index.html",
          }
        ),
        new HtmlWebpackPlugin(
          {
            inject: true,
            filename: "main.html",
            template: "public/main.html",
          }
        ),
        new WebpackBar(),
        // new BundleAnalyzerPlugin(),
      ]
    }
	}
}
