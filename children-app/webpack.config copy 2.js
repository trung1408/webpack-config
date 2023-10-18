const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const deps = require("./package.json").dependencies;

module.exports = {
  entry: "./src/index.tsx", // Entry point for TypeScript
  output: {
    path: path.join(__dirname, "/dist"), // the bundle output path
    // filename: "bundle.js", // the name of the bundle
    filename: '[name].bundle.js',
    // chunkFilename: '[name].bundle.js',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"], // Allow importing .tsx and .ts files
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // to import index.html file inside index.js
      // template: path.join(__dirname, "public", "index.html"), // to import index.html file inside index.js
    }),
    new ModuleFederationPlugin({
      name: 'app2',
      remotes: {
        app1: 'app1@http://localhost:4300/remoteEntry.js', // Adjust the URL to match your app1's development server URL
      },
      exposes: {},
      shared: {
        ...deps,
        react: { 
          singleton: true,
          requiredVersion: deps.react,
          eager: true
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps["react-dom"],
          eager: true
        },
        antd: {
          singleton: true,
          requiredVersion: deps.antd,
          eager: true
        },
      },
    }),
  ],
  devServer: {
    port: 4200, // you can change the port
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/, // .ts and .tsx files
        exclude: /node_modules/, // excluding the node_modules folder
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/, // styles files
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
        loader: "url-loader",
        options: { limit: false },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: 'single',
  },
};