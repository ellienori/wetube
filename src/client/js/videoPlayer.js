const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

// handle play pause
playBtn.addEventListener("click", (event) => {
  // if the video is playing, pause it
  if (video.paused) {
    video.play();
  } else {
    // else play the video
    video.pause();
  }
});

// handle mute
muteBtn.addEventListener("click", (event) => {

});

// Change Innertext
video.addEventListener("pause", (event) => {
  playBtn.innerText="Play";
});
video.addEventListener("play", (event) => {
  playBtn.innerText="Pause";
});