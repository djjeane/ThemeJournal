import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../firebase";
import { Form, Container, Row, Col, Button, Modal } from "react-bootstrap";
import "./Journal.css";
import Theme from "../Theme/Theme";
import Goals from "../Goals/Goals";
import axios from "../../axios";

import moment from "moment";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, RichUtils } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { stateFromHTML } from "draft-js-import-html";

export default function Journal(props)
{
  const [user, loading, error] = useAuthState(auth);
  const [show, setShow] = useState(false);
  const [targetDate, setTargetDate] = React.useState(() =>
  {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  });

  const [theme, setTheme] = useState({
    title: "",
    description: "",
    outcomes: [],
    goals_descriptions: [],
  });

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [journal, setJournal] = useState({});

  const navigate = useNavigate();

  const onEditorStateChange = (editorState) =>
  {
    setEditorState(editorState);
    setJournal({
      ...journal,
      body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    });

    console.log(journal);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() =>
  {
    async function fetchTheme()
    {
      let url = "v2/themes/" + user.uid;
      const response = await axios.get(url);
      if (response.status === 200) {
        setTheme(response.data[0]);
      } else alert("Error: " + response.status);
    }

    async function fetchJournal()
    {
      var url =
        "v2/journals/" +
        user.uid +
        "/" +
        moment(targetDate).format("YYYY-MM-DD[T00:00:00.000+00:00]");
      var result = await axios.get(url);
      if (result.status === 200 && result.data.length > 0) {
        setJournal(result.data[0]);
        let contentState = stateFromHTML(result.data[0].body);
        setEditorState(EditorState.createWithContent(contentState));
      } else {
        let goals = [];
        for (var i = 0; i < theme.goals_descriptions.length; i++) {
          goals.push(0);
        }
        console.log(goals);
        const newJournal = {
          user_id: user.uid,
          body: "",
          goals: goals,
          date: moment(targetDate).format("YYYY-MM-DD[T00:00:00.000+00:00]"),
        };

        setJournal({
          user_id: user.uid,
          body: "",
          goals: goals,
          date: targetDate,
        });
        setEditorState(EditorState.createEmpty());

        console.log("No journal found");
        axios.post("v2/journals", newJournal);
      }
    }

    if (!user) return navigate("/login");

    fetchTheme();
    fetchJournal();
  }, [user, loading, targetDate]);

  // Set the date to the date chosen in the date picker
  function setChosenDate(event)
  {
    setTargetDate(event.target.value);
  }

  async function getJournal()
  {
    var url =
      "v2/journals/" +
      user.uid +
      "/" +
      moment(targetDate).format("YYYY-MM-DD[T00:00:00.000+00:00]");
    console.log(url);
    var result = await axios.get(url);
    if (result.status === 200) {
      console.log(result.data[0]);
      return result.data[0];
    } else {
      console.log("Error: " + result.status);
      return null;
    }
  }

  async function setGoalsFromSlider(index, newValue)
  {
    console.log(index, newValue);
    let newGoals = [...journal.goals];
    newGoals[index] = newValue;
    setJournal({
      ...journal,
      goals: newGoals,
    });
  }

  function saveJournal()
  {
    var newJournal = {
      user_id: user.uid,
      body: journal.body,
      goals: journal.goals,
      date: moment(targetDate).format("YYYY-MM-DD[T00:00:00.000+00:00]"),
    };
    axios.patch("v2/journals", newJournal);
  }

  return (
    <Container fluid className="Journal">
      <Row className="mb-3">
        <Col>
          <h1>{theme.title}</h1>
        </Col>
        <Col xs={3}>
          <Form.Control
            type="date"
            name="targetDate"
            value={targetDate}
            onChange={setChosenDate}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          {journal.goals ? (
            <Row className="mt-3">
              <Goals
                goals={journal.goals}
                descs={theme.goals_descriptions}
                setGoals={setGoalsFromSlider}
              />
            </Row>
          ) : (
            ""
          )}
        </Col>
        <Col>
          <Editor
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "fontFamily",
                "list",
                "textAlign",
                "colorPicker",
                "link",
                "embedded",
                "emoji",
                "image",
                "remove",
                "history",

              ],
              // we'll add our config here
            }}
            editorStyle={{
              border: "1px solid",
              height: "20em",
              borderRadius: "8px",
            }}
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            onTab={(e) =>
            {
              e.preventDefault();
              const newEditorState = RichUtils.onTab(
                e.shiftKey,
                editorState,
                4
              );
              setEditorState(newEditorState);
            }}
          />
        </Col>
      </Row>
      <Row className="mt-4 float-right" >
        <Col xs={7}></Col>
        <Col xs={3}>
          <Button variant="outline-secondary" onClick={handleShow}>
            Edit Current Theme
          </Button>
        </Col>

        <Col xs={2}>
          <Button variant="outline-primary" onClick={saveJournal}>
            Save Journal
          </Button>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Theme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Theme />
        </Modal.Body>
      </Modal>
    </Container>
  );
}
