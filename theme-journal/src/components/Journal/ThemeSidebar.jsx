import React, { useEffect, useState } from "react";
import { Form, Container, Button } from "react-bootstrap";
import "./Journal.css";
import axios from "../../axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase.js";

export default function ThemeSidebar(props) {
  const [user, loading, error] = useAuthState(auth);
  const [theme, setTheme] = useState({
    title: "",
    description: "",
    outcomes: [],
  });

  useEffect(() => {
    async function fetchTheme() {
      let url = "/v2/themes/" + user.uid;
      const response = await axios.get(url);
      if (response.data.length > 0) {
        setTheme(response.data[0]);
      } else setTheme();
    }

    if (user) fetchTheme();
  }, []);

  function AddIdealOutcome() {
    console.log(theme.outcomes);
    setTheme({
      ...theme,
      outcomes: [...theme.outcomes, ""],
    });
  }

  const GetOutcomesInputs = theme.outcomes.map((outcome, i) => {
    console.log(theme);
    return (
      <Form.Group className="mb-3" key={i}>
        <Form.Control
          value={outcome}
          onChange={(e) => {
            var outcomes = [...theme.outcomes];
            outcomes[i] = e.target.value;
            setTheme({ ...theme, outcomes: outcomes });
          }}
        />
      </Form.Group>
    );
  });

  function SaveTheme(e) {
    try {
      e.preventDefault();

      var newTheme = {
        user_id: user.id,
        title: theme.title,
        description: theme.description,
        outcomes: theme.outcomes,
        start_date: new Date().toUTCString(),
        end_date: new Date().toUTCString(),
        goals_descriptions: [],
      };
      axios.post("/v2/themes", newTheme);
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
            value={theme.title}
            onChange={(event) =>
              setTheme({ ...theme, title: event.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Description</Form.Label>
          <Form.Control
            placeholder="A season to learn and grow. To appreciate more than I take."
            as="textarea"
            rows={3}
            value={theme.description}
            onChange={(event) =>
              setTheme({ ...theme, description: event.target.value })
            }
          />
        </Form.Group>
        <Button variant="outline-secondary" onClick={AddIdealOutcome}>
          Add Ideal Outcome
        </Button>
        <h3 className="">Ideal Outcomes</h3>
        {GetOutcomesInputs}
        <Button variant="outline-secondary" onClick={SaveTheme}>
          Save Theme
        </Button>
      </Form>
    </Container>
  );
}
