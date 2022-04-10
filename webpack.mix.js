let mix = require('laravel-mix');

mix
  .setPublicPath('./')
  .sass('assets/sass/toolBar.scss', 'dist/css')
  .sass('assets/sass/styles.scss', 'dist/css')
  .js('assets/js/background.js', 'dist/js')
  .js('assets/js/content.js', 'dist/js')
  .js('assets/js/toolBar.js', 'dist/js')
  .vue()
  .copy('assets/images/', 'dist/images')
  .options({
    processCssUrls: false,
  });
