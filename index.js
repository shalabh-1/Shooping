const express=require("express");
const dbConnect = require("./config/dbconnect");
const app=express();
require('dotenv').config()
const port=process.env.PORT||400;
const authRouter = require('./routes/authRoute');
const prodRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute')
const prodcategoryRouter=require("./routes/prodcategoryRoutes.js")
const blogcategoryRouter=require("./routes/blogcatRoutes.js")
const brandRouter=require("./routes/brandRoute.js")
const coupenRouter=require("./routes/coupenRoute.js")
const colorRouter=require("./routes/colorRoute.js")
const enqRouter=require("./routes/enqRoute.js")
const { notfound, errorHandler } = require("./middleware/errorHandler");
const cookieParser=require("cookie-parser")
const morgan = require('morgan');
const path=require('path')


dbConnect()
app.use(morgan('dev'));
app.use(express.json())
app.use(cookieParser())
// console.log(__dirname)

const staticpath=path.join(__dirname,'\public')
app.use(express.static(staticpath))
// app.use(express.static("public"))

app.use("/api/user",authRouter)
app.use("/api/product",prodRouter)
app.use('/api/blog',blogRouter)
app.use('/api/category',prodcategoryRouter)
app.use('/api/blogcategory',blogcategoryRouter)
app.use('/api/brand',brandRouter)
app.use('/api/coupen',coupenRouter)
app.use('/api/color',colorRouter)
app.use('/api/enquiry',enqRouter)

app.use(notfound);  // This should be right after all route definitions
app.use(errorHandler);  // This should be the last middleware


app.listen(port,()=>{console.log("Server is running at Port " + port )})

