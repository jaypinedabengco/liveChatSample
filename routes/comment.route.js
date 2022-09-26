const express = require('express');
const router = express.Router();

const commentService = require('../services/comment.service')

///

router.get('/', getList);
router.post('/', addComment)

///

/**
*
*/
async function getList(req, res, next) {
  try {
    const result = await commentService.getCommentList();
    res.json(result)
  } catch(err){
    next(err)
  }
  
}

/**
*
*/
async function addComment(req, res, next) {
  try {
    const {body: dto} = req;
    const result = await commentService.saveComment(dto)
    res.json(result)    
  } catch(err) {
    next(err)
  }
}

module.exports = router;