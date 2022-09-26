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
async function _sendMessage({commenter_name, comment}) {
  const body = {
    commenter_name, 
    comment
  }
  await $.post(`${host}/api/comment`, body);
}

/**
 * 
 * @param {*} commentId 
 * @returns 
 */
async function _getReplies(commentId) {
  return await $.get(`${host}/api/comment/reply/${commentId}`)
}

/**
 * 
 * @param {*} commentId 
 * @returns 
 */
 async function _sendReply(commentId, {commenter_name, comment}) {
  const body = {
    commenter_name, 
    comment
  }   
  return await $.post(`${host}/api/comment/reply/${commentId}`, body)
}


/**
 * 
 */
function _showHideMessage() {
  if (!$('#name').val()) {
    $('#comments-container').hide();
    $('#no-name-error').show();
    return;
  }
  $('#comments-container').show();
  $('#no-name-error').hide();
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

function _event_onClickReplyButton() {
  $('body').on('click', '.reply_button', async function() {
    const {commentId} = $(this).data();

    const comment = $(`.comments-${commentId} textarea.reply`).val();

    if ( !$("#name").val() ) {
      return alert('Name is required!')
    }

    if ( !comment ) {
      return alert('Reply is required!')
    }

    await _sendReply(commentId, {
      commenter_name: $("#name").val(),
      comment,
    });

    // remove value
    $(`.comments-${commentId} textarea.reply`).val('')

    refreshReplyList(commentId)
  })
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
  $('body').on('keyup', '#message, textarea.reply', () => {
    if (!$('#name').val()) {
      return;
    }
    _setCommenting();
  })
  // $('#message').keyup(() => {
  //   if (!$('#name').val()) {
  //     return;
  //   }
  //   _setCommenting();
  // });
}

/**
 * 
 * @param {*} commentId 
 */
async function refreshReplyList(commentId) {

  if ( !$(`.comments-${commentId} .replies`).length ) {
    return;
  }

  const replies = await _getReplies(commentId)
  console.log({replies});
  replies.forEach(({
    id, 
    comment,
    commenter_name,
    create_datetime
  }) => {
    
    const reply = $(`.comments-${commentId} .replies-${id}`)

    if ( reply.length ) {
      return;
    }

    $(`.comments-${commentId} .replies`).append(`
      <div class="comments replies-${id}">
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

async function showReplyView(commentId) {
  // show
  $(`.comments-${commentId}`).addClass('replying')

  // fetch reply list
  await refreshReplyList(commentId);

}

/**
 * 
 */
function _event_addReplyToComment() {
  $('body').on('click', 'a.show-reply, a.reply-to-comment', function() {
    const {commentId} = $(this).data();
    showReplyView(commentId)
  })
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
  // $('#messages').html('')

  comments.forEach((comment) => {
    const {
      id
    } = comment;
    if ( $(`.comments-${id}`).length ) {
      return;
    }

    $('#messages').append(
      `
      <div data-comment-id="${id}" class="comments comments-${id}">
        ${_buildComment(comment)}
      </div>
      `
    )
  })
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
function _buildComment({
  id,
  comment, 
  commenter_name,
  create_datetime,
  reply_count
}) {
  return `
      <p class="comment-details">
        ${comment}
      </p>
      <br />
      <p class="user">User: ${commenter_name} </p>
      <p class="create_datetime">Date: ${new Date(create_datetime).toString()} </p>
      <a href="javascript:void(0);" class="show-reply" data-comment-id="${id}"> Reply </a>
      <div class="reply_container">
        <div class="replies"></div>
        <textarea
          class="reply"
          class="form-control"
          placeholder="Your Reply Here"></textarea>
        <button class="reply_button btn btn-success" data-comment-id="${id}"> Reply </button>
      </div> 
      <br />
      ${
        !reply_count ? '' : `<a href="javascript:void(0);" class="reply-to-comment" data-comment-id="${id}"> ${reply_count} ${ reply_count > 1? 'Replies': 'Reply' } </a>`
      }
  `
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
function _refreshReplies() {
  const commentIds = []
  
  $('.comments').map(function () {
    const {commentId} = $(this).data()
    commentIds.push(commentId);
  })

  commentIds.forEach(commentId => refreshReplyList(commentId))
}

/**
 * 
 */
function _listen_comments() {
  setInterval(_refreshCommentsAndCommenting, 5000)
}

/**
 * 
 */
 function _listen_replies() {
  setInterval(_refreshReplies, 5000)
}

////


$(() => {
  // initialize here
  _refreshCommentsAndCommenting();
  _showHideMessage();
  // initial triggers here

  // add listner here
  _listen_comments();
  _listen_replies();

  // add event handling here
  _event_addReplyToComment();
  _event_onClickSendButton();
  _event_onClickReplyButton();
  _event_onChangeName();
  _event_onTyping();

});