const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".deleteBtn");

const addComment = (text, id) => {
  // js로 html에 뭔가를 추가하면 돼
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "🅧";
  span2.addEventListener("click", handleDelete);

  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  
  if (response.status === 201) {
    textarea.value = "";
    const {newCommentId} = await response.json();
    addComment(text, newCommentId);
  }
});

const deleteComment = (li) => {
  li.remove();
}

const handleDelete = async (event) => {
  const li = event.target.parentElement;
  const commentId = li.dataset.id;
  console.log(commentId);
  
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
  
  if (response.status === 201) {
    deleteComment(li);
  }
  
}

for (let i = 0; i < deleteBtn.length; i++) {
  deleteBtn[i].addEventListener("click", handleDelete);
}