const commentDao = require('../daos/comment.dao')
const commentingDao = require('../daos/commenting.dao')

///

exports.getCommentList = getCommentList;
exports.getReplyToCommentList = getReplyToCommentList;
exports.saveComment = saveComment;
exports.replyToComment = replyToComment;

///
/**
 * 
 * @param {*} comment_id 
 */
async function getReplyToCommentList(comment_id) {
  const result = await commentDao.getList()
  return result
    .filter(({replied_to_comment_id}) => replied_to_comment_id === comment_id) // return only with no reply
}

/**
 * 
 * @param {*} dto 
 * @returns 
 */
async function saveComment(dto) {

  const { commenter_name, comment} = dto;
  const result = await commentDao.save({commenter_name, comment});

  // remove from commenting via commenter name?
  let commenting_id = await commentingDao.getIdByCommenterName(commenter_name);
  if ( commenting_id ) {
    // remove
    await commentingDao.deleteById(commenting_id)
  }

  return await commentDao.getById(result.id)
}

/**
 * 
 * @param {*} replied_to_comment_id 
 * @param {*} dto 
 */
async function replyToComment(replied_to_comment_id, dto) {
  const { commenter_name, comment} = dto;
  const result = await commentDao.save(
    {
      replied_to_comment_id, 
      commenter_name, 
      comment
    }
  );

  // remove from commenting via commenter name?
  let commenting_id = await commentingDao.getIdByCommenterName(commenter_name);
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
  const list = result.filter(({replied_to_comment_id}) => !replied_to_comment_id)

  list.forEach(item => {
    item.reply_count = result.filter(({replied_to_comment_id}) => item.id === replied_to_comment_id).length
  });

  return list;
}