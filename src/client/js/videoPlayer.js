const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

// handle play pause
playBtn.addEventListener("click", (event) => {
  // if the video is playing, pause it
  if (video.paused) {
    video.play();
  } else {
    // else play the video
    video.pause();
  }

  playBtn.innerText = video.paused ? "Play" : "Pause";
});

// handle mute
muteBtn.addEventListener("click", (event) => {
  if(video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : 0.5;
});