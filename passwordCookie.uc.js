// ==UserScript==
// @name                 Password/Cookie button
// @version              1.0
// @description          Left-click opens password manager and Middle-click opens cookie manager.
// ==/UserScript==

var disableScript = false;

(function() {

  if (disableScript || location != 'chrome://browser/content/browser.xul') return;

  var {classes: Cc, interfaces: Ci, utils: Cu} = Components, eTLD;

  const et = Cc["@mozilla.org/network/effective-tld-service;1"].getService(Ci.nsIEffectiveTLDService),
        wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator).getMostRecentWindow,
        btnImage = "list-style-image: url(file:///C:/FirefoxChrome/password.png)",
        btnLabel = "Password/Cookie Manager",
        btnTip = btnLabel + "\n \u2022 Left-click for Password Manager\n \u2022 Middle-click for Cookie Manager";

  function onClick(event) {
    if (event.button === 0) {
      var uri = gBrowser.selectedBrowser.currentURI,
          win = wm("Toolkit:PasswordManager");
      try {
        eTLD = et.getBaseDomainFromHost(uri);
      } catch (ex) { eTLD = uri.asciiHost }
      if (win) {
        win.setFilter(eTLD);
        win.focus();
      } else window.openDialog("chrome://passwordmgr/content/passwordManager.xul", "Toolkit:PasswordManager", "", { filterString: eTLD });
    }
    else if (event.button == 1) {
      var uri = gBrowser.selectedBrowser.currentURI,
          win = wm("Browser:Cookies");
      try {
        eTLD = et.getBaseDomainFromHost(uri);
      } catch (ex) { eTLD = uri.asciiHost }
      if (win) {
        win.gCookiesWindow.setFilter(eTLD);
        win.focus();
      } else window.openDialog("chrome://browser/content/preferences/cookies.xul", "Browser:Cookies", "", { filterString: eTLD });
    }
    else return;
  }

  try {
    CustomizableUI.createWidget({
      id: 'password-cookie-button',
      type: 'custom',
      defaultArea: CustomizableUI.AREA_NAVBAR,
      onBuild: function(aDocument) {
        var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
        toolbaritem.onclick = event => onClick(event);
        var props = {
          id: 'password-cookie-button',
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
