import Users from "../../models/user.model.js";
import bcrypt from "bcryptjs";
const userResolver = {
  Query: {
    authUser:async(_,__,context)=>{
       try{
         const user=context.getUser();
         return user;
       }catch(err){
        throw new Error(err.message|| "Internal server error");
       }
    },
    user: async(_, { userId }) => {
      try{
        const user=await Users.findById(userId);
        return user;
      }catch(err){
        throw new Error(err.message||"Error in get user by ID");
      }
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;
        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }
        const existUser = await Users.findOne({ username });
        if (existUser) {
          throw new Error("User already exist, Choose a different name");
        }
        const salt = await bcrypt.getSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const maleAvatar = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleAvatar = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = new Users({
          username,
          name,
          gender,
          password: hashedPassword,
          profilePicture: gender === "male" ? maleAvatar : femaleAvatar,
        });
        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (err) {
        throw new Error(err.message || "Internal server error");
      }
    },
    logIn:async(_,{input},context)=>{
         try{
            const {username,password}=input;
            const {user}=await context.authenticate("graphql-local",{username,password});
            await context.login(user);
            return user;
         }catch(err){
            throw new Error(err.message || "Internal server error");
         }
    },
    logOut:async (_,__,context)=>{
        try{
          await context.logout();
          req.session.destroy((err)=>{
            if(err) throw err;
          })
          res.clearCookie("connect.sid");
          return {message:"Logged out successfully"}
        }catch(err){
            throw new Error(err.message || "Internal server error");
        }
    }
  },
};
export default userResolver;
