import multer from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    req.body = req.query;
    const {type, version} = req.query;
    let folderName = path.join(__dirname, "../../../OTA-binaries", type as string, version as string);
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, {
        recursive: true
      });
    }
    req.body.path = folderName;
    cb(null, folderName);
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    req.body.path = path.join(req.body.path, 'firmware.bin'); 
    cb(null, 'firmware.bin');
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file) {
    return cb(null, true);
  }
  if (
    file.mimetype === "application/octet-stream"
    ) {
    cb(null, true); // Allow the upload.
  } else {
    cb(new Error("Invalid file type. Only binary files are allowed."));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
