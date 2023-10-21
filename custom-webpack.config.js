const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      $ENV: {
        SomeAPIKey: JSON.stringify(process.env.PdfAPIKey),
      }
    })
  ]
};