import multer from "multer";

// set locals
export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  console.log(res.locals);
  next();
}

// protect pages
export const protectorMiddleware = (req, res, next) => {
  // if user is not logged in, redirect to login page.
  // unless, let her keep requesting something.
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
}

// public only (if I am already logged in, but the website requires log in <- annoying)
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not authorized.");
    return res.redirect("/");
  }
}

// multer middleware
// 사용자가 업로드하는 모든 파일을 우리 서버의 destination에 저장한다.
export const uploadAvatarMiddleware = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  }
});

export const uploadVideoMiddleware = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  }
});