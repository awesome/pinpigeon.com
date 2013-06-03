
//     PinPigeon for Pinterest
//     Copyright (c) 2012 PinPigeon, LLC.

// # PinPigeon for Pinterest

;(function($) {

  pinpigeon();
  setInterval(pinpigeon, 3000);

  function pinpigeon() {
    // filter out all the PinImage selectors that
    // don't already have a pinpigeon class applied
    var $pins = $('.pin').not('.pinpigeon').addClass('pinpigeon');
    for(var i=0; i<$pins.length; i+=1) {
      var $pin = $($pins[i]);
      var pid = $pin.attr('data-id');
      var $actions = $pin.find('.actions');
      var href = 'https://pinpigeon.com/pin/' + pid
      var $btn = $('<a target="_blank" class="Button Button11 WhiteButton ContrastButton repin_link" style="padding:5px;" href="' + href + '"><img src="http://d33304ifi1rp4s.cloudfront.net/pinterest.png" alt="" /></a>');
      $actions.find('.likebutton').after($btn)
      $actions.find('.comment').html('<em style="margin-left: 4px;"></em>').css('padding', '6px');
      $btn.click(click(href));
    }
  }

  function click(href) {
    return function() {
      window.open(href, '_blank');
    }
  }

})(jQuery);
