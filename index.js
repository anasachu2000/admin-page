const mongoose = require('mongoose');
//----------connecting  database-----------//
mongoose.connect('mongodb://127.0.0.1:27017/user_mangement');
// -------------------------

const morgan = require('morgan');


const express = require('express');
const app  = express();


//----------User route-----------//
const userRoutes = require('./routes/userRoutes')
app.use('/',userRoutes);

app.use(morgan('tiny'));


//---------- Admin route -----------//
const adminRoutes = require('./routes/adminRoutes')
app.use('/admin',adminRoutes);

app.listen(4000,()=>{
    console.log('server is running');
})

