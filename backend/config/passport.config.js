import passport from "passport";
import bcrypt from "bcryptjs";

import Users from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport=async ()=>{
    passport.serializeUser((user,done)=>{
        // console.log("Serilized User" , user);
        done(null,user.id)
    })

    passport.deserializeUser(async(id,done)=>{
        // console.log("Deserilizaling User");
        try{
          const user=await Users.findById(id);
          done(null,user);
        }catch(err){
          done(err);
        }
    })

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => {
        try {
            const user = await Users.findOne({ username });
            if (!user) {
                throw new Error("Invalid username or password");
            }
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                throw new Error("Invalid username or password");
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }))
}