const host = window.location.origin;

/**
 * Private functions
*/
async function _getComments() {
  return await $.get(`${host}/api/comment`)
}

/**
 * 
 */
async function _getCommenting() {
  const result = await $.get(`${host}/api/commenting`)

  // remove based on current set name
  return result.filter(({commenter_name}) => commenter_name !== $('#name').val());
}

/**
 * 
 */
async function _setCommenting() {
  const body = {
    commenter_name: $('#name').val()
  }
  await $.post(`${host}/api/commenting`, body);
}

/**
 * 
 */
async function _sendMessage({commenter_name, comment, replied_to_comment_id}) {
  const body = {
    commenter_name, 
    comment,
    replied_to_comment_id, 
  }
  await $.post(`${host}/api/comment`, body);
}

/**
 * 
 */
function _showHideMessage() {
  if (!$('#name').val()) {
    $('#send').hide();
    $('#message').hide();
    return;
  }
  $('#send').show();
  $('#message').show();
  return;
}


/**
 * 
 */
function _event_onClickSendButton() {
  $("#send").click(async() => {
    if ( !$("#name").val() ) {
      return alert('Name is required!')
    }

    if ( !$("#message").val() ) {
      return alert('Message is required!')
    }

    await _sendMessage({
      commenter_name: $("#name").val(),
      comment: $("#message").val(),
    });

    // remove value
    $("#message").val('')

    _refreshCommentsAndCommenting();

  });
}

/**
 * 
 */
function _event_onChangeName() {
  $("#name").change(() => {
    _showHideMessage();
  })
}

/**
 * 
 */
function _event_onTyping() {
  $('#message').keyup(() => {
    if (!$('#name').val()) {
      return;
    }
    _setCommenting();
  });
}

function _dom_setCommenting(commenting) {
  $('#commenting').html('')
  const commentors = commenting.map(({commenter_name}) => commenter_name);
  if ( !commentors.length ) {
    return;
  }

  let message = ''
  if ( commentors.length === 1 ) {
    message = `${commentors.join('')} is typing...` 
  } else if ( commentors.length === 2 ) {
    message = `${commentors.join(' and ')} are typing...` 
  } else {
    message = `there are multiple users typing....` 
  }

  $('#commenting').html(`<p>${message}</p>`)
}

/**
 * 
 * @param {*} comments 
 */
function _dom_setComments(comments) {
  $('#messages').html('')

  comments.forEach(({
    comment, 
    commenter_name,
    create_datetime
  }) => {
    $('#messages').append(`
      <div class="comments">
        <p>
          ${comment}
        </p>
        <br />
        <p class="user">User: ${commenter_name} </p>
        <p class="create_datetime">Date: ${new Date(create_datetime).toString()} </p>
      </div>
    `)
  })
}

/**
 * 
 */
async function _refreshCommentsAndCommenting() {
  const comments = await _getComments();
  const commenting = await _getCommenting();
  _dom_setComments(comments);
  _dom_setCommenting(commenting);
}

/**
 * 
 */
function _listen_comments() {
  setInterval(_refreshCommentsAndCommenting, 5000)
}

////


$(() => {
  // initialize here
  _refreshCommentsAndCommenting();
  _showHideMessage();
  // initial triggers here

  // add listner here
  _listen_comments();

  // add event handling here
  _event_onClickSendButton();
  _event_onChangeName();
  _event_onTyping();

});