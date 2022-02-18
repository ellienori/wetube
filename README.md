# This is a study notion.

# Set up

## package.json

### scripts

"win": "node index.js" 를 실행하기 위해서 npm run win 이라고 console에서 명령어 치면 됨
babel 설치 후 "dev" "babel-node index.js"로 수정함. babel로 실행시키기 위해서

```
$ vim package.json
"win": "node index.js"
"dev": "babel-node index.js"
```

### dependencies

dendencies 프로젝트를 실행하기 위한 것 (운전 시 가솔린 필요함, 운전 면허 필요함)
devDendencies 개발자에게 필요한 것 (운전 시 음악 필요함ㅋ)

## Express

```
$ npm i express
```

## Babel

### 이게 뭐야

NodeJS가 아직 이해하지 못하는 최신 JS 문법들을 전환해줌

### Installation

참고: https://babeljs.io/setup

```
$ npm i --save-dev @babel/core @babel/node
$ npm i @babel/preset-env --save-dev
```

devDependency를 위해 --save-dev로 설치하는 거임
만약 잘못 설치했으면 그냥 package.json에서 수정ㅇ하면 돼 그냥 text file 이잖아 ㅎ ㄱㅊㄱㅊ

preset? babel plugin 종류 되게 다양함

### Setting

```
$ vim babel.config.json
{
  "presets": ["@babel/preset-env"]
}

$ vim package.json
"dev": "babel-node index.js"
```

## Nodemon

파일이 수정되면 알아서 재시작을 해주는 얘야
우리가 매번 npm run dev 할 필요 없어

참고: https://www.npmjs.com/package/nodemon

```
$ npm install --save-dev nodemon
```

### Setting

```
$ vim package.json
"dev": "nodemon --exec babel-node index.js"
```

# #2 Introduction to express

## GET Request (http request)

Cannot GET /
Browser: get '/' page.
라는 뜻인데 root 페이지('/')를 지금 열 수 없다는 뜻

apt.get(routes, controller)

## Request / Response

browser가 website(server)로 request를 보내고 server는 그에 대한 response를 줘야지
response는 status code, html, .....

## Middleware

middle software between request and response

### morgan

설치해서 쓴 예시 중에 하나

```
npm i morgan
import morgan from "morgan";
app.use(morgan("dev"));
```

morgan을 쓰면 middleware가 더 정교하게 표현된다.
종류는 총 5개 combined, common, dev, short, tiny

```
(Before)
 // 모든 routes(url)에서 동작하는 middleware 설정 가능
 // 따라서 apt.get() 보다 위에 있어야 해(global) 그래야 적용됨
app.use((req, res) => { // logger
  console.log(`${req.method} ${req.url}`);
});

(After)
import morgan from "morgan";
app.use(morgan("dev"));
```

## Router

Router는 controller와 url 관리를 쉽게 해줌. 미니 어플리케이션

### Plan

- global router (accessible from home)
  / -> Home
  /join -> Join
  /login -> Login
  /search -> Search

- users router
  /users/:id -> See User
  /users/logout -> Log Out
  /users/edit -> Edit My Profile
  /users/delete -> Delete My Profile

- videos router
  /videos/:id -> See Video :video id
  /videos/:id/edit -> Edit Video
  /videos/:id/delete -> Delete Video
  /videos/upload -> Upload Video

### Source code

```
(구버전)
// http request. app.lisen 하기 전에 설정해야 함
// 누군가 root page로 get request를 보낸 다면 콜백함수를 실행
app.get("/", (req, res) => {
  // req: reqeust / res: response
  // brower가 request를 보내면 우리가 response를 보내야지
  // request와 reponse 사이에 middleware(==handler==controller)가 있다 (middle software)
  return res.end("Hello.");
});
app.get("/login", (req, res) => {
  return res.end("Login here.");
});
```

### Parameter (#4.7~4.8)

