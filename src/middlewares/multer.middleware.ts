import { extname } from "path";
import multer, { memoryStorage } from "multer";
import { CustomError } from "../lib/helpers/customError";
import { errorCodes } from "../consts";

const allowedExt = [".json"];

export const filesHandler = multer({
  storage: memoryStorage(),
  fileFilter: (req, file, cb) => {
    var ext = extname(file.originalname);
    if (!allowedExt.includes(ext))
      return cb(new CustomError(errorCodes.unsupportedMedia));
    cb(null, true);
  },
});


