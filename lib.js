const fs = require("fs"),
  BowerRCFile = JSON.parse(fs.readFileSync("./.bowerrc", "utf8")),
  libFolder = BowerRCFile.directory;

module.exports = {
  javascriptLibFiles: [
    libFolder + "/jquery/dist/jquery.js",
    libFolder + "/magnific-popup/dist/jquery.magnific-popup.js",
    libFolder + "/slick-carousel/slick/slick.js",
  ],
  styleLibFiles: [
    libFolder + "/flexiblegs-css/flexiblegs-css.css",
    libFolder + "/magnific-popup/dist/magnific-popup.css",
    libFolder + "/slick-carousel/slick/slick.css",
    libFolder + "/animate.css/animate.css",
    "app/Content/css/fontello.css",
    "app/Content/css/fontello-ie7.css",
    "app/Content/css/iconfonts.min.css"
  ]
};
