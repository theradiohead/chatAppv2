const express = require("express");
const Room = require("../../models/Room");
const roomControllers = require("../../controllers/roomControllers");
const router = express.Router();

// @route  POST api/post/create_room
// @desc   create a new room
// @access Public
router.post("/create_room", (req, res) => {
  const name = req.body.name;
  roomControllers
    .createRoom(name)
    .then((room) => res.send(room))
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
});
// @route  GET api/post/get_rooms
// @desc   get all rooms
// @access Public
router.get("/get_rooms", (req, res) => {
  // Save Post in the database

  Room.find({})
    .select(["name"])
    .then((rooms) => res.json(rooms))
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retreiving rooms.",
      });
    });
});

module.exports = router;
