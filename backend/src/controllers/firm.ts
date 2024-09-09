import express from "express";
import firmService from "../services/firm";

export class FirmController {
  async create(req: express.Request, res: express.Response) {
    try {
      await firmService.create(req.body);
      return res.json({ status: 201, message: "Firm  created" });
    } catch (err: any) {
      const statusCode = err.status || 500;
      const message = err.message || "Error creating firm";
      return res.status(statusCode).json({ message });
    }
  }

  async getIdName(req: express.Request, res: express.Response) {
    try {
      const firms = await firmService.getIdName();

      return res.json(firms);
    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  async getName(req: express.Request, res: express.Response) {
    try {
      const firms = await firmService.getName(req.params.id);

      return res.json(firms);
    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  async get(req: express.Request, res: express.Response) {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const sortingField = req.query.sortingField as string
      const order = parseInt(req.query.order as string) === 1 ? 1 : -1;
      
      var firms = null;
      
      if(sortingField==="")
        firms = await firmService.getPaginated(page, limit);
      else
        firms = await firmService.sortPaginated(
          page,
          limit,
          sortingField,
          order,
        );
      
      //const 
      const totalDocuments = await firmService.countDocuments();

      return res.json({
        page,
        totalDocuments,
        totalPages: Math.ceil(totalDocuments / limit),
        firms,
      });
    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  async readByValue( req: express.Request,
    res: express.Response) {
      const value = parseInt(req.query.value as string);
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
  }
  

  async rate(req: express.Request, res: express.Response) {
    const ownerReview = parseInt(req.body.review as string);
    const { _id } = req.body;

    try {
      await firmService.rate(ownerReview, _id as string);
      return res.status(200);
    } catch (err: any) {
      res.status(500).send(err);
    }
  }


}

export default new FirmController();
