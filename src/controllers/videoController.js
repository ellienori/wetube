import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment"

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({createdAt: -1}).populate("owner");
    return res.render("home", { pageTitle: "Home ☀", videos });
  } catch {
    console.log("error");
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found." })
  }
  console.log(video);
  return res.render("videos/watch", { pageTitle: `🎬 ${video.title}`, video });
};

export const getEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id }
    }
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." })
  }

  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized.");
    return res.status(403).redirect("/"); // 403: Forbidden
  }
  return res.render("videos/edit", { pageTitle: `✂ ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id }
    },
    body: {
      title, description, hashtags,
    }
  } = req;
  const video = await Video.exists({_id: id});
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." })
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized.");
    return res.status(403).redirect("/"); // 403: Forbidden
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Change saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload video 🎬"});
};

export const postUpload = async (req, res) => {
  // here we will add a video to the videos array.
  const {
    body: {
      title, description, hashtags,
    },
    files: {
      video, thumb,
    },
    session: {
      user: {
        _id,
      }
    }
  } = req;

  try {
    const createdVideo = await Video.create({
      title,
      description,
      thumbUrl: thumb[0].path,
      videoUrl: video[0].path,
      meta: {
        views: 0,
        rating: 0,
      },
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(createdVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("videos/upload", { pageTitle: "Upload video 🎬", errorMessage: error._message, });
  }
}

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id }
    }
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." })
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized.");
    return res.status(403).redirect("/"); // 403: Forbidden
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
}

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if(keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  res.render("search", { pageTitle: "Search 🔍", videos});
}

export const registerView = async (req, res) => {
  // get video using id
  const { id } = req.params;
  const video = await Video.findById(id);
  if(!video) {
    return res.sendStatus(404);
  } 
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200); // OK
};

export const createComment = async (req, res) => {
  const {
    params: {id},
    body: {text},
    session: {user : {_id}},
  } = req;
  
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const user = await User.findById(_id);

  const comment = await Comment.create({
    text,
    owner: _id,
    video: id,
  });

  video.comments.push(comment._id);
  user.comments.push(comment._id);
  video.save();
  user.save();

  return res.status(201).json({newCommentId: comment._id}); // Created
};

export const deleteComment = async (req, res) => {
  const {
    params: {id},
    session: {user : {_id}},
  } = req;

  const comment = await Comment.findById(id).populate("owner");

  if (String(comment.owner._id) !== String(_id)) {
    return res.sendStatus(403);
  }

  await Comment.findByIdAndDelete(id);
  return res.sendStatus(201);
};