import React, { useEffect, useState } from "react";
import { Form, Container, Button } from "react-bootstrap";
import "./Journal.css";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase.js";

export default function ThemeSidebar(props) {
  const [user, loading, error] = useAuthState(auth);
  const [outcomes, setOutcomes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState({});

  axios.create({
    baseURL: "http://localhost:9000",
  });

  useEffect(() => {
    async function fetchTheme() {
      let url = `/v2/journals`;
      console.log(url);
      const response = await axios.get(url);
      console.log(response.data);
      if (response.data.length > 0) {
        setTheme(response.data);

        return response;
      }
    }

    if (user) fetchTheme();
  }, []);

  function AddIdealOutcome() {
    console.log(outcomes);
    setOutcomes([
      ...outcomes,
      {
        id: outcomes.length,
        value: "",
      },
    ]);
  }

  const GetOutcomesInputs = outcomes.map((outcome) => {
    return (
      <Form.Group
        className="mb-3"
        controlId="exampleForm.ControlTextarea1"
        key={outcome.id}
        value={outcome.value}
        onChange={(e) => {
          const newOutcomes = [...outcomes];
          newOutcomes[outcome.id].value = e.target.value;
          setOutcomes(newOutcomes);
        }}
      >
        <Form.Control />
      </Form.Group>
    );
  });

  function SaveTheme(e) {
    try {
      e.preventDefault();
      var theme = {
        user_id: user.id,
        title: title,
        description: description,
        outcomes: outcomes,
        start_date: new Date().toUTCString(),
        end_date: new Date().toUTCString(),
        goals_descriptions: [],
      };
      axios.post("/v2/themes", theme);
      alert("Theme saved");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Season's Theme</Form.Label>
          <Form.Control
            placeholder="The Spring of Enlightenment"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Description</Form.Label>
          <Form.Control
            placeholder="A season to learn and grow. To appreciate more than I take."
            as="textarea"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Form.Group>
        <Button variant="outline-secondary" onClick={AddIdealOutcome}>
          Add Ideal Outcome
        </Button>{" "}
        <h3 className="">Ideal Outcomes</h3>
        {GetOutcomesInputs}
        <Button variant="outline-secondary" onClick={SaveTheme}>
          Save Theme
        </Button>{" "}
      </Form>
    </Container>
  );
}
