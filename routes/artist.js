const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const fileUpload = require("../middleware/file-upload");
const artistController = require("../controller/artist");

router.get("/", artistController.getAllArtists);
router.get("/:id", artistController.getArtist);

router.post(
  "/",
  fileUpload.single("image"),
  [check("name").not().isEmpty()],
  artistController.addArtist
);

router.put("/:id", artistController.editArtist);
router.patch("/:id", artistController.editArtist);

router.delete("/:id", artistController.deleteArtist);

module.exports = router;
