// ==UserScript==
// @name StartupDigestClipper
// @include http://*
// @include https://*
// @include about:blank
// @require jquery-1.9.1.min.js
// ==/UserScript==

var $ = window.$.noConflict(true); // Required for Opera and IE
// var STARTUPDIGEST_URL = '//57d68f83.ngrok.com'
// var STARTUPDIGEST_URL = '//localhost:3000';
var STARTUPDIGEST_URL = '//www.startupdigest.com';
var isOpen = false;

var displayPopover = function(url){
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
        "width": "550px",
        "opacity": "1.0"
      }, 500)
      .appendTo(document.body);

  var header = $(document.createElement('div'))
    .attr({
      id: 'startupdigest-popover-header'
    }).appendTo(popover)

  var iFrame = $(document.createElement('iframe'))
    .attr({
      'frameborder': "none",
      'id': 'startupdigest-frame',
      'src': STARTUPDIGEST_URL + "/admin/events/import.iframe?url=" + url
    })
    .appendTo(popover);

  var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
  var eventer = window[eventMethod];
  var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

  // Listen to message from child window
  eventer(messageEvent,function(e) {
      var key = e.message ? "message" : "data";
      var data = e[key];
      if(data == "close!") {
        hidePopover();
      }
      //run function//
  },false);

  var closeButton = $(document.createElement('span'))
    .attr({
      'id': 'startupdigest-close',
    })
    .text("Cancel")
    .click(hidePopover)
    .appendTo(header);

  var expandButton = $(document.createElement('div'))
    .attr({
      'id': 'startupdigest-expand',
    })
    .click(toggleExpand)
    .appendTo(header);

  var headerLogo = $(document.createElement('img'))
    .attr({
      'id': 'startupdigest-header-logo',
      src: kango.io.getResourceUrl('icons/icon128.png')
    })
    .click(toggleExpand)
    .appendTo(header);

  var headerText = $(document.createElement('span'))
    .attr({
      'id': 'startupdigest-header-text'
    }).text("Startup Digest Event Clipper")
    .appendTo(header);

  var expandIcon = $(document.createElement('span'))
    .attr({
      'id': 'startupdigest-expand-icon'
    })
    .appendTo(expandButton);

  isOpen = true;
};

var hidePopover = function(){
  $('#startupdigest-popover').animate({
    'width': '50px',
    'opacity': 0.0
  }, 500, function(){
    $('#startupdigest-style').remove();
    this.remove();
  });
  isOpen = false;
};

var expanded = true;
var toggleExpand = function(){
  expanded = !expanded;
  if (expanded === false) {
    $('#startupdigest-expand-icon').addClass('collapsed');
    $('#startupdigest-popover').animate({
      'height': '40px'
    }, 250).css({'box-shadow': 'none'});
  }
  else {
    $('#startupdigest-expand-icon').removeClass('collapsed');
    $('#startupdigest-popover').css({
      'height': '',
      'box-shadow': "0 0 10000px 10000px rgba(0,0,0,0.3)"
    });
  }
};

kango.addMessageListener('displayPopover', function(event){
  if (isOpen === false) {
    url = event.data.url;
    displayPopover(url);
  };
});
