const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    body: {
      text,
    }
  });
});