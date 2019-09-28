const mongoose = require("mongoose");

const Article = require("../models/article");

exports.get_thumbnail_url = (req, res, next) => {
  res.status(200).json({
    url: req.file.path
  });
};
