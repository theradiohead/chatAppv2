import TextField from "@material-ui/core/TextField";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  ButtonGroup,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import "./App.css";

function App() {
  const [state, setState] = useState({ message: "", name: "randomUser" });
  const [chat, setChat] = useState([]);
  const [usernameModalState, setUsernameModalState] = useState(true);
  const [newRoomModalState, setNewRoomModalState] = useState(false);

  const [currentRoom, setCurrentRoom] = useState("home");
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/rooms/get_rooms")
      .then(function (response) {
        console.log(response.data);
        const fetchedRooms = response.data.map((room) => room.name);
        setRooms(fetchedRooms);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [newRoom]);
  useEffect(
    () => {
      socketRef.current = io.connect("http://localhost:4000");
      console.log(currentRoom);
      socketRef.current.on(`message ${currentRoom}`, ({ name, message }) => {
        setChat([...chat, { name, message }]);
      });
      return () => socketRef.current.disconnect();
    },
    [chat],
    currentRoom
  );
  const toggleUsernameModal = () => {
    setUsernameModalState(!usernameModalState);
  };
  const toggleNewRoomModal = () => {
    setNewRoomModalState(!newRoomModalState);
  };
  const handleChange = (e) => {
    setState({ message: "", name: e.target.value });
  };
  const handleNewRoomChange = (e) => {
    setNewRoom(e.target.value);
  };
  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    const { name, message } = state;

    socketRef.current.emit("message", { name, message, currentRoom });
    e.preventDefault();
    setState({ message: "", name });
  };
  const addRoom = (newRoom) => {
    var newRooms = rooms.concat(newRoom);
    setRooms(newRooms);

    axios
      .post("http://localhost:4000/api/rooms/create_room", {
        name: newRoom,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };
  const renderRooms = () => {
    return rooms.map((room, index) => (
      <div key={index}>
        <Button
          style={{ backgroundColor: "#cdb4db" }}
          active={room === currentRoom}
          onClick={() => {
            setCurrentRoom(room);
            setChat([]);
          }}
          outline
          size="lg"
        >
          {room}
        </Button>
      </div>
    ));
  };
  return (
    <div className="app-background">
      <Modal isOpen={usernameModalState} toggle={toggleUsernameModal}>
        <ModalHeader toggle={toggleUsernameModal}>
          Welcome to the Chats app
        </ModalHeader>
        <ModalBody>
          Choose a cool nickname to chat with other users
          <br />
          <br />
          <Input placeholder="nickname" onChange={handleChange} />
        </ModalBody>

        <ModalFooter>
          <Button
            style={{ backgroundColor: "#e76f51" }}
            onClick={(e) => {
              toggleUsernameModal();
            }}
            size="lg"
          >
            Chat !!
          </Button>{" "}
        </ModalFooter>
      </Modal>
      <div className="rooms">
        <ButtonGroup>{renderRooms()}</ButtonGroup>
        <Button
          style={{ backgroundColor: "#cdb4db" }}
          size="lg"
          onClick={toggleNewRoomModal}
        >
          +
        </Button>
      </div>
      <Modal isOpen={newRoomModalState} toggle={toggleNewRoomModal}>
        <ModalHeader toggle={toggleNewRoomModal}>Open a new room</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Choose a new room name"
            onChange={handleNewRoomChange}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            style={{ backgroundColor: "#e76f51" }}
            onClick={(e) => {
              addRoom(newRoom);
              toggleNewRoomModal();
            }}
            size="lg"
          >
            Create Room
          </Button>{" "}
        </ModalFooter>
      </Modal>
      <div className="render-chat">
        <h1>Chat App</h1>

        {renderChat()}
      </div>
      <Form onSubmit={onMessageSubmit}>
        <Row>
          <Col xs="9" className="test-border">
            <TextField
              fullWidth
              name="message"
              onChange={(e) => onTextChange(e)}
              value={state.message}
              id="outlined-multiline-static"
              variant="outlined"
              label="Message"
            />
          </Col>
          <Col xs="3" className="test-border">
            <Button
              style={{ backgroundColor: "#7f5539", color: "white" }}
              size="lg"
              outline
            >
              Send Message
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default App;
