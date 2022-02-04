export const trend = (req, res) => {
  const videos = [
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
      comments: 9,
      createdAt: "1 minutes ago",
      views: 11,
      id: 3,
    }
  ];
  return res.render("home", { pageTitle: "Home ☀", videos });
};
export const see = (req, res) => {
  console.log(`${req.params.id}`);
  return res.render("watch", { pageTitle: "Watch" });
};
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload Videos");
export const deleteVideo = (req, res) => res.send("Delete Videos");