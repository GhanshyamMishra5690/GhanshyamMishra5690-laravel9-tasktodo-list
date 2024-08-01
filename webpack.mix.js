const mix = require('laravel-mix');
const VueLoaderPlugin = require('vue-loader/dist/plugin').default;

mix.js('resources/js/app.js', 'public/js')
   .vue()
   .webpackConfig({
       module: {
           rules: [
               {
                   test: /\.vue$/,
                   loader: 'vue-loader'
               }
           ]
       },
       plugins: [
           new VueLoaderPlugin()
       ]
   });