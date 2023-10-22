import express from "express";
import bodyParser from "body-parser";
import initWebRoutes from "./route/web";
import configViewEngine from "./config/viewEngine";
import connectDB from "./config/connectDB";
import cors from 'cors';

require('dotenv').config();

let app = express();

//config app
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

configViewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;
//port == undefined => port = 6969

app.listen(port, () => {
    console.log("Web is running on the port: " + port)
});