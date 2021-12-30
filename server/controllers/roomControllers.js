const Room = require("../models/Room");

exports.createRoom = async (name) => {
  // Create a Room
  const newRoom = new Room({
    name,
  });
  // Save Room in the database
  const room = await newRoom.save(Room);

  return room;
};
