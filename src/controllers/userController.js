import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Create Account"});
}

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";

  if(password !== password2) {
    return res.status(400).render("join", { 
      pageTitle, 
      errorMessage: "Password confirmation does not match."});
  }

  // username and email should be unique.
  const exists = await User.exists({$or: [{username}, {email}]});
  if (exists) {
    return res.status(400).render("join", { 
      pageTitle, 
      errorMessage: "This username or email is already taken."});
  }

  try {
    await User.create({
      name, username, email, password, location,
    });
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.status(400).render("join", { 
      pageTitle, 
      errorMessage: error._message, });
  }
}

export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({username});
  if (!user) {
    return res.status(400).render("login", { 
        pageTitle,
        errorMessage: "An account with this username does not exist.",
      });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res
      .status(400).render("login", { 
        pageTitle, 
        errorMessage: "Wrong password.",
      });
  }

  // login
  req.session.loggedIn = true;
  req.session.user = user;

  res.redirect("/");
}

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

export const finishGithubLogin = (res, req) => {
  
}

export const edit = (req, res) => res.send("Edit User");
export const deleteUser = (req, res) => res.send("Delete User");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See User Profile");