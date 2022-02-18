import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home ☀", videos });
  } catch {
    console.log("error");
  }
};

export const watch = (req, res) => {
  const { id } = req.params;
  return res.render("watch", { pageTitle: `Watching ${video.title} 🎬` });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing ${video.title} ✂` })
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {

  return res.render("upload", { pageTitle: "Upload video 🎬"});
};

export const postUpload = (req, res) => {
  // here we will add a video to the videos array.
  const { title } = req.body;
  return res.redirect("/");
}