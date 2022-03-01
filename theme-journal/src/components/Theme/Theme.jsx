import React, { useEffect, useState } from "react";
import { Form, Container, Button, CloseButton } from "react-bootstrap";

import "./Theme.css";
import axios from "../../axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";

export default function ThemeSidebar(props) {
  const [user, loading, error] = useAuthState(auth);
  const [theme, setTheme] = useState({
    title: "",
    description: "",
    outcomes: [],
    goals_descriptions: [],
  });
  const Navigate = useNavigate();

  useEffect(() => {
    async function fetchTheme() {
      let url = "v2/themes/" + user.uid;
      const response = await axios.get(url);
      if (response.status === 200) {
        setTheme(response.data[0]);
      } else alert("Error: " + response.status);
    }

    if (loading) {
      console.log("loading");
    }
    if (user) {
      fetchTheme();
    } else {
      console.log("No user logged in");
    }
  }, [user]);

  function AddIdealOutcome() {
    setTheme({
      ...theme,
      outcomes: [...theme.outcomes, ""],
    });
  }
  function AddGoalDescription() {
    setTheme({
      ...theme,
      goals_descriptions: [...theme.goals_descriptions, ""],
    });
  }

  function SaveTheme(e) {
    try {
      e.preventDefault();

      var newTheme = {
        user_id: user.uid,
        title: theme.title,
        description: theme.description,
        outcomes: theme.outcomes,
        start_date: moment(new Date()).format("YYYY-MM-DD[T00:00:00.000Z]"),
        goals_descriptions: theme.goals_descriptions,
      };
      if (theme) {
        axios.patch("/v2/themes", newTheme);
      } else {
        axios.post("/v2/themes", newTheme);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const GetOutcomesInputs = theme.outcomes.map((outcome, i) => {
    console.log(theme);
    return (
      <Form.Group className="OutcomeInputRow" key={i}>
        <Form.Control
          aria-describedby="basic-addon2"
          value={outcome}
          onChange={(e) => {
            var outcomes = [...theme.outcomes];
            outcomes[i] = e.target.value;
            setTheme({ ...theme, outcomes: outcomes });
          }}
        />
        <CloseButton
          id="button-addon2"
          className="inline-block"
          aria-label="Hide"
          key={i}
          onClick={() => {
            var outcomes = [...theme.outcomes];
            outcomes.splice(i, 1);
            setTheme({ ...theme, outcomes: outcomes });
          }}
        />
      </Form.Group>
    );
  });

  const GetGoals = theme.goals_descriptions.map((goals_description, i) => {
    console.log(theme);
    return (
      <Form.Group className="GoalInputRow" key={i}>
        <Form.Control
          aria-describedby="basic-addon2"
          value={goals_description}
          onChange={(e) => {
            var goals_descriptions = [...theme.goals_descriptions];
            goals_descriptions[i] = e.target.value;
            setTheme({ ...theme, goals_descriptions: goals_descriptions });
          }}
        />
        <CloseButton
          id="button-addon2"
          className="inline-block"
          aria-label="Hide"
          key={i}
          onClick={() => {
            var goals_descriptions = [...theme.goals_descriptions];
            goals_descriptions.splice(i, 1);
            setTheme({ ...theme, goals_descriptions: goals_descriptions });
          }}
        />
      </Form.Group>
    );
  });

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

        <div className="OutcomeHeaderRow">
          <h3 className="mr-auto p-2">Ideal Outcomes</h3>
          <FaPlusCircle role="button" onClick={AddIdealOutcome} />
        </div>
        {theme ? GetOutcomesInputs : ""}

        <div className="OutcomeHeaderRow">
          <h3 className="mr-auto p-2">Goals</h3>
          <FaPlusCircle role="button" onClick={AddGoalDescription} />
        </div>
        {theme ? GetGoals : ""}

        <Button variant="outline-secondary" onClick={SaveTheme}>
          Save Theme
        </Button>
      </Form>
    </Container>
  );
}
