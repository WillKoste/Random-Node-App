const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const Article = require('../models/Article');

router.get('/', async (req, res) => {
  try {
    const articles = await Article.find();

    if(!articles){
      return res.status(404).json({success: false, data: 'No articles found'});
    }

    if(articles.length === 0){
      return res.status(200).json({success: true, data: 'No articles in database, add one to get started!'});
    }

    res.json({success: true, count: articles.length, data: articles});
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, data: 'Server Error'});
  }
});

router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if(!article){
      return res.status(404).json({success: false, data: `No article found with the id of ${req.params.id}`});
    }

    res.json({success: true, data: article});
  } catch (err) {
    console.error(err);
    if(err.kind === 'ObjectId'){
      return res.status(400).json({success: false, data: 'Incorect id format'});
    }
    res.status(500).json({success: false, data: 'Server Error'});
  }
});

router.post('/', [
  check('title', 'Title is required').not().isEmpty(),
  check('author', 'Author is required').not().isEmpty(),
  check('body', 'Body is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({success: false, data: errors.array()});
  }

  const {title, author, body} = req.body;
  
  try {
    const article = await Article.create({
      title,
      author,
      body
    });

    res.status(201).json({success: true, data: article});
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, data: 'Server Error'});
  }
});

router.put('/:id', async (req, res) => {
  try {
    let article = await Article.findById(req.params.id);

    if(!article){
      return res.status(404).json({success: false, data: `No article found with the id of ${req.params.id}`});
    }

    console.log(1234);

    article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({success: true, data: article});
  } catch (err) {
    console.error(err);
    if(err.kind === 'ObjectId'){
      return res.status(400).json({success: false, data: 'Incorect id format'});
    }
    res.status(500).json({success: false, data: 'Server Error'});
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if(!article){
      return res.status(404).json({success: false, data: `No article found with the id of ${req.params.id}`});
    }

    article.remove();

    res.json({success: true, data: `Article ${req.params.id} had been successfully deleted`});
  } catch (err) {
    console.error(err);
    if(err.kind === 'ObjectId'){
      return res.status(400).json({success: false, data: 'Incorect id format'});
    }
    res.status(500).json({success: false, data: 'Server Error'});
  }
});

module.exports = router;