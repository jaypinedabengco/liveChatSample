const commentDao = require('../daos/comment.dao')
const commentingDao = require('../daos/commenting.dao')

///

exports.getCommentList = getCommentList;
exports.saveComment = saveComment;

///

/**
*
*/
async function saveComment(dto) {
  const result = await commentDao.save(dto);

  // remove from commenting via commenter name?
  let commenting_id = await commentingDao.getIdByCommenterName(dto.commenter_name);
  if ( commenting_id ) {
    // remove
    await commentingDao.deleteById(commenting_id)
  }

  return await commentDao.getById(result.id)
}

/**
*
*/
async function getCommentList() {
  const result = await commentDao.getList()
  return result
    .sort((a, b) => a.create_datetime - b.create_datetime) // order by create_datetime ASC
}