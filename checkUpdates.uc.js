// ==UserScript==
// @name                 Check for Browser Update button
// @version              1.0
// @description          A toolbar button that checks for browser updates.
// ==/UserScript==

var disableScript = false;

(function() {

  if (disableScript || location != 'chrome://browser/content/browser.xul') return;

  const btnLabel = "Check for Updates",
        btnImage = "list-style-image: url(file:///C:/FirefoxChrome/updates.png)",
        btnTip = "Check for browser updates";

  try {
    CustomizableUI.createWidget({
      id: 'check-for-updates',
      type: 'custom',
      defaultArea: CustomizableUI.AREA_NAVBAR,
      onBuild: function(aDocument) {
        var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
        toolbaritem.onclick = event => openAboutDialog();
        var props = {
          id: 'check-for-updates',
          class: 'toolbarbutton-1 chromeclass-toolbar-additional',
          label: btnLabel,
          tooltiptext: btnTip,
          style: btnImage
        };
        for (var p in props) toolbaritem.setAttribute(p, props[p]);
        return toolbaritem;
      }
    });
  } catch(e) {};

})();