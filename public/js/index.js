
// # index

$(function() {

  $('.pop-up').popupWindow({
      centerBrowser: 1
    , width: 963
    , height: 520
    , resizable: 1
    , location: 1
    , scrollbars: 1
  })

  /*globals crossriderInstaller*/
  /*
  var __CRI = new crossriderInstaller({
    app_id:18896,
    app_name:'PinPigeon'
  });

  var _cr_toolbar = new __CRI.toolbar({
    text:'Send postcards directly from Pinterest with the PinPigeon browser extension.',
    position:'top'
  });

  $('.extension').click(__CRI.install)
  */

  var $textMessage = $('#text-message')

  $textMessage.bind('keyup.lines', numLines)
  $textMessage.bind('keypress.lines', numLines)
  $textMessage.bind('change.lines', numLines)

  function numLines(ev) {

    var max = 20

    var lines = $(this).val().replace(/\r\n/g, '\n').split('\n')

    // rewrite each line and then concat together
    /*
    for(var i=0; i<lines.length; i+=1) {
      var str = lines[i]
      // if string is longer than 48 chars, take the substring after
      //  and bump it to the next line
      if (str.length > 23) {
        var subStr = str.substring(22, str.len)
        lines[i] = str.substring(0, 22)
        if (typeof lines[i + 1] !== 'string')
          lines[i + 1] = ''
        lines[i + 1] = subStr + lines[i + 1]
      }
    }
    */

    // prevent user from adding more lines or typing
    var len = lines.length
    if (len > max) {
      // remove the extra lines
      lines = lines.slice(0, 19)
    }

    $textMessage.val(lines.join('\r'))

  }

  $textMessage.bind('keyup.count', checkCount)
  $textMessage.bind('keypress.count', checkCount)
  $textMessage.bind('change.count', checkCount)

  var $characters = $('#characters')

  function checkCount(ev) {

    var max = 300
      , len = $(this).val().length

    if (len >= max) {
      $characters.text('You have reached the limit.')
      ev.preventDefault()
    } else {
      var char = max - len
      if (len === 1)
        $characters.text(char + ' character remaining.')
      else
        $characters.text(char + ' characters remaining.')
    }
  }

})
