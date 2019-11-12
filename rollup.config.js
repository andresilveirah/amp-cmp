const path = require('path');

module.exports = {
  input: './src/index.js',
  output: {
    file: path.resolve(__dirname, 'dist/sourcepoint_amp.js'),
    format: 'umd'
  }
};
