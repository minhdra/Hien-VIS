// uploadMiddleware.js
const { v4: uuidv4 } = require('uuid');

const multer = require('multer');

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images")
  },
  filename: function (req, file, cb) {
    const listName = file.originalname.split('.');
    const type = listName[listName.length - 1];
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + type)
  }
})

const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  // dest: "public/images",
  storage: storage,
});

module.exports = upload;