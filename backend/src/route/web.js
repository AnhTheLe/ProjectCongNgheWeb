import express from "express";
// import homeController from "../controllers/homeController";
import introController from "../controllers/introController";
// import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
    // router.get('/homecontroller', homeController.getHomePage);
    router.get('/intro', introController.getIntro);


    return app.use("/", router);
}

module.exports = initWebRoutes;