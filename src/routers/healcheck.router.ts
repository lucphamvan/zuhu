import express from "express";
const router = express.Router();

/**
 * api ping
 */
router.get("/ping", (req, res) => {
    res.status(200).json("ping !");
});

export default router;
