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
      const field = req.query.field as string
      const order = parseInt(req.query.order as string) === 1 ? 1 : -1;
      
      var firms = null;
      
      if(field==="")
        firms = await firmService.getPaginated(page, limit);
      else
        firms = await firmService.sortPaginated(
          page,
          limit,
          field,
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

  async readByFields(req: express.Request, res: express.Response) {
    const { name } = req.query;
    const { street } = req.query;
    const { number } = req.query;
    const { city } = req.query;

    const address = {
      street: street,
      number: number,
      city: city,
    };

    try {
      return await firmService.readByFields(name as string, address);
    } catch (err: any) {
      res.status(500).send(err);
    }
  }

  private async sortAllByField(
    req: express.Request,
    res: express.Response,
    fieldToSort: string,
    direction: "asc" | "desc",
  ) {
    try {
      const results = await firmService.sortAllByField(fieldToSort, direction);
      if (results.length > 0) return res.json(results);
      else console.log("No documents found");
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async sortPaginated(
    req: express.Request,
    res: express.Response,
  ) {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const field = req.query.field as string;
      const order = parseInt(req.query.order as string) === 1 ? 1 : -1;

      const results = await firmService.sortPaginated(
        page,
        limit,
        field,
        order,
      );
      if (results.length > 0) return res.json(results);
      else console.log("No documents found");
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // sort_by_name_asc(req: express.Request, res: express.Response) {
  //   this.sortPaginatedByField(req, res, "name", "asc");
  // }

  // sort_by_name_desc(req: express.Request, res: express.Response) {
  //   this.sortPaginatedByField(req, res, "name", "desc");
  // }

  // sort_by_address_asc(req: express.Request, res: express.Response) {
  //   this.sortPaginatedByField(req, res, "address", "asc");
  // }

  // sort_by_address_desc(req: express.Request, res: express.Response) {
  //   this.sortPaginatedByField(req, res, "address", "desc");
  // }
}

export default new FirmController();
