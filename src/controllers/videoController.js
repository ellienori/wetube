let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 3,
    comments: 21,
    createdAt: "11 minutes ago",
    views: 888,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 4,
    comments: 1,
    createdAt: "1 minutes ago",
    views: 1,
    id: 3,
  }
];

export const trend = (req, res) => res.render("home", { pageTitle: "Home ☀", videos });

export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id-1];
  return res.render("watch", { pageTitle: `Watching ${video.title} 🎬`, video });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id-1];
  return res.render("edit", { pageTitle: `Editing ${video.title} ✂`, video })
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id-1].title = title;
  return res.redirect(`/videos/${id}`);
};