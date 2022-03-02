const recordBtn = document.getElementById("recordBtn");
const preview = document.getElementById("preview");

let stream, recorder;

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false, 
    video: { width: 200, height: 100, },
  });
  preview.srcObject = stream;
  preview.play();
};

const handleRecordStart = () => {
  recordBtn.innerText = "Stop Recording";
  recordBtn.removeEventListener("click", handleRecordStart);
  recordBtn.addEventListener("click", handleRecordStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    const video = URL.createObjectURL(event.data); 
    preview.srcObject = null;
    preview.src = video;
    preview.loop = true;
    preview.play();
  }
  recorder.start();
};

const handleRecordDownload = () => {

};

const handleRecordStop = () => {
  recordBtn.innerText = "Download Recording";
  recordBtn.removeEventListener("click", handleRecordStop);
  recordBtn.addEventListener("click", handleRecordDownload);

  recorder.stop();
};

init();

recordBtn.addEventListener("click", handleRecordStart);