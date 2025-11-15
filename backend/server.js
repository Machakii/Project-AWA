const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
require('dotenv').config();
const app = express();
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

//middleware

app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/admin-only', adminRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

//mongoDB connection
mongoose.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB is Connected Successfully!"))
	.catch(err => console.error("MongoDB connection failed, ", err));

//Sample Route
app.get('/', (req, res) => {
    res.send('API is running. . . ');
});

//Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('Server started on port ', PORT));