var STONLY_WID = "e1b1fff7-9fb3-11eb-8dbf-062882f67cfe";
!(function (s, t, o, n, l, y, w, g) {
  s.StonlyWidget ||
    (((w = s.StonlyWidget = function () {
      w._api ? w._api.apply(w, arguments) : w.queue.push(arguments);
    }).queue = []),
    ((y = t.createElement(o)).async = !0),
    (g = new XMLHttpRequest()).open("GET", n + "version?v=" + Date.now(), !0),
    (g.onreadystatechange = function () {
      4 === g.readyState &&
        ((y.src =
          n +
          "stonly-widget.js?v=" +
          (200 === g.status ? g.responseText : Date.now())),
        (l = t.getElementsByTagName(o)[0]).parentNode.insertBefore(y, l));
    }),
    g.send());
})(window, document, "script", "https://stonly.com/js/widget/v2/");
