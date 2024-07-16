import express, { Request, Response } from "express";
import welcomeRoutes from "./welcome/welcome";
import v1Router from "./v1";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send(
        "Hello, Thanks for taking the time to do this challenge. I hope you have a great day!"
    );
});

app.use("/welcome", welcomeRoutes);
app.use('/v1', v1Router);

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

export default app;
