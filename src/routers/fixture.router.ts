import { Router } from "express";
import getListValidatorMdw from "middleware/getListValidator";
import { isFinite } from "lodash";

import fixtureService from "service/fixture.service";
import prisma from "client";
const router = Router();

/**
 * api get list fixtures with pagination.
 * response have format {item : fixtures[], count : number};
 */
router.get("/fixtures", getListValidatorMdw, async (req, res) => {
    const { offset, limit, date } = req.query as any;

    // valid date parameter
    if (date && !isFinite(Number(date))) {
        res.status(400).json({ err: "Invalid date parameter. It's require a number of milliseconds" });
        return;
    }

    // get list
    try {
        const result = await fixtureService.getList(offset, limit, date);
        res.status(200).json(result);
    } catch (err: any) {
        console.log(`failed to get fixtures`, err);
        res.status(400).json({ err: err.message });
    }
});

/**
 * api get list date have fixtures.
 * return list in miliseconds
 */
router.get("/fixtures/available-date", async (req, res) => {
    try {
        const listDate = await fixtureService.getAvailableDate();
        res.status(200).json(Array.from(listDate));
    } catch (error: any) {
        console.log(`failed to get available-date`, error);
        res.status(400).json({ err: `get available-date failed : ${error.message}` });
    }
});

/**
 * api genarate fixtures test data
 */
router.post("/generate-fixtures", async (req, res) => {
    const { amount } = req.query as any;
    if (!amount) {
        res.status(400).json({ err: `require amount parameter as number` });
        return;
    }

    try {
        await fixtureService.generateFixture(Number(amount));
        res.status(200).json({ message: "generate succesfull" });
    } catch (error: any) {
        console.log(`failed to get generate fixtures`, error);
        res.status(400).json({ err: `generate fixture failed : ${error.message}` });
    }
});

router.delete("/fixtures", async (req, res) => {
    try {
        await prisma.fixture.deleteMany({});
        await prisma.team.deleteMany({});
        await prisma.tournament.deleteMany({});
        res.status(200).json({ message: `delete all record successfull` });
    } catch (error: any) {
        console.log(`failed to delete fixtures`, error);
        res.status(400).json({ err: `delete fixtures failed : ${error.message}` });
    }
});
export default router;
