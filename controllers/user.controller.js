import { User } from "../models/user.model.js";
import {generateToken} from '../utils/generateToken.js'


import { ApiError, catchAsync } from "../middleware/error.middleware.js";
export const CreateUserAccount = catchAsync(async(req,res)=>{
    const {name,email,password,role='student'} = req.body()
   const existingUser =  await User.findOne({email:email.toLowerCase()});
   if(existingUser){
    throw new ApiError('User already Exists',400);
   }
  const user =  await User.create({name,
    email:email.toLowerCase(),
    password,
    role
   })
   await user.updateLastActive();
   generateToken(res,user,'Account created Successfully');
   
})

export const authenticateUser = catchAsync(async(req,res)=>{
 const {email,password} = req.body
 const user = await User.findOne({email:email.toLowerCase()}).select('+password')
 if(!user){
  throw new ApiError('No such user found Please sign Up first',400);
 }
 if(!(await user.comparePassword(password))){
  throw new ApiError('Wrong Password',400);
 }
 await user.updateLastActive();

 generateToken(res,user,`${user.name}`)

});

export const signOutUser = catchAsync(async(_,res)=>{
  res.cookie('token','',{maxAge:0})
  res.status(200).json({
    success:true,
    message:"Signed out successfully"
  });
})

export const getCurrentUserProfile = catchAsync(async(req,res)=>{
 const user = await User.findById(req._id)
 .populate({
  path:"enrolledCourses.course",
  select:'title thumbnail description'
 });
 if(!user){
  throw new ApiError('User not found',404)

 }

 res.status(200).json({
  success:true,
  data:{
    ...user.toJSON(),
    totalEnrolledCourses:user.totalEnrolledCourses,
    
  }
 })

})
