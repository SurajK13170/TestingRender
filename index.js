const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const {sequelize} = require('./db');
const {userRoutes} = require('./routes/User.route');
const {blogRoutes} = require('./routes/blog.route');

const {authenticateToken} = require('./middlewares/auth')
const {authorizeRoles} = require('./middlewares/authoriz')

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());


app.use('/users', userRoutes);
app.use('/blogs', blogRoutes);


app.use('/public', express.static(path.join(__dirname, 'uploads/public')));
app.use('/private', authenticateToken, authorizeRoles(['admin']), express.static(path.join(__dirname, 'uploads/private')));

sequelize.sync().then(()=>{
  console.log('Tabel Created')
  app.listen(8080,()=>{
      console.log('Server is runnig at Port No. 8080')
  })
})

