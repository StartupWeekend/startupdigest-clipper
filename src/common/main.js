function MyExtension() {
    var self = this;
    kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function() {
        self._onCommand();
    });
}

MyExtension.prototype = {

    _onCommand: function() {
        kango.browser.tabs.getCurrent(function(tab){
            tab.dispatchMessage('displayPopover', {});
        });
    }
};

var extension = new MyExtension();
