const express = require('express');
const userRoutes = express.Router();
const {User} = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

userRoutes.post('/register', async (req, res) => {
  try {
    const { name, email, password,role } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = await User.create({ name,email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user.' });
  }
});

userRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Authentication failed. Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.secretKey, { expiresIn: '1h' });

    res.status(200).json({ msg:'Login Success!',token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during login.' });
  }
});
module.exports = {userRoutes};
