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
import passport from "passport";
import session from "express-session";
import ConnectMongo from "connect-mongodb-session";
import { buildContext } from "graphql-passport";
import { configurePassport } from "./config/passport.config.js";

configurePassport();
const app=express();
const httpServer=http.createServer(app);

const MongoDBStore=ConnectMongo(session);
const store = new MongoDBStore({
    uri:secret.DB_URL,
    collection:"sessions",
})
store.on("error",(err)=>console.log(err));
app.use(session({
    secret:secret.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24*7,
        httpOnly:true
    },
    store:store
}))

app.use(passport.initialize());
app.use(passport.session());

const server=new ApolloServer({
    typeDefs:mergeTypeDef,
    resolvers:mergeResolver,
    plugins:[ApolloServerPluginDrainHttpServer({httpServer})]
})
await server.start();
app.use('/graphql',
    cors({
        origin: "http://localhost:5173",
        credentials:true,
    }),
    express.json(),
    expressMiddleware(server,
        {context: async ({req,res}) => buildContext({req,res})}
    ),
);

await new Promise((resolve)=>httpServer.listen({port:secret.PORT},resolve))
.then(async()=>{
    console.log(`hello Server is running !!! -> ${secret.PORT}`);
    await connectDB();
})
.catch((err)=>{
    console.log("Error in server running !!!", err);
})
