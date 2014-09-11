// ==UserScript==
// @name ChristmasTree
// @include http://*
// @include https://*
// @include about:blank
// @require jquery-1.9.1.min.js
// ==/UserScript==

var $ = window.$.noConflict(true); // Required for Opera and IE
//var STARTUPDIGEST_URL = '//localhost:3000';
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

  var iFrame = $(document.createElement('iframe'))
    .attr({
      'id': 'startupdigest-frame',
      'src': STARTUPDIGEST_URL + "/admin/events/import.iframe?url=" + url
    })
    .appendTo(popover);

  var closeButton = $(document.createElement('img'))
    .attr({
      'id': 'startupdigest-close',
      'src': kango.io.getResourceUrl('icons/close.png')
    })
    .click(hidePopover)
    .appendTo(popover);

  var expandButton = $(document.createElement('div'))
    .attr({
      'id': 'startupdigest-expand',
    })
    .click(toggleExpand)
    .appendTo(popover);

  var expandIcon = $(document.createElement('img'))
    .attr({
      'id': 'startupdigest-expand-icon',
      'src': kango.io.getResourceUrl('icons/collapsearrow.png')
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
    $('#startupdigest-popover').animate({
      'width': '50px'
    }, 500);
  }
  else {
    $('#startupdigest-popover').animate({
      'width': '550px'
    }, 500);
  }
};

kango.addMessageListener('displayPopover', function(event){
  if (isOpen === false) {
    url = event.data.url;
    displayPopover(url);
  };
});
