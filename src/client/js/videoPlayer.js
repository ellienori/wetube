const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");

let volume = 0.5;
video.volume = volume;

const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substring(14, 19);
};

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

// handle timeline
timeline.addEventListener("input", (event) => {
  const {
    target: {
      value,
    }
  } = event;
  video.currentTime = value;
});

// handle fullscreen button
fullScreenBtn.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    fullScreen.innerText = "Enter Full Screen";
  } else {
    videoContainer.requestFullscreen();
    fullScreen.innerText = "Exit Full Screen";
  }
});
videoContainer.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    fullScreen.innerText = "Enter Full Screen";
  }
});

// handle currentTime
video.addEventListener("timeupdate", () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
});

// handle totalTime
const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
}
video.addEventListener("loadedmetadata", handleLoadedMetadata);

if (video.readyState == 4) {
  handleLoadedMetadata();
}