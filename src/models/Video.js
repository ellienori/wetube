import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, required: true, trim: true, minlength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }], // array
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

videoSchema.pre('save', async function() {
  // this refers to the document
  this.hashtags = this.hashtags[0].split(",")
                          .map((word) => word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`);
});

const movieModel = mongoose.model("Video", videoSchema); // Model 이름을 Video로 함
export default movieModel;