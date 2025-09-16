import {v2 as cloudnary} from 'cloudinary'
import dotenv from "dotenv"
dotenv.config({})

cloudnary.config({
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    cloud_name:process.env.CLOUD_NAME
})

export const uploadMedia = async(file) => {
    try {
     const uploadResponse = await cloudnary.uploader.upload(file,{
        resource_type:"auto"
     })

     return uploadResponse
        
    } catch (error) {
        console.log("Error in uploading media")
        console.log(error.message)
    }
}

export const deleteMediaFromCloudinary = async(publicId) => {
    try {
        await cloudnary.uploader.destroy(publicId)
    } catch (error) {
        console.log("Error in deleting Media")
    }
}

export const deleteVideoFromCloudinary = async(publicId) => {
    try {
        await cloudnary.uploader.destroy(publicId,{resource_type:"video"})
    } catch (error) {
        console.log("Error in deleting Video")
    }
}