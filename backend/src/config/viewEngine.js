import express from "express";

let configViewEngine = (app) => {
    //arrow function
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");  //tuong tu jsp, blade trong java: co the if, else, for trong html
    app.set("views", "./src/views");

}

module.exports = configViewEngine;