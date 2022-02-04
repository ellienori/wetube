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

// :${parameter}
videoRouter.get("/upload", upload);
// upload가 /:id보다 뒤에 있어버리면 express가 upload 라는 글자 자체를 id로 이해해버림!!!!
// (\\d+) 숫자만 가져온다는 의미
videoRouter.get("/:id(\\d+)", see);

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

## #5.7 Conditionals

pug reference: conditionals, iteration, mixins
