const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});
const expressLayout = require('express-ejs-layouts');
const connectDB = require('./config/db');
const helmet = require('helmet');
const morgan = require('morgan');
const colors = require('colors');

const app = express();

connectDB();

app.use(expressLayout);
app.set('view engine', 'ejs');

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', require('./routes/index'));
app.use('/api/users', require('./routes/users'));
app.use('/api/articles', require('./routes/articles'));

const port = process.env.PORT || 5000;
const mode = process.env.NODE_ENV || 'None yo bees wax';

app.listen(port, () => {
  console.log(`Server running on port ${port}, in ${mode} mode`.cyan.underline.bold)
});