exports.getById = getById;
exports.save = save;
exports.update = update;
exports.deleteById = deleteById;

/////

/**
 * 
 * @param {*} data 
 * @param {*} id 
 */
async function deleteById(data, id) {
  let index_to_delete = null;
  data.forEach((item, index) => {
    if ( item.id !== id ) {
      return;
    }
    index_to_delete = index;
  })

  if ( index_to_delete === null ) {
    return null;
  }

  return data.splice(index_to_delete, 1)
}

/**
*
*/
async function getById(data, id) {
  return data.filter(item => item.id === id)[0]
}

/**
*
*/
async function save(data, dto) {
  const item = {    
    // initialize for ordering purpose
    id: null, 
    
    ...dto,
    
    // set default
    id: _uuid(),
    create_datetime: Date.now(),
    update_datetime: null,
  }
  data.push(item);
  return item;
}

/**
*
*/
async function update(data, id, dto) {
  data.forEach((item) => {
    if (item.id !== id) {
      return;
    }

    const keys = Object.keys(dto);
    keys.forEach((key) => {
      if (key === 'id') {
        return;
      }
      item[key] = dto[key];
    });
    item['update_datetime'] = Date.now()
  });
  
  return data;
}


/**
*
*/
function _uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
