//expressの有効化
const express =require("express")
const app =express();
const userRoute =require("./routes/users")
const authRoute =require("./routes/auth")
const postRoute =require("./routes/post")
const mongoose =require("mongoose");
const uploadRoute =require("./routes/upload")
require("dotenv").config();
const path =require("path");
const { dirname } = require("path");

//PORT番号の設定
const PORT =5000;

//データベース接続
mongoose.connect(
    process.env.MONGOURL
).then(()=>{
    console.log("DBと接続中");

}).catch(()=>{
    console.log(err);
})

//ミドルウェア
app.use("/images",express.static(path.join(__dirname,"public/images")))
app.use(express.json());
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/post",postRoute);
app.use("/api/upload",uploadRoute);

app.get("/",(req,res)=>{
    res.send("heloo express");
})


app.listen(PORT,()=> console.log("サーバーが起動しました"));