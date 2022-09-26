const express = require('express');
const router = express.Router();

const commentService = require('../services/comment.service')

///

router.get('/', getList);
router.post('/', addComment)

router.get('/reply/:comment_id', getListForComment);
router.post('/reply/:comment_id', replyToComment);


///

/**
*
*/
async function getListForComment(req, res, next) {
  try {
    const {comment_id} = req.params;
    const result = await commentService.getReplyToCommentList(comment_id);
    res.json(result)
  } catch(err){
    next(err)
  }
}

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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function replyToComment(req, res, next) {
  try {
    const {params, body: dto} = req;
    const {comment_id} = params;
    const result = await commentService.replyToComment(comment_id, dto)
    res.json(result)    
  } catch(err) {
    next(err)
  }
}

module.exports = router;