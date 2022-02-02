import express from "express";
const app = express(); // express application

const PORT = 4000;

// http request. app.lisen 하기 전에 설정해야 함
// 누군가 root page로 get request를 보낸 다면 콜백함수를 실행
app.get("/", () => { console.log("Somebody wants to go root page.")});

// Set a server
app.listen(PORT, () => { // create a server
  console.log(`Server listening on http://localhost:${PORT} 🚀`);
});