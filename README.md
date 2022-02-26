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

## #6.11~ Query

### server.js와 init.js 분리
server.js는 express 관련된 것과 server의 configuration에 관련된 내용만 다루고
init.js는 DB나 model등을 import하는 내용을 담음
``` // init.js
import "./db";
import "./models/Video";
import app from "./server";

const PORT = 4000;

// Set a server
app.listen(PORT, () => { // create a server
  console.log(`Server listening on http://localhost:${PORT} 🚀`);
});
```
nodemon 설정을 위해 server.js를 실행시키는 부분을 init.js로 바꾸기

### Model 사용
이제 controller에서 fake data(array) 다 지우고
../models/Video를 import 한 다음 사용하면 된다. 

#### Model.find()
Model.find()은 callback 함수로 쓸 수도 있고 promise로 쓸 수 있는데 우선 cb로 이해하자.
우선 모든 비디오 데이터를 가지고 오는 것이 목표

mongoose는 Video.find({}, // 여기에서 이미 db를 가지고 올거고
그 db가 바응하면 뒤의 function을 실행시킬 거야.
```
Video.find({}, (err, videos) => {
    
  });
```
앞의 {}은 search terms를 의미하는데 얘가 비어있으면 모든 형식을 찾는다는 것을 의미

#### callback이랑 promise 비교
``` // callback
export const home = (req, res) => {
  Video.find({}, (err, videos) => {
    return res.render("home", { pageTitle: "Home ☀", videos });
  });
};
```

``` // promise
export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home ☀", videos });
};
```

## #6.16
video.save(); 에서 save는 promise를 리턴하기 때문에 save 작업이 끝날 때까지 기다려야 함

### DB 확인하기 (MongoDB에서)
```
> show dbs;
admin   0.000GB
config  0.000GB
local   0.000GB
wetube  0.000GB
> use wetube
switched to db wetube
> show collections
videos
> help
	db.help()                    help on db methods
	db.mycoll.help()             help on collection methods
	sh.help()                    sharding helpers
	rs.help()                    replica set helpers
	help admin                   administrative help
	help connect                 connecting to a db help
	help keys                    key shortcuts
	help misc                    misc things to know
	help mr                      mapreduce

	show dbs                     show database names
	show collections             show collections in current database
	show users                   show users in current database
	show profile                 show most recent system.profile entries with time >= 1ms
	show logs                    show the accessible logger names
	show log [name]              prints out the last segment of log in memory, 'global' is default
	use <db_name>                set current database
	db.mycoll.find()             list objects in collection mycoll
	db.mycoll.find( { a : 1 } )  list objects in mycoll where a == 1
	it                           result of the last line evaluated; use to further iterate
	DBQuery.shellBatchSize = x   set default number of items to display on shell
	exit                         quit the mongo shell
