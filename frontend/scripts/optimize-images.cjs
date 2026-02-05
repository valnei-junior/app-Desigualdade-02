const imageminModule = require('imagemin');
const imagemin = imageminModule.default || imageminModule;
const optipngModule = require('imagemin-optipng');
const mozjpegModule = require('imagemin-mozjpeg');
const webpModule = require('imagemin-webp');
const svgoModule = require('imagemin-svgo');
const optipng = optipngModule.default || optipngModule;
const mozjpeg = mozjpegModule.default || mozjpegModule;
const webp = webpModule.default || webpModule;
const svgo = svgoModule.default || svgoModule;
const path = require('path');

(async () => {
  try {
    const input = path.resolve(__dirname, '..', 'public', 'sponsors', '*.{png,jpg,jpeg,webp,svg}');
    console.log('Optimizing images in', input);
    const files = await imagemin([input], {
      destination: path.resolve(__dirname, '..', 'public', 'sponsors'),
      plugins: [
        optipng({optimizationLevel: 3}),
        mozjpeg({quality: 85}),
        webp({lossless: true}),
        svgo(),
      ],
    });

    console.log(`Optimized ${files.length} file(s)`);
    files.forEach(f => console.log(' -', f.destinationPath || f.path || f.filePath || f.destination || f.path));
  } catch (err) {
    console.error('Image optimization failed:', err);
    process.exitCode = 2;
  }
})();
