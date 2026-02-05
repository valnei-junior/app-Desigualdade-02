const imagemin = require('imagemin');
const optipng = require('imagemin-optipng');
const mozjpeg = require('imagemin-mozjpeg');
const webp = require('imagemin-webp');
const svgo = require('imagemin-svgo');
const path = require('path');

(async () => {
  try {
    const input = path.resolve(__dirname, '..', 'public', 'sponsors', '*.{png,jpg,jpeg,webp,svg}');
    console.log('Optimizing images in', input);
    const files = await imagemin([input], {
      destination: path.resolve(__dirname, '..', 'public', 'sponsors'),
      plugins: [
        // PNG
        optipng({optimizationLevel: 3}),
        // JPEG
        mozjpeg({quality: 85}),
        // WEBP (attempt lossless where supported)
        webp({lossless: true}),
        // SVG
        svgo(),
      ],
    });

    console.log(`Optimized ${files.length} file(s)`);
    files.forEach(f => console.log(' -', path.relative(process.cwd(), f.destinationPath || f.path || f.filePath || f.destination || f.path)));
  } catch (err) {
    console.error('Image optimization failed:', err);
    process.exitCode = 2;
  }
})();
