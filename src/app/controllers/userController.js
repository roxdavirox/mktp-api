const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

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

  return res.send({ user, token: createToken({ id: user.id }) });
});

router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;
  try {

    const user = await User.findOne({ email });

    if (!user) 
      return res.status(400).send({ error: 'User not found'});

    const token = crypto.randomBytes(20).toString('hex');

    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: expires
      }
    });

    mailer.sendMail({
      to: email,
      from: 'roxdavirox@gmail.com',
      template: 'auth/forgot_password',
      context: { token }
    }, (err) => {
      if (err) 
        return res.status(400).send({ error: 'Cannot send forgot password to email'});

      return res.send();
    });

  } catch(err) {
    res.status(400).send({ error: 'Error on forgot password, try again' + err });
  }
});

router.post('/reset_password', async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .select('+passwordResetToken passwordResetExpires');

    if (token !== user.passwordResetToken) 
      return res.status(400).send({ error: 'Invalid token'});

    const now = new Date();

    if (now > user.passwordResetExpires)
      return res.status(400).send({ error: 'Expired token, generate a new one'});
    
    user.password = password;

    await user.save();

    res.send();
  } catch (err) {
    res.status(400).send({ error: 'Cannot reset password, try again'});
  }
})

module.exports = app => app.use('/auth', router);