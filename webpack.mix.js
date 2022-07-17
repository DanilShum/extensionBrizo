let mix = require('laravel-mix');

mix
  .setPublicPath('./')
  .sass('assets/sass/styles.scss', 'dist/css')
  .js('assets/js/content.js', 'dist/js')
  .js('assets/js/background.js', 'dist/js')
  .js('assets/js/view.js', 'dist/js')
  .vue()
  .copy('assets/images', 'dist/images')
  .options({
    processCssUrls: false,
  })
  .webpackConfig(require('./webpack.config'))
  .vue();
