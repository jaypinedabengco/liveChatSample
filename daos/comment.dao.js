const persist = require('./persist');

///

const data = [];

///

exports.getById = getById;
exports.getList = getList;
exports.save = save;

///

async function getById(id) {
  return await persist.getById(data, id);
}

/**
*
*/
async function getList() {
  return data.sort((a, b) => a.create_datetime - b.create_datetime) // order by create_datetime ASC;
}

/**
*
*/
async function save(
  {
    replied_to_comment_id = null,
    commenter_name,
    comment = ''
  }) {
    
  if (!commenter_name) {
    throw new Error('commenter_name is required!')
  }
  
  return persist.save(data, {
    commenter_name, 
    replied_to_comment_id,
    comment
  })
}