> db.videos.find()
{ "_id" : ObjectId("6210c47fa5610cae69ba8571"), "title" : "First trial", "description" : "This is a first video.", "createdAt" : ISODate("2022-02-19T10:20:47.154Z"), "hashtags" : [ "#first", "#video", "#nice" ], "meta" : { "views" : 0, "rating" : 0 }, "__v" : 0 }
```

### DB 저장하기 save -> create
기존 방법
```
const video = new Video({
  title,
  description,
  createdAt: Date.now(),
  meta: {
    views: 0,
    rating: 0,
  },
  hashtags: hashtags.split(",")
    .map((word) => word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`),
});

await video.save();
```

새 방법
```
await Video.create({
  title,
  description,
  createdAt: Date.now(),
  meta: {
    views: 0,
    rating: 0,
  },
  hashtags: hashtags.split(",")
    .map((word) => word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`),
});
```

## #6.17

### Model에서 값 required로 하기
기존
```
createdAt: Date,
```
새 방법
```
createdAt: { type: Date, required: true },
```

### Model에서 default 정하기
```
createdAt: { type: Date, required: true, default: Date.now },
```
Date.now()로 하면 즉시 실행되는 것 주의

## #6.19 Video detail

### 정규식
정규식 연습할 수 있는 사이트 https://regex101.com/
정규식에 대한 MDN의 공식 문서 https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_Expressions

기존에 라우터에서 id가 숫자라 생각해서 숫자로 정규식표현 해놨는데 
```
videoRouter.get("/:id(\\d+)", watch);
```
이제 mongoDB에서 생성해주는 string id 값이니까 수정해줘야함

mongoDB에서 생성하는 id는 16진수 24글자 string
[0-9a-f]{24}
```
videoRouter.get("/:id([0-9a-f]{24})", watch);
```

## #6.20~ Edit Video

### postEdit
기존
```
video.title = title;
video.description = description;
video.hashtags = hashtags.split(",")
.map((word) => word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`);
await video.save();
```
New
```
await Video.findByIdAndUpdate(id, {
  title,
  description,
  hashtags: hashtags
    .split(",")
    .map((word) => word.startsWith("#") ? word : `#${word}`),
});
```

### id로 데이터 오브젝트 찾을 때
지금 우리 코드는 매번 오브젝트 전체를 불러오는데 
```
const video = await Video.findById(id);
```
이럴 필요 없이 존재 유무만 먼저 판단하는 것이 더 좋다.
Model.exists()는 인자로 filter를 받기 때문에 조건을 넣어줌
결과는 true of false
(참고) postEdit에선ㄴ 이렇게 쓰지만 getEdit에서는 object를 직접 가져와야 함
```
const video = await Video.exists({_id: id});
```

## #6.23 Mongoose middlewares
Model에서 설정할거니까 Video.js에서 확인할 것

middleware는 model이 생성되기 전에 설정되어야 함
middleware 안에 넘기는 함수에서 this는 document를 의미함
즉 내가 새 비디오를 업로드하면 새 비디오 데이터가 this에 들어가있음
pre.('save') 즉 save 전(previous)에 동작하는 미들웨어라는 뜻
```
videoSchema.pre('save', async function() {
  // this refers to the document
});

const movieModel = mongoose.model("Video", videoSchema);
```
근데 얘는 upload에서는 먹히는데 edit에서 안먹혀
왜냐면 findoneandupdate에서는 this로 document에 접근할 수 없기 때문이야

## #6.24 statics

### hashtags를 함수로 처리하는 방법
```
// Model
export const formatHashtags = (hashtags) => hashtags.split(",")
.map((word) => word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`);

// Controller
import Video, { formatHashtags } from "../models/Video";

await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: formatHashtags(hashtags),
  });
```

### Statics로 처리하는 방법
static은 Model에서 쓸 수 있는 함수를 생성해주는 거야
그래서 schema.static(함수 이름, 함수) 형태로 되어 있음
사용은 Video.formatHashtags(hashtags)
```
videoSchema.static('formatHashtags', function(hashtags) {
  return hashtags
          .split(",")
          .map((word) => word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`);
});
```

## #6.25 Delete video

### Step 1. Watch page에 delete 버튼 추가
```
a(href=`${video.id}/delete`) Delete Video &rarr;
```

### Step 2. Router와 Controller에 Delete 함수 추가
```
// Router
// 그런데  Router에서 deleteVideo 쓰려면 controller에 미리 생성되어 있어야 함
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);

// Controller
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
}
```

#### 그런데 findByIdAndDelete와 Remove의 차이점이 뭐야?
별로 차이 없는데 remove는 롤백이 안되서 다시 되돌릴 수 없기 때문에 delete 사용을 권장함

## #6.26~ search

### home에서 출력되는 이미지 sort
```
const videos = await Video.find({}).sort({createdAt: -1});
```

### search page
search page를 만든다면 어디에 설정해야할까? -> global router

#### 1. setting
global router에 search 추가, video controller에 search 생성
search 뷰 추가 - 그 전에 base.pug에 search로 가는 메뉴도 추가

#### 2. regex
정확하게 keyword랑 title이 일치해야 나옴
```
videos = await Video.find({
  title: keyword,
});
```
따라서 regex 쓰기
```
videos = await Video.find({
  title: {
    $regex: new RegExp(keyword, "i"),
  },
});
```
"i"는 대소문자를 구분하지 않음을 의미 (모두 검색)

만약에 keyword로 시작하는 애를 찾고 싶으면
new RegExp(`^${keyword}`, "i")

keyword로 끝나는 애를 찾고 싶으면
new RegExp(`${keyword}$`, "i")

# #7 User Authentication

## #7.0~ Create account

### Setting
models/User.js 생성
init에서 import User

rootRouter에 join 관련 route 추가
userController에 join 관련 컨트롤러 추가 (postJoin, getJoin)
join.pug view 생성

### password hashing
해싱은 한방향이라서 1212 -> sdfdf가 된다고 해서 sdfdf -> 1212가 되는 거 아님
같은 input으로는 항상 같은 output이 나옴 == deterministic function 결정 함수

```
npm i bcrypt
```

rainbow table 공격을 막기 위해 salt를 함께 넣을 거야
```
// User.js
import bcrypt from "bycrpt";

