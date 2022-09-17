const path = require(`path`);

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve('assets'),
      '@images': path.resolve('dist/images/icons'),
    },
  },
  module: {
    rules: [
      // {
      //   test: /\.svg$/,
      //   oneOf: [
      //     {
      //       resourceQuery: /inline/,
      //       use: [
      //         'babel-loader',
      //         {
      //           loader: 'vue-svg-loader',
      //           options: {
      //             svgo: {
      //               plugins: [
      //                 { removeDimensions: false },
      //                 { removeViewBox: false },
      //                 {
      //                   cleanupIDs: {
      //                     prefix: {
      //                       toString() {
      //                         return Math.random().toString(36).substr(2, 9);
      //                       },
      //                     },
      //                   },
      //                 },
      //               ],
      //             },
      //           },
      //         },
      //       ],
      //     },
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: 'assets/images/icons/[name].[hash:8].[ext]',
      //         esModule: false,
      //       },
      //     },
      //   ],
      // },
    ],
  },
};
