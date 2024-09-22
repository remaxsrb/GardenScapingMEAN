import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

const baseDir = path.resolve(__dirname, "../../../files");

export class FileService {
  constructor() {
    this.createUploadDirectories();
  }

  // Ensure the upload directories exist
  private createUploadDirectories() {
    // Directories to be created
    const dirs = ["gardens", "photos"];
    dirs.forEach((dir) => {
      const dirPath = path.join(baseDir, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created: ${dirPath}`);
      } else {
        console.log(`Directory already exists: ${dirPath}`);
      }
    });
  }

  private storage = multer.diskStorage({
    destination: (_req, file, cb) => {
      // Determine the destination directory based on file type
      const ext = path.extname(file.originalname).toLowerCase();
      const destinationDir = ext === ".json" ? "gardens" : "photos";
      cb(null, path.join(baseDir, destinationDir));
    },
    filename: (_req, file, cb) => {
      // Determine file extension
      const ext = path.extname(file.originalname).toLowerCase();

      if (ext === ".json") {
        // Generate unique filename for JSON files
        const uniqueSuffix =
          Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
        cb(null, uniqueSuffix);
      } else {
        // Use original filename for photos
        cb(null, file.originalname);
      }
    },
  });

  private fileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    // Acceptable MIME types for images and JSON
    const filetypes = /jpeg|jpg|png|json/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (JPG, PNG) and JSON files are allowed!"));
    }
  };

  public multerUpload = multer({
    storage: this.storage,
    fileFilter: this.fileFilter,
  });

  async handleFileUpload(file?: Express.Multer.File): Promise<string> {
    if (!file || !file.filename) {
      throw new Error("File is not properly provided or filename is missing");
    }
    // Determine the base URL path based on file type
    const ext = path.extname(file.originalname).toLowerCase();
    const folder = ext === ".json" ? "gardens" : "photos";

    return `http://localhost:4000/files/${folder}/${file.filename}`;
  }

  async serveFile(filename: string): Promise<string> {
    // Determine the folder based on the file extension
    const ext = path.extname(filename).toLowerCase();
    const folder = ext === ".json" ? "gardens" : "photos";
    const filePath = path.join(baseDir, folder, filename);
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          reject("File not found");
        } else {
          resolve(filePath);
        }
      });
    });
  }

  async serveFilePath(filename: string): Promise<string> {
    // Determine the folder based on the file extension
    const ext = path.extname(filename).toLowerCase();
    const folder = ext === ".json" ? "gardens" : "photos";
    const filePath = path.join(baseDir, folder, filename);
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          reject("File not found");
        } else {
          resolve(`http://localhost:4000/files/${folder}/${filename}`);
        }
      });
    });
  }



}

export default new FileService();
