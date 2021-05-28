const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path')

const app = express();

const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/users')

mongoose.connect('mongodb+srv://suyog:0k22hjjiX6iwJz2U@cluster0.r0601.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(()=>{
      console.log('Database Connected Successfully')
    })
    .catch(()=>{
      console.log('DB Connection failed!');
    })

// Connection fails sometimes due to your IP change so update it in Network Access section in mongo

// const bodyParser = require('body-parser')  //Body parser has been deprecated

// app.use((req, res, next)=>{
//   res.setHeader("Access-Control-Allow-Origin", "*")
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//      "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PATCH, DELETE, OPTIONS"
//     )
//   next();
// })

app.use(cors());
app.use(express.json())   //This will parse the body
app.use(express.urlencoded({       // urlencoded converts the character of a format into characters which can be transmitted over the internet
  extended: true
}));
app.use('/images', express.static('backend/images'))

app.use('/api/posts', postRoutes)
app.use('/api/users', userRoutes)

module.exports = app;

// 0k22hjjiX6iwJz2U
