const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imdbID: { type: String, required: true },
  title: String,
  year: String,
  poster: String,
  rating: String,
  plot: String,
  watched: { type: Boolean, default: false },
});

watchlistSchema.index({ user: 1, imdbID: 1 }, { unique: true });

module.exports = mongoose.model("Watchlist", watchlistSchema);