import express from 'express';
import cors from 'cors';
import compression from 'compression';
import 'dotenv/config';
import http from 'http';
import BotService from './bot';
const bot = new BotService();
const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false }));
app.use(cors());
app.use(compression());


const server : http.Server = http.createServer(app);

server.listen(PORT || 8081, async () => {
    await bot.login();
    bot.init();
});