import express from "express";


let router = express.Router();

let initWebRoutes = (app) => {
    


    return app.use("/", router);
}

module.exports = initWebRoutes;