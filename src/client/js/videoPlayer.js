const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

let volume = 0.5;
video.volume = volume;

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
  volumeRange.value = video.muted ? 0 : volume;
});

// handle volume
volumeRange.addEventListener("input", (event) => {
  const {
    target: {
      value,
    }
  } = event;
  if (Number(value) === 0) {
    video.muted = true;
  } else if (video.muted) {
    video.muted = false;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";

  volume = value;
  video.volume = value;
});

// handle totalTime
const handleLoadedMetadata = () => {
  totalTime.innerText = Math.floor(video.duration);
}
video.addEventListener("loadedmetadata", handleLoadedMetadata);

// handle currentTime
video.addEventListener("timeupdate", (event) => {
  currentTime.innerText = Math.floor(video.currentTime);
});

if (video.readyState == 4) {
  handleLoadedMetadata();
}