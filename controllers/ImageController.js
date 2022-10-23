const path = require('path');
const Resize = require('../middleware/Resize');
const fs = require('fs');

class ImageController {
  uploadSingle(req, res) {
    // // folder upload
    // console.log(req.body.file.buffer);
    // const imagePath = path.join(__dirname, '/public/images');
    // // call class Resize
    // const fileUpload = new Resize(imagePath);
    // if (!req.body.file) {
    //     res.status(401).json({error: 'Please provide an image'});
    // }
    // const filename = fileUpload.save(req.body.file.buffer);

    // return res.status(200).json({ name: filename });
    return res.status(200).json(req.file);
  }

  remove (req, res) {
    const fileName = req.body.name;
    const directoryPath = __basedir + "/public/images/";
  
    fs.unlink(directoryPath + fileName, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Could not delete the file. " + err,
        });
      }
  
      return res.status(200).json({
        message: "File is deleted.",
      });
    });
  };
}

module.exports = new ImageController();
