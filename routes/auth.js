const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// @desc      Get logged in user
// @route     GET /api/auth/me
// @access    Private
router.post('/login', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, data: 'Server Error'});
  }
});

// @desc      Register user
// @route     POST /api/auth/register
// @access    Public
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Valid email address is required').isEmail(),
  check('password', 'Password must contain at least 6 characters').isLength({min: 6})
], async (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({success: false, data: errors.array()});
  }

  const {name, email, username, password} = req.body;
  
  try {
    let user = await User.findOne({email});

    if(user){
      return res.status(400).json({success: false, data: 'That email address is already in use, please use another'});
    }

    user = new User({
      name,
      email,
      username,
      password
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt)

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '2d'}, (err, token) => {
      if(err) throw err;
      res.json({token});
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, data: 'Server Error'});
  }
});

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
router.post('/login', async (req, res) => {
  try {
    
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, data: 'Server Error'});
  }
});

module.exports = router;