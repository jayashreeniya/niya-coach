// Preselect the timezone the browser reports, so most people never touch the
// dropdown. Progressive enhancement only: without JavaScript the field is a
// required select with no default, so nobody is silently assigned a timezone
// they do not live in. Getting this wrong shows every appointment at the wrong
// hour, which is the failure this whole app exists to avoid.
(function () {
  var select = document.getElementById("timezone_name");
  if (!select || select.value) return;

  var guess;
  try {
    guess = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    return;
  }
  if (!guess) return;

  guess = guess.toLowerCase();
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].value === guess) {
      select.value = guess;
      var hint = document.getElementById("timezone_hint");
      if (hint) {
        hint.textContent =
          "Detected from your device. Change it if that is not right.";
      }
      return;
    }
  }
})();
