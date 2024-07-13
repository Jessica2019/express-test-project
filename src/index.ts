import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
    res.send(
        "Hello, Thanks for taking the time to do this challenge. I hope you have a great day!"
    );
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
