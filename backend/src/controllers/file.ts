import { Request, Response } from "express";
import FileService from "../services/file";

export class FileController {
  private textService: FileService;

  constructor() {
    this.textService = new FileService();
  }

  public async saveText(req: Request, res: Response): Promise<void> {
    const { text, fileName } = req.body;

    if (!text || !fileName) {
      res.status(400).json({ error: "Text and file name are required" });
      return;
    }

    try {
      await this.textService.saveTextToFile(text, fileName);
      res
        .status(200)
        .json({ message: "Text serialized to JSON file successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to write JSON file" });
    }
  }
}

export default FileController;
