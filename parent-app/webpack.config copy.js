const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;

module.exports = {
  entry: "./src/index.tsx", // Entry point for TypeScript
  output: {
    path: path.join(__dirname, "/dist"), // the bundle output path
    // filename: "bundle.js", // the name of the bundle
    filename: '[name].bundle.js',
    // chunkFilename: '[name].bundle.js',
    // library: 'antd',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"], // Allow importing .tsx and .ts files
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // to import index.html file inside index.js
      // template: path.join(__dirname, "public", "index.html"), // to import index.html file inside index.js
    }),
    // new webpack.ProvidePlugin({
    //   // 'React': 'react',
    //   // 'ReactDOM': 'react-dom',
    //   'antd': 'antd',
    // }),
    // new ModuleFederationPlugin({
    //   name: "parentApp",
    //   library: { type: "var", name: "parentApp" },
    //   filename: "remoteEntry.js", // This is the entry point for child apps
    //   exposes: {
    //     "./SharedComponent": "./src/SharedComponent", // Expose the component to be shared
    //   },
    //   shared: {
    //     react: { 
    //       singleton: true,
    //       requiredVersion: deps.react,
    //     },
    //     "react-dom": { singleton: true },
    //     // Add any other libraries you want to share
    //   },
    // }),
    // new ModuleFederationPlugin({
    //   shared: ['antd'],
    // }),
    new ModuleFederationPlugin({
      name: "parentApp",
      library: { type: "var", name: "parentApp" },
      filename: "remoteEntry.js", // This is the entry point for child apps
      shared: {
        antd: { singleton: true },
        // react: { singleton: true },
        // "react-dom": { singleton: true },
      },
    }),
  ],
  devServer: {
    port: 4300, // you can change the port
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
    // runtimeChunk: 'single',
  },
  // externals: {
  //   // 'react': 'React',
  //   // 'react-dom': 'ReactDOM',
  //   'antd': 'antd',
  // },
};