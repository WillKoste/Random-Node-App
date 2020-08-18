const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    res.json({success: true, data: 'mission articles'})
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, data: 'Server Error'});
  }
});

module.exports = router;