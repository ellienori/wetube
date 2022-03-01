const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsPid = null;
let controlsMovementPid = null;
let volume = 0.5;
video.volume = volume;

const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substring(14, 19);
};

// Controls Event
const hidingControls = () => videoControls.classList.remove("showing");

videoContainer.addEventListener("mousemove", () => {
  if (controlsPid) {
    clearTimeout(controlsPid);
    controlsPid = null;
  }
  if(controlsMovementPid) {
    clearTimeout(controlsMovementPid);
    controlsMovementPid = null;
  }
  videoControls.classList.add("showing");
  controlsMovementPid = setTimeout(hidingControls, 3000);
});

videoContainer.addEventListener("mouseleave", () => {
  controlsPid = setTimeout(hidingControls, 3000);
});

// handle play pause
const handleVideoPlayPause = () => {
  // if the video is playing, pause it
  if (video.paused) {
    video.play();
  } else {
    // else play the video
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

playBtn.addEventListener("click", handleVideoPlayPause);
video.addEventListener("click", handleVideoPlayPause);
document.addEventListener("keypress", (event) => {
  if (event.code === "Space") {
    handleVideoPlayPause();
  }
})

// handle mute
muteBtn.addEventListener("click", (event) => {
  if(video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
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
  muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";

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
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
});
videoContainer.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    fullScreenIcon.classList = "fas fa-expand";
  }
});

// handle currentTime
video.addEventListener("timeupdate", () => {
  const time = Math.floor(video.currentTime);
  if (time) {
    currentTime.innerText = formatTime(time);
  }
  timeline.value = time;
});

// handle totalTime
const handleLoadedMetadata = () => {
  const time = Math.floor(video.duration);
  if (time) {
    totalTime.innerText = formatTime(time);
  }
  timeline.max = time;
}
video.addEventListener("loadeddata", handleLoadedMetadata);

if (video.readyState == 4) {
  handleLoadedMetadata();
}