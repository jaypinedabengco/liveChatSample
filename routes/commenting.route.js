const express = require('express');
const router = express.Router();

const commentingService = require('./../services/commenting.service')

///


router.get('/', getList);
router.post('/', userIsCommenting)


///

/**
*
*/
async function getList(req, res, next) {
  try {
    const result = await commentingService.getCommentingList();
    res.json(result)
  } catch(err){
    next(err)
  }
}

/**
*
*/
async function userIsCommenting(req, res, next) {
  try {
    const {body: dto} = req;
    const result = await commentingService.saveCommenting(dto);
    res.json(result)
  } catch(err){
    next(err)
  }
}

module.exports = router;