userSchema.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 5);
});
```
middleware로 저장하기 전에 password를 hashing하기
bcrypt.hasy(데이터, 횟수, 콜백함수) 하지만 우린 async await라 콜백함수 X

## #7.3 Form validation
### Unique 값 처리하기
기존
```
// username and email should be unique.
const usernameExists = await User.exists({username});
if (usernameExists) {
  return res.render("join", { pageTitle: "Join", errorMessage: "This username is already taken."});
}
const emailExists = await User.exists({email});
if (emailExists) {
  return res.render("join", { pageTitle: "Join", errorMessage: "This email is already taken."});
}
```

after
```
// username and email should be unique.
const exists = await User.exists({$or: [{username}, {email}]});
if (exists) {
  return res.render("join", { pageTitle: "Join", errorMessage: "This username or email is already taken."});
}
```

## #7.4 Status codes
우리가 잘못된 username/password를 입력해서 join이 실패해도 
```
POST /join 200 50.066 ms - 910
```
status code 200을 보내서 브라우저는 가입이 성공한 줄 알고 username/password를 저장할 거냐고 묻는다.
그래서 우리는 가입이 성공했을 때만 200을 보내기로 할거야.
Bad request 400
```
return res.status(400).render("join", { pageTitle: "Join", errorMessage: "This username or email is already taken."});
```

## #7.5~ Login
사용자가 입력한 password와 db에 hashed password가 같은지 비교하기
```
const ok = await bcrypt.compare(password, user.password);
if (!ok) {
  return res
    .status(400).render("login", { 
      pageTitle, 
      errorMessage: "Wrong password.",
    });
}
```

## #7.7~ Sessions and Cookies

### 쿠키?
유저를 기억하는 방법 중 한 가지는 유저에게 쿠키를 보내주는 것
쿠키를 이해하기 위해서는 세션에 대해 알아야 해
쿠키? 단지 정보를 주고받는 방법

### 세션?
session id는 쿠키에 저장된다. session은 쿠키에 저장되지 X
session data는 server side에 저장된다. -> db에 따로 저장해야함 (뒤에서)

백엔드와 브라우저 사이에 어떤 활동을 했는지를 기억하는 것
백엔드와 브라우저 사이의 memory, history
이게 작동하려면 백엔드와 브라우저가 서로에 대한 정보를 갖고있어야 함

로그인 페이지에서 http 요청을 하면 요청이 처리 되고 끝남
그 이후로는 백엔드가 아무 것도 할 수 없어

내가 home을 누르면 get 요청(request)를 보냄
백엔드가 html을 render하고 나면 연결이 끝남
연결이 계속 유지되지 않음. state가 없음

그래서 유저가 로그인 할 때마다 누군지 알 수 있도록 텍스트 같은 걸 줄 거야

### express-session
- 설치
```
npm i express-session
```

- 설정
```
import session from "express-session";
// router 앞에 초기화 해주기
app.use(session({
  secret: "Hello!",
  resave: true,
  saveUninitialized: true,
}));
```
이제 session이 사이트로 들어오는 모두를 기억하게 될거야

## #7.9~ Logged In User

### login
사용자가 로그인을 하면 loggedIn이 true가 되고 user 값이 session에 저장 돼
```
// login
req.session.loggedIn = true;
req.session.user = user;
```

### template <-> Controller 데이터 공유 ==> template(pug)에서 login 확인 하기
res.locals를 사용하면 돼
locals object는 이미 모든 pug template에 import된 object다.
```
// server (router)
app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
  });
})

// template
${sexy} 라고만 쓰면 you가 나옴
```

그런데 위처럼 쓸 수는 없으니 src/middlewares.js를 생성하고
그 안에 export로 middleware를 만든 다음에 server에서 아래처럼 추가
```
// [session middleware]
app.use(localsMiddleware);
// [other things...]
```
꼭 local middleware는 session middleware 다음에 와야 한다.

```
if loggedIn
  li
    a(href="/logout") Log Out
