const express = require("express");
const multer = require("multer");
const fs = require("fs");
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
    const dir = "./tmp/" + file.fieldname;
    fs.mkdirSync(dir, { recursive: true });
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
      if (req.body.key) {
        // Consultar se JWT é valido
        console.log(req.body.key);
      }
      res.json({
        file: {
          filename: req.file.filename,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
        body: req.body,
      });
    }
  });
});

router.get("/", (req, res) => {
  res.json({ routes: ["/upload"] });
});

module.exports = router;
