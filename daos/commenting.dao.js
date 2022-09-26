const persist = require('./persist');

///

const data = [];

///
exports.getById = getById;
exports.getList = getList;
exports.save = save;
exports.getIdByCommenterName = getIdByCommenterName;
exports.setAsStillActive = setAsStillActive;
exports.deleteById = deleteById;

///

/**
 * 
 * @param {*} id 
 */
async function deleteById(id) {
  return await persist.deleteById(data, id);
}

async function getById(id) {
  return await persist.getById(data, id);
}

/**
*
*/
async function setAsStillActive(id) {
  const details = await persist.getById(data, id);
  if ( !details ) {
    throw new Error('Id does not exists', {id});
  }
  await persist.update(data, id, {
    ...details, 
    last_active_datetime: Date.now()
  })
}

/**
*
*/
async function getIdByCommenterName(commenter_name) {
  const {id} = data.filter(item => item.commenter_name === commenter_name)[0] || {}
  return id;
}

/**
*
*/
async function getList() {
  return data
}


/**
*
*/
async function save(
  {
    commenter_name
  }) {
    
  if (!commenter_name) {
    throw new Error('commenter_name is required!')
  }
  
  return persist.save(data, {
    commenter_name, 
    last_active_datetime: Date.now()
  })
  
}