```
// :${parameter}
videoRouter.get("/upload", upload);
// upload가 /:id보다 뒤에 있어버리면 express가 upload 라는 글자 자체를 id로 이해해버림!!!!
// (\\d+) 숫자만 가져온다는 의미
videoRouter.get("/:id(\\d+)", see);
```

# #5 TEMPLATE

## #5.0 ~ #5.1 PUG

PUG: Html template helper
우리의 express view engine으로 설정할거야
우리가 pug file을 보내면 pug가 pug 파일을 평범한 html로 변환해서 사용자에게 제공함

### Step 1. install

```
$ npm i pug
```

### Step 2. set view engine (server.js)

```
app.set("view engine", "pug");
app.set("views", process.cwd()+"/src/views");
```

서버의 cwd (curren working directory) 수정하기

-> 왜냐면 pug가 wetube/src/views/_.pug에 있는데
자동으로 wetube/views/_.pug를 찾고있기 때문

-> package.json이 실행되는 곳
server.js에서 process.cwd() 찍어보면 정확하게 알 수 있음
근데 package.json 어디있는 지 알잖아. wetube/package.json

### Step 3. create a pug file

```
vi src/views/home.pub

# pug에서 js 쓸 때는 #{} 안에 넣으면 된다.
footer &copy; #{new Date().getFullYear()} Wetube
```

### Step 4. pug와 controller 연결 (controller.js)

```
res.render("home")
```

## #5.2~#5.4 pug partial, variables

### include

partials 디렉토리에 pug 생성 후 include

```
include partials/footer.pug
```

### inheritance

위에꺼도 귀찮아 겹치는 게 너무 많은데..
base.pug를 만들고 extends 하기

#### Step 1. 써먹을 base.pug 만들기

```
block content
```

#### Step 2. 필요한 곳에서 상속 받기

```
extends base.pug

block content
  h1 Home!
```

### Variables

계속 비슷한 template이면 변수만 넘겨서 설정하자

```
# base.pug 에 이렇게 설정
head
  title #{pageTitle} | Wetube

# 다른 string이랑 같이 쓰는 거 아니면 아래처럼도 설정 가능
head
  title=pageTitle

# 다른데서 가져다 쓸 때는 컨트롤러에서 변수를 보내줘야지
res.render("home", { pageTitle: "Home ☀"}
```

## #5.9 Mixins (pug references)

반복되는 partial 같은 애야. smart partial
mixins 디렉토리를 만들고 그 안에 video.pug 파일을 생성
info라는 정보를 받아와서 어떻게 출력하겠다 라는 의미

```
mixin video(info)
  div
    h4=info.title
    ul
      li #{info.rating}/5
      li #{info.comments} comments.
      li Posted #{info.createdAt}.
      li #{info.views} views.
```

그리고 나서 위의 파일을 include해서 view 파일에서 써야지 (home.pug)
include도 해야하고 + 표시해서 써야함

```
extends base.pug
include mixins/video

block content
  h1 Welcome here you will see the trending videos 🎬
  each video in videos
    +video(video)
  else
    li Sorry, nothing found ❌
```

# #6 DATABASE

## #6.0~#6.1 Array DB

### ES6 문법

아래 두 개는 같은 의미

```
const { id } = req.params;
const id = req.params.id;
```

### ternary operation

```(watch.pug)
#{video.views === 1 ? "view" : "views"}
```

## #6.2~6.3 Edit

### POST, GET 이해하기

#### GET

구글이나 네이버에 검색할 때 다음에 'search?검색어' 이런 식으로 url에 넘어가잖아
그럴 때 GET을 쓰는 거임
그리고 얘는 default라 따로 method 설정 안해주면 get으로 되어 있음

wetube에서는 비디오 검색할 때 사용

#### POST

파일을 보내거나 DB에 있는 값을 바꾸는(수정/삭제) 뭔가를 보낼 때 사용
로그인 할 때도 사용

