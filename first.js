function loadedPanel(what) {
    //We are going to set the badge as the number of li elements inside the target
    $.ui.updateBadge("#aflink", $("#af").find("li").length);
}


function unloadedPanel(what) {
    console.log("unloaded " + what.id);
}

if (!((window.DocumentTouch && document instanceof DocumentTouch) || 'ontouchstart' in window)) {
    var script = document.createElement("script");
    script.src = "plugins/af.desktopBrowsers.js";
    var tag = $("head").append(script);
    //$.os.desktop=true;
}

//  $.feat.nativeTouchScroll=true;
