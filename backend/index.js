import http from "http";
import cors from "cors";
import express from 'express';
import { ApolloServer } from "@apollo/server"; 
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {secret} from "./config/secrets.js";
import {connectDB} from "./utils/connectDB.js";
import mergeResolver from "./graphql/resolvers/index.js";
import mergeTypeDef from "./graphql/typeDefs/index.js";

const app=express();
const httpServer=http.createServer(app);
const server=new ApolloServer({
    typeDefs:mergeTypeDef,
    resolvers:mergeResolver,
    plugins:[ApolloServerPluginDrainHttpServer({httpServer})]
})
await server.start();
app.use('/',
    cors(),
    express.json(),
    expressMiddleware(server,
        {context: async ({req}) =>({req}),
}),
);

await new Promise((resolve)=>httpServer.listen({port:secret.PORT},resolve))
.then(async()=>{
    console.log("hello Server is running !!!");
    await connectDB();
})
.catch((err)=>{
    console.log("Error in server running !!!", err);
})
