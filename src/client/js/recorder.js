import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordBtn = document.getElementById("recordBtn");
const video = document.getElementById("preview");

let stream, recorder, videoFile;

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false, 
    video: { width: 200, height: 100, },
  });
  video.srcObject = stream;
  video.play();
};

const handleRecordStart = () => {
  recordBtn.innerText = "Stop Recording";
  recordBtn.removeEventListener("click", handleRecordStart);
  recordBtn.addEventListener("click", handleRecordStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data); 
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    preview.play();
  }
  recorder.start();
};

const handleRecordDownload = async () => {
  recordBtn.innerText = "Start Recording";
  recordBtn.removeEventListener("click", handleRecordDownload);
  recordBtn.addEventListener("click", handleRecordStart);

  const ffmpeg = createFFmpeg({
    corePath: "/static/ffmpeg-core.js",
    log: true
  });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const mp4Blop = new Blob([mp4File.buffer], { type: "video/mp4" });
  const mp4Url = URL.createObjectURL(mp4Blop);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click();

  init();
};

const handleRecordStop = () => {
  recordBtn.innerText = "Download Recording";
  recordBtn.removeEventListener("click", handleRecordStop);
  recordBtn.addEventListener("click", handleRecordDownload);

  recorder.stop();
};

init();

recordBtn.addEventListener("click", handleRecordStart);