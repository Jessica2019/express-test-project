import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the challenge! I hope you have a great day!");
});

export default router;
