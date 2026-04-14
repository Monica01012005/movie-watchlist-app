const express = require("express");
const router = express.Router();
const Watchlist = require("../models/Watchlist");

// ✅ IMPORTANT: correct file name
const auth = require("../middleware/authMiddleware");

// GET all movies
router.get("/", auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const movies = await Watchlist.find({ user: req.user.id });
    res.json(movies);
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ADD movie
router.post("/", auth, async (req, res) => {
  try {
    const { imdbID } = req.body;

    if (!imdbID) {
      return res.status(400).json({ message: "imdbID is required" });
    }

    // Check if movie already exists for this user
    const existing = await Watchlist.findOne({ user: req.user.id, imdbID });
    if (existing) {
      return res.status(400).json({ message: "Movie already exists in watchlist" });
    }

    const movie = await Watchlist.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json(movie);
  } catch (err) {
    console.error("POST error:", err);
    res.status(400).json({ message: "Failed to add movie", error: err.message });
  }
});

// TOGGLE watched
router.patch("/:id", auth, async (req, res) => {
  try {
    const movie = await Watchlist.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Verify ownership
    if (movie.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    movie.watched = !movie.watched;
    await movie.save();

    res.json(movie);
  } catch (err) {
    console.error("PATCH error:", err);
    res.status(500).json({ message: "Error updating movie", error: err.message });
  }
});

// DELETE movie
router.delete("/:id", auth, async (req, res) => {
  try {
    const movie = await Watchlist.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    
    if (movie.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Watchlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ message: "Error deleting movie", error: err.message });
  }
});

module.exports = router;