import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/DBConnection/DBConnect.js";
import userroutes from "./src/Routing/userRoutes/userRoutes.js";
import cors from "cors";
import adminRouter from "./src/Routing/adminRoutes.js";
import { superadmin } from "./src/DBConnection/superAdmin.js";
import swagger_ui from "swagger-ui-express";
import openapi_docs from "./output.openapi.json" assert { type: "json" }
import { Server } from "socket.io";
import socket from "./src/Sockets/socket.js";
import chatRouter from "./src/Routing/chatRoutes.js";
import messageRouter from "./src/Routing/messageRoutes.js";
dotenv.config();
 
// =====================================create app=======================================

const app = express();


connectDB();


app.use("/docs", swagger_ui.serve, swagger_ui.setup(openapi_docs, {
  title: `Peek Api Documentation`
  }));


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'DELETE', 'X-Access-Token']
}));

const PORT = process.env.PORT;

app.use(express.json())

app.use("/public", express.static("public")); 

app.use("/api/user",userroutes)

app.use("/api/admin", adminRouter);

app.use("/api/chat",chatRouter)

app.use("/api/message",messageRouter)

superadmin()

let server = app.listen(PORT, () => {
  console.log(`Express is connected on port ${PORT}`);
});

let io = new Server(server,{
  cors: {
      origin: "*", // Allow both production and local development
      methods: ["POST", "GET", "PUT", "DELETE"],
      credentials: true
      
  }
});

global.io=io

socket(io)






