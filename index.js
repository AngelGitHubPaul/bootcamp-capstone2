require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const port = 4005;
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

const app = express();

mongoose.connect("mongodb+srv://admin:admin123@b402-course-booking.u2y1t4i.mongodb.net/ecommerce-api?retryWrites=true&w=majority&appName=B402-Course-Booking");

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("Now connected to MongoDB Atlas"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/b5/users", userRoutes);
app.use("/b5/products", productRoutes);
app.use("/b5/cart", cartRoutes);
app.use("/b5/order", orderRoutes);

if(require.main === module) {
	app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on port ${ process.env.PORT || port}`);
	})
}

module.exports = {app, mongoose};