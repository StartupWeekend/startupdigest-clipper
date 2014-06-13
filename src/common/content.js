// ==UserScript==
// @name ChristmasTree
// @include http://*
// @include https://*
// @include about:blank
// @require jquery-1.9.1.min.js
// ==/UserScript==

var $ = window.$.noConflict(true); // Required for Opera and IE
var STARTUPDIGEST_URL = '//localhost:3000'

var displayPopover = function(){
  //Load styles
  kango.invokeAsync('kango.io.getExtensionFileContents', 'res/style.css', function(cssCode){
    $('head').append("<style id='startupdigest-style'>" + cssCode + "</style");
  });

  //Rendering
  var popover = $(document.createElement('div'))
      .attr({
        'id': 'startupdigest-popover',
        'name': 'startupdigest-popover'
      })
      .css({
        "width": "50px",
        "opacity": "0.0"
      })
      .animate({
        "width": "500px",
        "opacity": "1.0"
      }, 500)
      .appendTo(document.body);

  var iFrame = $(document.createElement('iframe'))
    .attr({
      'id': 'startupdigest-frame',
      'src': STARTUPDIGEST_URL '/admin/digests/1.iframe'
    })
    .appendTo(popover);

  var closeButton = $(document.createElement('div'))
    .attr({
      'id': 'startupdigest-close'
    })
    .click(hidePopover)
    .appendTo(popover);
};

var hidePopover = function(){
  $('#startupdigest-popover').animate({
    'width': '50px',
    'opacity': 0.0
  }, 500, function(){
    $('#startupdigest-style').remove();
    this.remove();
  });
};

kango.addMessageListener('displayPopover', function(event){
  displayPopover();
});
