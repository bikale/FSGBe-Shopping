const Localstrategy = require('passport-local').Strategy
const mongoose =require('mongoose')
const bcrypt=require('bcryptjs')

//load user model 

const User = require('../model/user')


module.exports=function(passport){
    passport.use(
        new Localstrategy({usernameField:'email'},(email,password,done)=>{
            //match user 
            User.findOne({email:email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:"the email is not registered"})

                } 
                //match password 
                  bcrypt.compare(password,user.password,(err,ismatch)=>{
                      if(err) throw err
                      if(ismatch){
                          return done(null,user)
                      }else{
                          return done(null ,false,{message:'password in correct '})
                      }
                  })

                })
            .catch(err=>console.log(err))
        })
    
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      }); 
}