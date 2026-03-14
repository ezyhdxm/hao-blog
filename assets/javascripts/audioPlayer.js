function audioPlayer(options) {
  var config = options || {};
  var audioSelector = config.audioSelector || "#audioPlayer";
  var playlistSelector = config.playlistSelector || "#playlist";
  var currentClass = config.currentClass || "current-song";

  var audio = document.querySelector(audioSelector);
  var playlist = document.querySelector(playlistSelector);
  if (!audio || !playlist) return;

  var links = playlist.querySelectorAll("li a");
  if (!links.length) return;

  var currentSong = 0;
  for (var i = 0; i < links.length; i += 1) {
    if (links[i].parentElement.classList.contains(currentClass)) {
      currentSong = i;
      break;
    }
  }

  function setCurrentSong(index, shouldPlay) {
    currentSong = index;
    for (var j = 0; j < links.length; j += 1) {
      links[j].parentElement.classList.remove(currentClass);
    }
    links[currentSong].parentElement.classList.add(currentClass);
    audio.src = links[currentSong].href;
    if (shouldPlay) {
      audio.play();
    }
  }

  setCurrentSong(currentSong, false);

  playlist.addEventListener("click", function (event) {
    var anchor = event.target.closest("a");
    if (!anchor || !playlist.contains(anchor)) return;
    event.preventDefault();
    var index = Array.prototype.indexOf.call(links, anchor);
    if (index >= 0) {
      setCurrentSong(index, true);
    }
  });

  audio.addEventListener("ended", function () {
    var nextSong = currentSong + 1;
    if (nextSong >= links.length) nextSong = 0;
    setCurrentSong(nextSong, true);
  });
}