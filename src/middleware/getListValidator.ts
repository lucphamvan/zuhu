import { Request, Response } from "express";
import { isFinite } from "lodash";

/**
 * middle ware to validate 'limit' & 'offset' for get list api
 * @param req m
 * @param res
 * @param next
 * @returns
 */
const getListValidatorMdw = (req: Request, res: Response, next: any) => {
    const { limit, offset } = req.query;

    if (offset && !isFinite(Number(offset))) {
        res.status(400).json({ err: "offset is not a number" });
        return;
    }

    if (limit && !isFinite(Number(limit))) {
        res.status(400).json({ err: "limit is not a number" });
        return;
    }

    next();
};

export default getListValidatorMdw;