else
  li
    a(href="/join") Join
  li
    a(href="/login") Login
```

## #7.12 MongoStore (connect-mongo)
### why mongodb?
Session id is saved in the cookie.
Session data is stored in the server-side, but only memory store,
so we need to store session data in MongoDB.

### Installation & Settings
```
npm i connect-mongo
```

설치 후 server.js에서 MongoStore로 import 한 다음에
session 미들웨어에서 store 설정을 바꾼다.
```
app.use(session({
  secret: "Hello!",
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({mongoUrl: "mongodb://127.0.0.1:27017/wetube"}),
}));
```

## #7.13 Uninitialized Sessions
```
app.use(session({
  secret: "Hello!",
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({mongoUrl: "mongodb://127.0.0.1:27017/wetube"}),
}));
```
여기서 의미하는 resave와 saveUninitialized => 모두 false로 변경

join하지 않고 구경하는 모든 사람의 세션을 다 DB에 저장? 좋은 생각 아님
로그인 한 사용자의 session만 DB에 저장하도록 하자

### saveUninitialized
우리가 세션을 이니셜라이즈 할 때는 로그인 할 때 뿐임
```
// login
req.session.loggedIn = true;
req.session.user = user;
```

세션을 수정할 때만 DB에 저장하고 쿠키를 넘겨준다.
backend가 로그인한 사용자에게만 쿠키를 주도록 설정한다. (익명에게는 쿠키 안줌)

backend가 DB에 저장하는 게 session 인증의 문제점 중 하나
해결책: token authentication (cookie 없을 때는 token을 사용)

## #7.14 Expiration and secrets
### Secret
- 어디에 있어? server.js에서 session 등록할 때 첫 번째 값
- 이게 뭐야?
우리가 쿠키에 sign 할 때 사용하는 string (혹은 array)
sign 하는 이유? 우리 backend가 쿠키를 줬다는 걸 보여주기 위해서
(session hijack 방지: 누가 내 세션 훔쳐서 나인척 할 수 있어)

### Domain
- web browser에서 Application > Cookies 보면 Value 옆에 Domain이 있음
이 쿠키를 만든 backend가 누구인지 알려줘. 우리꺼에서는 값이 localhost
- 브라우저는 도메인에 따라 쿠키를 저장하도록 되어 있다

### Expires
우리꺼에 Session 이라고 되어있는데 이 쿠키는 만료 날짜가 명시되어 있지 않음을 의미
사용자가 shut down 혹은 컴퓨터 재시작하면 하면 쿠키가 사라진다.

### Max-Age
말 그대로 언제 세션이 만료되는지 알려줌
```
> db.sessions.find()
{ "_id" : "cs1cbSTdSe96lJjIMJUW7uh4h97eVZpz", "expires" : ISODate("2022-03-07T10:11:25.830Z"), "session" : "{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"loggedIn\":true,\"user\":{\"_id\":\"62130418a9182cfa618579f0\",\"email\":\"ellie@test.com\",\"username\":\"ellie\",\"password\":\"$2b$05$HFecuZEf30jaCyP0Uc59t.sr2Lg.3QCD1pVA7Ji2SDbJJmFHeCUbK\",\"name\":\"Ellie\",\"location\":\"Seoul\",\"__v\":0}}" }
```
보면 expires 값이 있어
이 브라우저가 평생 켜져있거나 사용자가 브라우저를 평생 켜놔도 backend가 3/7 이라고 날짜 박아놈
```
app.use(session({
  secret: "Hello!",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 20000,
  },
  store: MongoStore.create({mongoUrl: "mongodb://127.0.0.1:27017/wetube"}),
}));
```
cookie는 밀리세컨드 단위라서 20초 후로 설정함

### 어쨌든 우리는
session에서 secret이랑 mongoDB url을 이렇게 string으로 넣어서는 안된다.
그래서 .env를 생성하고 .gitignore에도 추가한다 (공개되지 않도록)

#### .env

##### Installation & Setting
```
npm i dotenv
```

모든 파일의 상단에
```
require("dotenv").config();
```
라고 적거나 
init.js에 import 하기
```
import "dotenv/config";
```

##### .env 파일 내용
관습적으로 모두 대문자로 적음
사용은 process.env.COOKIE_SECRET 이렇게

## #7.16~ github login
### flow
> 참고: https://docs.github.com/en/developers/apps/building-oauth-apps

1. 사용자를 깃헙으로 보내 (redirect to github) -> https://github.com/login/oauth/authorize
  해당 내용을 login.pug에 추가함, client_id는 아래 OAuth 생성하기 참고
  ```
  a(href="https://github.com/login/oauth/authorize?client_id=5584aeba81be37dea8a4") Continue with Github &rarr;
  ```

  그런데 위에 처럼해서 진행하면 public data만 받아오게 됨. 우리는 사용자 email 등의 더 많은 데이터를 원해
  scope을 사용할거야. 자세한 내용은 아래 scope 참고

2. 그럼 사용자는 깃헙에 이메일과 비밀번호를 넣고 우리에게 정보를 공유하는 것을 승인할거야 (Authorize)
3. 그럼 깃헙은 사용자를 우리 사이트로 돌려보냄 + token과 함께 redirect

### step 1
#### OAuth 생성하기
github.com/settings/apps > OAuth Apps > Create

Application name: Wetube
Homepage URL: http://localhost:4000/
Application description: Wetube Reloaded
Authorization callback URL: http://localhost:4000/users/github/finish

URL에 해당 내용은 우리가 저렇게 정한 거임

#### scope
scope에는 우리가 사용자에 대해 어디까지 알 수 있는지 적으면 된다.
유저에게서 얼마나 많은 정보를 읽어내고 어떤 정보를 가져올 것에 대한 것

참고로 카톡에서는 permission 이라고 표현한다.

여러 개의 scope를 입력할 때는 띄어쓰기로 하면 된다.

allow_signup: user가 github에 계정이 없다면 생성할 수 있게 할래? 아니면 계정이 이미 있는 사람들만 로그인하게 할래? (default: true)

https://github.com/login/oauth/authorize?client_id=5584aeba81be37dea8a4&allow_signup=false&scope=user:email
url이 너무 길어서 아래처럼 임의로 정함 (login.pub)
```
a(href="/users/github/start") Continue with Github &rarr;
```
그리고 router와 controller에 startGithubLogin 생성
controller에서 URLSearchParams 사용

config 오브젝트 생성할 때 key값을 url에 있는 거 그대로 사용해야 함
```
export const startGithubLogin = (req, res) => {
  // https://github.com/login/oauth/authorize?client_id=5584aeba81be37dea8a4&allow_signup=false&scope=user:email
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: "5584aeba81be37dea8a4",
    allow_signup: false,
    scope: "read:user user:email",
  }
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
}
```

### step 2
#### authorize
사용자가 login > github login > 후 authorize 누르면 /users/github/finish 로 redirect 된다.
그리고 뒤에 ?code=어쩌고 도 함께 보내줌

#### access_token
github에서 받은 code를 access 토큰으로 바꿔줘야 해
> POST https://github.com/login/oauth/access_token

필요한 것 (required)
code: url에 있음
client_id: oauth 생성할 때 받음 -> .env에 넣을 거야
client_secret: 말 그대로 비밀임. 오로지 backend에만 존재해야 함. github에서 generate 할 수 있고 .env에 넣음

finishGithubLogin 함수 생성
여기서 redirect 안하고 post로 url을 보낼거야

#### fetch
fetch 뭔가를 하고 싶거나 뭔가를 가져오고 싶을 때 쓴다.
POST: 우리가 url에 뭔가를 보내고 있다!

##### fetch 할 때 넣는 {} 의 의미

HTTP headers는 는 클라이언트와 서버가 request(or response)로 부가적인 정보를 전송할 수 있도록 해줍니다

Accept
돌려줄 데이터 타입에 대해 서버에게 알려주는 역할을 합니다
MIME 타입입니다
(📌MIME type이란 웹에서 사용되는 확장자라고 생각하시면 되며
type/subtype으로 구성되어 있습니다)

Authorization
보호된 리소스에 대한 접근을 허용하여 서버로 User agent를 인증하는 자격증명을 보내는 역할을 합니다

##### fetch 설치 및 사용
nodejs에서 fetch를 사용하려면 우선 설치부터 해야함
```
npm install node-fetch@2.6.1
```
그리고 아래처럼 추가해야 함
```
import fetch from "node-fetch";
```

```
const data = await fetch(finalUrl, {
  method: "POST",
  headers: {
    Accept: "application/json",
  }
});
const json = await data.json();
res.send(JSON.stringify(json));
```
await로 하나씩 값을 기다려서 가져오고 마지막에 res.send를 쓰면 json을 그냥 화면에 뿌려준다.
값 확인하기 좋음

### step 3
> Authorization: token OAUTH-TOKEN
> GET https://api.github.com/user

#### json 가져오기
```
// 위에꺼랑 다르게 아래는 json을 한 번에 가져오겠다.
const {access_token} = json;
const userRequest = await (await fetch("https://api.github.com/user", {
  headers: {
    Authorization: `token ${access_token}`,
  }
})).json();
console.log(userRequest);
```

#### access_token의 역할
우리가 scope에 적은 내용
> scope: "read:user user:email",
에 해당되는 데이터를 가져오는 역할만 할 수 있다.

#### json 출력값
```
email: null,
```
해당 데이터가 정말 없거나 private 하다는 것을 의미
그런데 우리가 scope에 값을 2개를 넣었는데 지금 read:user만 가져와서 이런 거야

#### email 가져오기
> 참고: https://docs.github.com/en/rest/reference/users#list-email-addresses-for-the-authenticated-user
> GET /user/emails
우리가 위에서 사용한 access_token을 가지고 이번에는 email 값을 가져오자
```
const emailData = await (await fetch(`${apiUrl}/user/emails`, { // email data
  headers: {
    Authorization: `token ${access_token}`,
  }
})).json();
```

출력값
```
[
  {
    email: 'polystudio7@gmail.com',
    primary: true,
    verified: true,
    visibility: 'private'
  },
  {
    email: '84376046+polystudio@users.noreply.github.com',
    primary: false,
    verified: true,
    visibility: null
  }
]
```
이제 여기서 verifed, primary 값을 찾아야 해
```
const email = emailData.find(value => value.primary === true && value.verified === true).email;
```

### Login Rules
github에서 주는 primary/verifed email이 이미 등록된 email 일 때 -> 로그인 시켜주자
                                                        -> 없으면 계정 생성하라고 하자 (우리 이미 user 정보 있어서 만들면 돼)

github으로 로그인했는지 여부 파악을 위해 User model에 변수 추가
```
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  socialOnly: { type: Boolean, deafult: false }, // github으로 로그인했는지 아닌지
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String },
});
```

만약 일반 로그인을 하는 사람이라면 password를 체크해야하니까
postLogin에 아래처럼 추가
```
const user = await User.findOne({username, socialOnly: false}); // 그래야 password 체크를 하지
```

## #7.22 Logout
```
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
```
base.pug에서 logout url을 /users/logout 으로 변경

# #8 User Profile
## #8.0 Edit Profile GET

### Setting 하는 법
> 1. userController.js에 postEdit과 getEdit 생성 후 userRouter.js에 route 등록을 한다.
> 2. base.pug에서 Template을 수정한다.
> 3. edit-profile.pug 생성 (models/User.js와 middlewares.js 참고)

## #8.1 Protector and Public middlewares
### 로그인을 하지 않은 사용자가 edit-profile에 접근한다면?
```
res.locals.loggedInUser = req.session.user || {};
```
undefined 일 경우 빈 오브젝트를 넣도록 middlewares에서 설정

### 로그인하지 않은 사람들이 우리가 보호하려는 페이지에 접근하는 걸 막자
```
// protect pages
export const protectorMiddleware = (req, res, next) => {
  // if user is not logged in, redirect to login page.
  // unless, let her keep requesting something.
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
}

// public only (if I am already logged in, but the website requires log in <- annoying)
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/");
  }
}
```
middleware에 두 개의 함수 추가.
- protectorMiddleware: 사용자가 로그인하지 않았다면 로그인 페이지로 안내한다.
- publicOnlyMiddleware: 사용자가 로그인했으면 로그인을 요구하지 않고 홈으로 이동시킨다.

#### router에 적용하기
```
userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
```
get과 post, delete 등에 적용하고 싶으면 .all()을 사용하면 된다.
userRouter 외에도 다른 router에 적용할 것

