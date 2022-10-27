const fs = require('fs');

class ImageController {
  uploadSingle(req, res) {
    
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
