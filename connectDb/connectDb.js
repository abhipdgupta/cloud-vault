const db = require('mongoose')
const {env}=require('../config/keys')
const mongoUri = env.MONGO_URI

const connectDB = async () => {
  db.connect(mongoUri, {
    useNewUrlParser: true,
  })
    .then(() => {
      console.log('MONGODB DATABASE CONNECTED')
    })
    .catch((err) => {
      console.log(`err: ${err}`)
    })
}

module.exports = { connectDB, db }
