import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 80 },
  thumbUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minlength: 20 },
  videoUrl: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }], // array
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref:"User" },
});

videoSchema.static('formatHashtags', function(hashtags) {
  return hashtags
    .split(",")
    .map((word) => word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`);
});
const movieModel = mongoose.model("Video", videoSchema); // Model 이름을 Video로 함
export default movieModel;