const commentingDao = require('../daos/commenting.dao')

///

exports.getCommentingList = getCommentingList;
exports.saveCommenting = saveCommenting;

///

/**
*
*/
async function saveCommenting(dto) {
  let id = await commentingDao.getIdByCommenterName(dto.commenter_name);
  if ( !id ) {
    const result = await commentingDao.save(dto);
    id = result.id
  } else {
    await commentingDao.setAsStillActive(id)
  }
  
  return await commentingDao.getById(id)
}

/**
*
*/
async function getCommentingList() {
  const result = await commentingDao.getList()
  return result
    .filter(item => item.last_active_datetime > Date.now() - 5000) // it should be less than 5 seconds active
    .sort((a, b) => a.create_datetime - b.create_datetime) // order by create_datetime ASC
}