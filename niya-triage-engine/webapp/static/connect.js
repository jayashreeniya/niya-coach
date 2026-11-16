// Live countdown to the joining window, and an automatic refresh the moment it
// opens.
//
// Progressive enhancement. Without it the page is still correct - it just shows
// the time remaining as of page load, and the person has to refresh. With it,
// someone who opens the page five minutes early and waits sees the button come
// alive on its own, which is the one moment this whole product hinges on.
//
// The server remains the authority: this only triggers a reload, and the reload
// re-checks the window server-side. Nothing here can open a session early.
(function () {
  var nodes = document.querySelectorAll("[data-opens-in]");
  if (!nodes.length) return;

  var counters = [];
  nodes.forEach(function (node) {
    var seconds = parseInt(node.getAttribute("data-opens-in"), 10);
    if (isNaN(seconds)) return;
    counters.push({ node: node, remaining: seconds });
  });
  if (!counters.length) return;

  function format(total) {
    if (total <= 0) return "any moment";
    var days = Math.floor(total / 86400);
    var hours = Math.floor((total % 86400) / 3600);
    var minutes = Math.floor((total % 3600) / 60);
    var seconds = total % 60;
    if (days > 0) return days + "d " + hours + "h";
    if (hours > 0) return hours + "h " + minutes + "m";
    if (minutes > 0) return minutes + "m " + seconds + "s";
    return seconds + "s";
  }

  var timer = setInterval(function () {
    var reload = false;
    counters.forEach(function (counter) {
      counter.remaining -= 1;
      counter.node.textContent = format(counter.remaining);
      // One second of slack, so the reload lands after the server agrees the
      // window is open rather than a tick before it.
      if (counter.remaining === -1) reload = true;
    });
    if (reload) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 1000);
})();
