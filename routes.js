const express = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path")
const unlinkSync = require("fs").unlinkSync;
const router = express.Router();

// error handler
router.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Configure file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //console.log("here1", file);
    const dir = path.join(__dirname, "/tmp/", file.fieldname);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    //console.log("here2", file);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("uploaded_file");

router.post("/upload", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log("err", err);
      res.status(400).json({ err });
    } else if (err) {
      console.log(err);
      // An unknown error occurred when uploading.
      res.status(400).json({ err });
    } else {
      if (req.body.token) {
        // Consultar se JWT é valido
        const url = new URL("https://api.rarepository.ufsc.br/v1/token?token=");
        url.searchParams.set("token", req.body.token);
        axios(url.toString())
          .then(() => {
            res.json({
              file: {
                filename: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size,
              },
              full: req.file,
            });
          })
          .catch(async (error) => {
            //req.file.path
            try {
              await unlinkSync(req.file.path);
              res.status(400).json({ auth: error });
            } catch (err) {
              res.status(400).json({ auth: error, file: err });
            }
          });
      }
    }
  });
});

router.get("/", (req, res) => {
  res.json({ routes: ["/upload"] });
});

module.exports = router;
