import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Lecture title is required"],
        trim:true,
        maxLength:[100,"lecture title cannot exceed 100 characters"]
    },
     description:{
        type:String,
        required:[true,"Lecture description is required"],
        trim:true,
        maxLength:[300,"lecture description cannot exceed 100 characters"]
    },
    videoUrl:{
        type:String,
        required:[true,'Video URL is required']
    },
    duration:{
        type:Number,
        default:0
    },
    publicId:{
        type:String,
        required:[true,'Public ID is required for video management']
    },
    isPreview:{
        type:Boolean,
        default:false
    },
    order:{
        type:Number,
        required:[true,'Lecture order is required']
    }

},{
    timestamps:true,toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

export  const Lecture = mongoose.model('Lecture',lectureSchema)