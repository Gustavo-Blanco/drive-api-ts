import express, { NextFunction, Request, Response } from "express";
import env from "./config/env";
import { auth } from "./app";
import morgan from 'morgan';
import { Drive } from "./components/driver/Drive";

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/index",(req: Request, res: Response) => res.send('Code and scopes are in the url ↑'));

const main = async () => {
    const authClient = await auth();
    console.log(authClient);
    console.log(await new Drive(authClient).list());
    console.log('DNOASINDNSADSNDNS');
    
}

main();


app.listen(env.PORT, () => console.log(`Listen on port ${env.PORT}`));
