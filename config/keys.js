const dotenv = require("dotenv");
dotenv.config();

const env = {
  MONGO_URI: process.env.M_MONGO_URI,
  AWS_ACCESS_KEY: process.env.M_AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.M_AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET: process.env.M_AWS_BUCKET,
  JWT_SECRET:process.env.M_JWT_SECRET
};

module.exports={env}