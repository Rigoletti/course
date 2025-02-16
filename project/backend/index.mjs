import express from 'express';
import connectDB from './db_connect.mjs'; 

const app = express();
const PORT = process.env.PORT || 3005; 


connectDB();




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); 
});
