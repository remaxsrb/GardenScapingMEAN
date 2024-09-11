import { Request, Response } from 'express';
import fileService from '../../services/utility/file';

export class FileController {


  async uploadFile (req: Request, res: Response) {
    try {
      
      const filePath = await fileService.handleFileUpload(req.file!);
      res.status(200).json({ message: 'File uploaded successfully', filePath: filePath });
    } catch (error) {
      res.status(500).json({ message: 'File upload failed'});
    }
  };

  async serveFile(req: Request, res: Response) {
    const  fileName  = req.query.fileName as string;
    try {
      const filePath = await fileService.serveFile(fileName);
      res.sendFile(filePath);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  };

  async serveFilePath (req: Request, res: Response) {
    const  fileName  = req.query.fileName as string;
    try {
      const filePath = await fileService.serveFilePath(fileName);
      res.json(filePath);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  };


}
