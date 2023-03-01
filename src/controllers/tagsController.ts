import { Request, Response } from "express";
import modelTags from "../models/tags";
import tagcolletion from "../models/tagsColletion";

export default class TagsController {
  static create(req: Request, res: Response) {
    let { user, titulo } = req.body;

    let a = new modelTags({
      user,
      titulo,
    });

    a.save((err: any, data: any) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          message: "Error ",
        });
      }

      if (!data) {
        return res.status(401).json({
          ok: false,
          message: "Error ",
        });
      }
      return res.status(200).json({
        ok: true,
        data,
      });
    });
  }
  static getOne(req: Request, res: Response) {
    let id = req.params.id;
    modelTags.find({ user: id }).exec((err: any, data: any) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!data) {
        return res.status(201).json({
          ok: false,
          message: "Error no se encuentra ningun record",
        });
      }
      if (data) {
        return res.status(201).json({
          ok: true,
          data,
        });
      }
    });
  }
  static deleteOne(req: Request, res: Response) {
    let { id } = req.body;
    modelTags.deleteOne({ _id: id }).exec((err: any, data: any) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!data) {
        return res.status(201).json({
          ok: false,
          message: "Error no se encuentra ningun record",
        });
      }
      if (data) {
        return res.status(201).json({
          ok: true,
          data,
        });
      }
    });
  }

  static Savetagcolletion(req: Request, res: Response) {
    let { titulo } = req.body;

    let a = new tagcolletion({
      titulo,
    });
    a.save((err: any, data: any) => {
      if (err) {
        return res.status(501).json({
          ok: false,
          err,
        });
      }
      if (data) {
        return res.status(200).json({
          ok: true,
        });
      }
    });
  }
  static gettagcolletion(req: Request, res: Response) {
    tagcolletion.find({}).exec((err: any, data: any) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!data) {
        return res.status(201).json({
          ok: false,
          message: "Error no se encuentra ningun record",
        });
      }
      if (data) {
        return res.status(201).json({
          ok: true,
          data,
        });
      }
    });
  }
  static editagcolletion(req: Request, res: Response) {
    let { _id, titulo } = req.body;

    tagcolletion
      .updateOne(
        { _id: _id },
        {
          $set: {
            titulo: titulo,
          },
        }
      )
      .exec((err: any, data: any) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
        if (!data) {
          return res.status(201).json({
            ok: false,
            message: "Error no se encuentra ningun record",
          });
        }
        if (data) {
          return res.status(201).json({
            ok: true,
            data,
          });
        }
      });
  }
  static deletetagcolletion(req: Request, res: Response) {
    let id = req.params.id;
    tagcolletion.deleteOne({ _id: id }).exec((err: any, data: any) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!data) {
        return res.status(201).json({
          ok: false,
          message: "Error no se encuentra ningun record",
        });
      }
      if (data) {
        return res.status(201).json({
          ok: true,
          data,
        });
      }
    });
  }
}
