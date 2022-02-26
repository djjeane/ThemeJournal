import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Form, Container, Row, Col } from "react-bootstrap";
import "./Journal.css";
import ThemeSidebar from "./ThemeSidebar";
export default function Journal(props) {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    fetchUserName();
  }, [user, loading]);

  const [targetDate, setTargetDate] = React.useState(() => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  });

  // Set the date to the date chosen in the date picker
  function SetChosenDate(event) {
    console.log(new Date().toLocaleDateString());
    console.log(targetDate);
    console.log(event.target.value);
    setTargetDate(event.target.value);
  }
  return (
    <Container fluid className="Journal">
      <Row></Row>
      <Row>
        <Col xs={5}>
          <ThemeSidebar />
        </Col>
        <Col xs={6}>
          <Form.Control
            type="date"
            name="targetDate"
            value={targetDate}
            onChange={SetChosenDate}
          />

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control as="textarea" rows={10} />
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
}
