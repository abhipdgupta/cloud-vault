const express = require("express");
const router=express.Router()
const dotenv = require("dotenv");
dotenv.config();

const { connectDB } = require("./connectDb/connectDb");
const errorMiddleware = require("./middleware/error");

const app = express();

const userRouter = require("./routes/userRouter");
const filesRouter = require("./routes/filesRouter");
const indexRouter = require("./routes/indexRouter");
const ServerlessHttp = require("serverless-http");

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Request-Headers", "http");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-api-key, authorization"
  );
  next();
});


app.use("/api/v1/user", userRouter);
app.use("/api/v1/file", filesRouter);
app.use("/api/v1/", indexRouter);
app.get("/test",(req,res)=>{
    return res.status(404).send(`Server is working`);
})


app.get("/*", (req, res) => {
  return res.status(404).send(`Path does not exist`);
});

app.use(errorMiddleware);

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`server is running on port http://localhost:${port}/`);
});

// router.use('/',app)

// module.exports.handler = ServerlessHttp(router);