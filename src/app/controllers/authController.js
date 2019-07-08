const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth');

const User = require('../models/user');

const router = express.Router();

const createToken = ( params = {} ) => 
  jwt.sign(params, authConfig.secret, {
    expiresIn: 86400.
});

router.post('/register', async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'Usuário já existe'});
    }

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({ user, token: createToken({ id: user.id }) });
  } catch (err ) {
    return res.status(400).send({
      error: 'Registration fail'
    });
  }
});

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) 
    return res.status(400).send({ error: 'User not found'});

  if (!await bcrypt.compare(password, user.password))
    return res.status(400).send({ error: 'Invalid password'});
  
  user.password = undefined;

  return res.send({ user, token: createToken({ userId: user.id }) });
});

module.exports = app => app.use('/auth', router);