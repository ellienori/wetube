import Video from "../models/Video";
import User from "../models/User";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({createdAt: -1});
    return res.render("home", { pageTitle: "Home ☀", videos });
  } catch {
    console.log("error");
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found." })
  }
  console.log(video);
  return res.render("videos/watch", { pageTitle: `🎬 ${video.title}`, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." })
  }
  return res.render("videos/edit", { pageTitle: `✂ ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({_id: id});
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." })
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
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
    file,
    session: {
      user: {
        _id,
      }
    }
  } = req;

  try {
    await Video.create({
      title,
      description,
      videoUrl: file.path,
      meta: {
        views: 0,
        rating: 0,
      },
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("videos/upload", { pageTitle: "Upload video 🎬", errorMessage: error._message, });
  }
}

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
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
    });
  }
  res.render("search", { pageTitle: "Search 🔍", videos});
}