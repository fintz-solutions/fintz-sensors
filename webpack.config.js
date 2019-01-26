const path = require("path");

module.exports = {
    mode: "development",
    entry: './src/static/js/main.js',
    output: {
        path: path.resolve(__dirname, 'src/static'),
        filename: 'js/bundle.js'
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
       ]
    }
  };
