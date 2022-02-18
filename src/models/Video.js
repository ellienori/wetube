import mongoose from "mongoose";

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

const movieModel = mongoose.model("Video", videoSchema); // Model 이름을 Video로 함
export default movieModel;