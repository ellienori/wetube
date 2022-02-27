import User from "../models/User";
import Video from "../models/Video";
import fetch from "cross-fetch";
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
  const user = await User.findOne({username, socialOnly: false}); // 그래야 password 체크를 하지
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
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  }
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
}

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  }
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const data = await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    }
  });
  const json = await data.json();
  // res.send(JSON.stringify(json));
  
  // 위에꺼랑 다르게 아래는 json을 한 번에 가져오겠다.
  if ("access_token" in json) {
    const {access_token} = json;
    const apiUrl = "https://api.github.com";
    const userData = await (await fetch(`${apiUrl}/user`, { // user data
      headers: {
        Authorization: `token ${access_token}`,
      }
    })).json();
    const emailData = await (await fetch(`${apiUrl}/user/emails`, { // email data
      headers: {
        Authorization: `token ${access_token}`,
      }
    })).json();

    const emailObj = emailData.find(value => value.primary === true && value.verified === true);
    if (!emailObj) { // email이 없다면
      return res.redirect("/login");
    }

    let user = await User.findOne({email: emailObj.email});
    if (!user) {
      // create an account
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name? userData.name : userData.login, 
        username: userData.login, 
        email: emailObj.email, 
        password: "", 
        socialOnly: true,
        location: userData.location,
      });
    }
    // login
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
}

export const getEdit = (req, res) => res.render("users/edit-profile", { pageTitle: "Edit Profile" });

export const postEdit = async (req, res) => {
  const pageTitle = "Edit Profile";

  const {
    session: {
      user: {
        _id,
        avatarUrl,
        username: _username,
        email: _email,
      },
    },
    body: { name, email, username, location },
    file,
  } = req;

  // username and email should be unique.
  // email이나 username이 _username 랑 같으면 변화 없는 거야 
  // 다르면 unique check를 해야해
  if (email !== _email) {
    const exist = await User.exists({email});
    if (exist) {
      // 못바꾸게 해야해
      return res.status(400).render("users/edit-profile", { 
        pageTitle, 
        errorMessage: "This email is already taken."});
    }
  }
  if (username !== _username) {
    const exist = await User.exists({username});
    if (exist) {
      // 못바꾸게 해야해
      return res.status(400).render("users/edit-profile", { 
        pageTitle, 
        errorMessage: "This username is already taken."});
    }
  }

  const updatedUser = await User.findByIdAndUpdate(_id, {
    avatarUrl: file ? file.path : avatarUrl,
    name, 
    email, 
    username, 
    location,
  }, { new: true });

  req.session.user = updatedUser;

  return res.redirect("/users/edit");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  if(req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
}

export const postChangePassword = async (req, res) => {
  const pageTitle = "Change Password";
  const {
    session: {
      user: {
        _id,
      },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation, },
  } = req;
  
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res
      .status(400).render("users/change-password", { 
        pageTitle, 
        errorMessage: "Wrong Old Password.",
      });
  }

  if (newPassword !== newPasswordConfirmation) {
    return res
      .status(400).render("users/change-password", { 
        pageTitle, 
        errorMessage: "Password confirmation does not match.",
      });
  }

  // to hash new password
  user.password = newPassword;
  await user.save();
  req.session.user.password = user.password;

  return res.redirect("/users/logout"); // change password successed -> logout
}

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found."});
  }

  return res.render("users/profile", { pageTitle: user.name, user });
};