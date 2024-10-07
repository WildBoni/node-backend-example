const fs = require("node:fs/promises");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

const SLEEP_TIME = 2000;

function sleep(ms) {
  return new Promise((res) =>
    setTimeout(() => {
      res("hello");
    }, ms)
  );
}

module.exports.getAllArtists = async (req, res, next) => {
  // Leggo da artists.json
  const file = await fs.readFile("./data/artists.json", "utf8");
  const data = JSON.parse(file);
  // funzione per simulare un tempo di attesa
  await sleep(SLEEP_TIME);
  return res.json(data.artists);
};

module.exports.getArtist = async (req, res, next) => {
  const id = req.params.id;
  const file = await fs.readFile("./data/artists.json", "utf8");
  const data = JSON.parse(file);
  await sleep(SLEEP_TIME);
  const artist = data.artists.find((artist) => id === artist._id);

  if (artist) {
    return res.json(artist);
  } else {
    return res.status(404).json({ message: "artist not found" });
  }
};

module.exports.addArtist = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ error: "Invalid inputs passed, please check your data." });
  }

  const { name, description, category } = req.body;
  let image = req.file.path.replace(/\\/g, "/");
  const createdArtist = {
    name,
    description,
    category,
    image,
    _id: uuidv4(),
  };
  try {
    const file = await fs.readFile("./data/artists.json", "utf8");
    const data = JSON.parse(file);
    const newArtists = [createdArtist, ...data.artists];
    await fs.writeFile(
      "./data/artists.json",
      JSON.stringify({ artists: newArtists })
    );
    await sleep(SLEEP_TIME);
    return res.status(201).json(createdArtist);
  } catch (err) {
    return res.status(500).json({ error: "Artist creation failed" });
  }
};

module.exports.editArtist = async (req, res, next) => {
  const { name, description, category } = req.body;
  const artistId = req.params.id;

  try {
    const file = await fs.readFile("./data/artists.json", "utf8");
    const data = JSON.parse(file);
    let newArtists = data.artists.map((artist) => {
      if (artist._id == artistId) {
        updatedArtist = {
          ...artist,
          name,
          description,
          category,
        };
        return updatedArtist;
      }
      return artist;
    });
    console.log(newArtists);
    await fs.writeFile(
      "./data/artists.json",
      JSON.stringify({ artists: newArtists })
    );
    await sleep(SLEEP_TIME);
    return res.status(200).json(newArtists);
  } catch (err) {
    return res.status(500).json({ error: "Artist update failed" });
  }
};

module.exports.deleteArtist = async (req, res, next) => {
  const artistId = req.params.id;

  try {
    const file = await fs.readFile("./data/artists.json", "utf8");
    let data = JSON.parse(file);
    const artistToDelete = data.artists.find(
      (artist) => artist._id === artistId
    );
    if (!artistToDelete) {
      return res
        .status(404)
        .json({ error: "Could not find artist with this id." });
    }
    let updatedArtists = data.artists.filter(
      (artist) => artist._id !== artistId
    );

    let updatedArtistsList = {
      artists: updatedArtists,
    };
    await fs.writeFile(
      "./data/artists.json",
      JSON.stringify(updatedArtistsList)
    );

    // elimina immagine sul server locale (cartella upload/images)
    fs.unlink(artistToDelete.image, (err) => {
      console.log(err);
    });
    await sleep(SLEEP_TIME);
    return res.status(200).json({ message: "Deleted artist." });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Something went wrong, could not delete artist." });
  }
};
