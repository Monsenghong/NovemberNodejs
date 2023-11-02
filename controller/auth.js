import User from "../models/User.js";
import bcrypt from "bcrypt"
import { createError } from "../utils/error.js";
import Subscription from "../models/Subscription.js";
import jwt from 'jsonwebtoken';
export const register = async (req, res, next) => {

    const newUser = new User({username: req.body.username,email:req.body.email, password: req.body.password})
    const isExsitUser = await User.findOne({email: newUser.email})
    
   
    if (isExsitUser==null) {


        try {

            const saltRounds = 10
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(newUser.password,salt)
            const saveNewUser = new User({username: newUser.username, email:newUser.email, password: hash}
                )

            await saveNewUser.save()
            console.log("User created", saveNewUser)
           return res.status(200).json(saveNewUser)
        } catch (error) {
           return res.status(500).json(error)
        }

    }

  

     return res.status(300).json("User already exists")
    

    console.log(isExsitUser.email)


}




export const login = async (req,res,next) => {

        const user = await User.findOne({email:req.body.email})


        
        if(!user){
           console.log("User not found!!")
          return next(new Error("User not found"))
        }

        const hash = user.password
       
        if(!bcrypt.compareSync(req.body.password, hash)){
            console.log("Incorrect password")


            return next(createError(400,"Incorrect password"))
        }
        
       
           
 const subcription = new Subscription({
            userId: user.email,
            planId:1,
            amount: 150
        })

        try {
            const {email,password,...other} = user._doc
            const token = jwt.sign({id: user.id,isAdmin:user.isAdmin},process.env.SEC_KEY)
            await subcription.save()
            console.log(subcription)
            res.cookie("access_tokke",token,{
                httpOnly: true,
            }).status(200).json({other,subcription});
           // res.status(200).json(subcription)
           } catch (error) {
            console.log(error)
            return next(createError(400,"You can not subcribe"))
           }

       console.log(user)
       
        



}
