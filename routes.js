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

const upload = multer({ storage: storage }).any();

const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log("err", err);
      res.err = err;
    } else if (err) {
      console.log(err);
      // An unknown error occurred when uploading.
      res.err = err;
    } else {
      next();
    }
  });
};

router.post("/upload", handleUpload, (req, res) => {
  if (!res.err) {
    res.send("ok");
  } else {
    res.status(500).json(res.err);
  }
});

router.get("/a", (req, res) => {
  res.json({ title: "Express" });
});

module.exports = router;
