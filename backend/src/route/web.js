import express, { request } from "express";


let router = express.Router();

let initWebRoutes = (app) => {
    router.post('/todos',(request,respond)=>{
        //  tao moi row trong database
        respond.json("hello world");
    });
    
    router.get('/todos',(request,respond)=>{
        // get du lieu tu database
        response.json({message:'all todos'})
    });
    
    router.put('/todos',(request,respond)=>{
        // chinh sua databae
    });
    
    router.delete('/todos',(request,respond)=>{
        // delete la xoa 1 dong trong database
    });


    return app.use("/", router);
}
// router.post('/todos',(request,respond)=>{

// });

// router.get('/todos',(request,respond)=>{

// });

// router.put('/todos',(request,respond)=>{

// });

// router.delete('/todos',(request,respond)=>{

// });
module.exports = initWebRoutes;