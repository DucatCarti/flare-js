const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js",
    chunkFilename: "js/[name].js",
    publicPath: "/",
  },
  devServer: {
    static: "./dist",
    open: false,
    hot: true,
    historyApiFallback: true,
    port: 3023,
    client: {
      overlay: false, // Полностью отключить оверлей
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Для файлов TypeScript
        exclude: /node_modules/,
        use: "ts-loader", // Используем ts-loader
      },
      {
        test: /\.(js|jsx)$/, // Для файлов JavaScript
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // Для изображений
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"], // Поддержка расширений файлов
  },
  devtool: "source-map", // Для удобного дебаггинга
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Шаблон HTML
    }),
  ],
};
