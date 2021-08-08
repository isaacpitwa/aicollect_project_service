
import * as passport from 'passport';
import * as passportLocal from "passport-local";
import minorObj from "../helpers/minor";
// import adminUsers from "../models/admin.model";
// const objectid = require('mongodb').ObjectID;
const LocalStrategy = passportLocal.Strategy;
passport.serializeUser(function(client:any, done:any){
  done(undefined, client.id);
});
passport.deserializeUser(function(id, done){
  // adminUsers.findById(objectid(id), (err:any, user:any) => {
  //   if(err){ done(err,''); }
  //   if(!user){ done(err,false); }
  //   if(user){ done(false,user); }
  // });
});
/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
  // adminUsers.findOne({ email: email.toLowerCase() }, (err:any, user: any) => {
  //   if (err) { return done(err,null); }
  //   if (user != null) {
  //     if(minorObj.comparePassword(password,user.password)){
  //       if(user.active){
  //         if(user.verified){
  //           done(null, user,{message:"verified"});
  //         }else{
  //           done(null, user,{message:"notverified"});
  //         }
  //       }else{
  //         done(null, user,{message:"deactive"});
  //       }
  //     }else{
  //       done(err, null, { message: `Invalid email or password` });
  //     }
  //   }else{
  //     done(err, null, { message: `Invalid email or password` });
  //   }
  // });
}));