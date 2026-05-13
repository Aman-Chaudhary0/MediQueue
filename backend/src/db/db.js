import mongoose from 'mongoose';

// connect DB
async function connectDB() {
    
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database connected successfully')
    }
     catch (error) {
        console.error('Database connection error:',error);
    }
}

export default connectDB;