```(edit.pug)
form(method="POST")
```

하지만 저렇게 선언한다고 해서 우리 서버가 이해하고 있는 거 아니니까
router에도 알려줘야해

```(videoRouter.js)
videoRouter.get("/:id(\\d+)/edit", getEdit);
videoRouter.post("/:id(\\d+)/edit", postEdit);
```

근데 위에서 처럼 두 줄로 쓰지말고 아래처럼 하나로

```
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
```

##### express가 form을 이해하게 하려면

```(server.js)
app.use(express.urlencoded({extended: true}));
```

router 연결되기 전에 적어야함
저래야 form의 value를 이해할 수 있음
form을 javascript가 이해할 수 있도록 변환해주는 middleware임

```(videoController.js의 postEdit 함수)
console.log(req.body);
```

그럼 이제 form에 적은 내용이 넘어옴
form의 name이 title이기 때문에 콘솔창에 데이터가

```
{ title: 'New Video' }
```

라고 넘어옴

## #6.4 Recap

### videoController postEdit 이해하기
```
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id-1].title = title;
  return res.redirect(`/videos/${id}`);
};
```
- req.params는 router의 "/:id(\\d+)" 를 의미함
- req.body는 form(edit.pug)에 있는 value의 javascript representation이다.
req.body에서 데이터보려면 edit.pug에서 input에 꼭 name 넣어줘야해

## #6.7 MongoDB

### 설명
- document-based 임 => objects(json like documents)
- 만약 sql-based 였다면 rdb였겠지 엑셀처럼 column/rows (not flexible)

### 설치
https://docs.mongodb.com/manual/installation

MongoDB 설치 (MacOS용)
1. xcode-select --install
2. brew tap mongodb/brew
3. brew install mongodb-community@5.0
(버전은 추후에 달라질 수 있습니다.)

MongoDB Compass (MongoDB GUI)
https://www.mongodb.com/products/compass


### 설치 확인
terminal 열어서
```
$ mongod
$ mongo
```

문제 발생했을 경우
```
MongoDB shell version v5.0.0
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Error: couldn't connect to server 127.0.0.1:27017, connection attempt failed: SocketException: Error connecting to 127.0.0.1:27017 :: caused by :: Connection refused :
connect@src/mongo/shell/mongo.js:372:17
@(connect):2:6
exception: connect failed
exiting with code 1
-----------------------------------
이렇게 뜨면
인텔맥: mongod --config /usr/local/etc/mongod.conf --fork
M1: mongod --config /opt/homebrew/etc/mongod.conf --fork
```

## #6.8 Mongoose

nodejs랑 mongoDB 연결하게 도와주는 애

### 설치
npm i mongoose

### setting
- db.js 생성
- $ mongo 명령어 후 url 가져오기: mongodb://127.0.0.1:27017/
- db.js에 mongoose랑 mongoDB 연결하기
```
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube"); // url 뒤에 database 이름
```
- 서버(server.js)에서 연결
```
import "./db";
```

- db 연결 ~ on과 once 차이
```
const db = mongoose.connection;
db.on("error", (error) => console.log("DB Error", error)); // many times
db.once("open", () => console.log("Connected to DB ✅")); // only one time
```

## #6.8~ CRUD
Create
Read
Update
Delete

Video model을 만들거야 (mkdir models > vi Video.js)
mongoose에게 데이터가 어떻게 생겼는지 가르쳐줘야해

### 스키마
```
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }], // array
  meta: {
    views: Number,
    rating: Number,
  },
});
```
데이터 형태가 어떻게 생겼는지 설정한다.

#### 모델 생성
위에서 생성한 스키마를 기반으로 모델을 생성한다.
```
const movieModel = mongoose.model("Video", videoSchema); // model 이름을 Video로 함
export default movieModel; // export
```

그리고 서버(server.js)에 import 해줘야 함
```
import "./models/Video";
```