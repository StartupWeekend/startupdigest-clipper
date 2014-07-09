// ==UserScript==
// @name ChristmasTree
// @include http://*
// @include https://*
// @include about:blank
// @require jquery-1.9.1.min.js
// ==/UserScript==

var $ = window.$.noConflict(true); // Required for Opera and IE
var STARTUPDIGEST_URL = '//localhost:3000';

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
      'src': 'about:blank'
    })
    .appendTo(popover);

  var closeButton = $(document.createElement('div'))
    .attr({
      'id': 'startupdigest-close'
    })
    .click(hidePopover)
    .appendTo(popover);

  var expandButton = $(document.createElement('div'))
    .attr({
      'id': 'startupdigest-expand'
    })
    .click(toggleExpand)
    .appendTo(popover);

  var expandIcon = $(document.createElement('i'))
    .attr({
      'id': 'startupdigest-expand-icon',
      'class': 'icon-arrow-left'
    })
    .appendTo(expandButton);
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

var expanded = true;
var toggleExpand = function(){
  expanded = !expanded;
  if (expanded === false) {
    $('#startupdigest-popover').animate({
      'width': '50px'
    }, 500);
    $('#startupdigest-expand-icon').attr({ 'class': 'icon-arrow-left'});
  }
  else {
    $('#startupdigest-popover').animate({
      'width': '500px'
    }, 500);
    $('#startupdigest-expand-icon').attr({ 'class': 'icon-arrow-right'});
  }
};

kango.addMessageListener('displayPopover', function(event){
  displayPopover();
  url = event.data.url;
  target = STARTUPDIGEST_URL + '/admin/events/import.iframe';

  // Sends the request
  $.ajax({
    'method': 'POST',
    'url': target,
    'data': { 'url': url }
  })
  .fail(function(jqXHR, status, err){
    kango.console.log(jqXHR.responseText);
    $('#startupdigest-frame').contents().find('html').html(jqXHR.responseText);
  })
  .done(function(data, status, jqxhr){
    $('#startupdigest-frame').contents().find('html').html(data);
  });
});
