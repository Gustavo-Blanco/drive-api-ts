import express, {Request,Response} from 'express';
import env from './config/env';
import {auth} from './app';

const app = express();


app.get('/hola',(req: Request, res: Response) => {res.send('Hola mundo auth')});

auth();

app.listen(env.PORT,() => console.log(`Listen on port ${env.PORT}`));
