// ==UserScript==
// @name                 Restart button and menu entries
// @version              1.0
// @description          A toolbar button that restarts Firefox.
// ==/UserScript==

var disableScript = false;

(function() {

  if (disableScript || location != 'chrome://browser/content/browser.xul') return;

  const Cc = Components.classes, Ci = Components.interfaces,
        aName = Services.appinfo.name,
        aVersion = Services.appinfo.version,
        btnLabel = "Restart",
        btnImage = "list-style-image: url(chrome://browser/skin/sync.svg)",
        btnTip = "Restart " + aName + " " + aVersion;

  function restartNow(event) {
    if (event.button === 1) Services.appinfo.invalidateCachesOnRestart();
    else if (event.button === 2) return;
    let cancelQuit = Cc["@mozilla.org/supports-PRBool;1"].createInstance(Ci.nsISupportsPRBool);
    Services.obs.notifyObservers(cancelQuit, "quit-application-requested", "restart");
    if (!cancelQuit.data) Services.startup.quit(Services.startup.eAttemptQuit | Services.startup.eRestart);
  }

  try {
    CustomizableUI.createWidget({
      id: 'restart-button',
      type: 'custom',
      defaultArea: CustomizableUI.AREA_NAVBAR,
      onBuild: function(aDocument) {
        var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
        toolbaritem.onclick = event => restartNow(event);
        var props = {
          id: 'restart-button',
          class: 'toolbarbutton-1 chromeclass-toolbar-additional',
          label: btnLabel,
          style: btnImage
        };
        for (var p in props) toolbaritem.setAttribute(p, props[p]);
        return toolbaritem;
      }
    });
  } catch(e) {};

  var titlebox = document.getElementById("titlebar-buttonbox"),
      restartbtn = document.createElement("toolbarbutton");
  restartbtn.setAttribute("id", "restart-button");
  restartbtn.setAttribute("class", "titlebar-button");
  restartbtn.setAttribute("tooltiptext", btnTip);
  restartbtn.addEventListener("command", restartNow, false);
  titlebox.insertBefore(restartbtn, titlebox.firstChild);

})();