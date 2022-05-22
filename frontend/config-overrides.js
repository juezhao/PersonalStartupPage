const { override, fixBabelImports } = require("customize-cra");
const addLessLoader = require("customize-cra-less-loader");

module.exports = override(
  // lazy load antd design 
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  // Add theme config for loading less javascriptEnabled and antd.
  addLessLoader({
    cssLoaderOptions: {
      sourceMap: true,
      modules: {
        localIdentName: "[hash:base64:8]",
      },
    },
    lessLoaderOptions: {
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: { "@primary-color": "#1DA57A" },
      },
    },
  }),
  
  
);
