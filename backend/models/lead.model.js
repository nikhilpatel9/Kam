import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image:{
      type: String,
      default:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/97/b8/c5/11-flowers-rooftop-restaurant.jpg?w=600&h=-1&s=1"
    },
    category: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
      required: true,
      
    },
    phone:{
      type:String,
      default:'',
    },
    email:{
      type:String,
      default:'',
    
    }
  },
  { timestamps: true }
);

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;