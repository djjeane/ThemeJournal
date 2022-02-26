import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";

import { Container, Form, Button, Row, Col } from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/journal");
  }, [user, loading]);

  return (
    <Container fluid className="login">
      {/* <Row className="padding: 40px">
        <Col md={4}></Col>
        <Col> */}
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Control
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>
        <Button
          variant="outline-secondary"
          onClick={() => signInWithEmailAndPassword(email, password)}
        >
          Login
        </Button>

        <Button variant="outline-primary" onClick={() => signInWithGoogle()}>
          Login with Google
        </Button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </Form>
      {/* </Col>
        <Col md={4}></Col>
      </Row> */}
    </Container>
  );
}
export default Login;
