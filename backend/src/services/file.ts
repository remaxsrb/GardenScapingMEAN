import fs from 'fs';
import path from 'path';

class FileService {
  private basePath: string;

  constructor() {
    this.basePath = path.join(__dirname, '../');
  }

  public saveTextToFile(text: string, fileName: string): Promise<void> {
    const jsonFilePath = path.join(this.basePath, fileName);

    return new Promise((resolve, reject) => {
      fs.writeFile(jsonFilePath, JSON.stringify({ text }, null, 2), (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}

export default FileService;
