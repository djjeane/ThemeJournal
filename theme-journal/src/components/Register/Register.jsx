import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase.js";
import "./Register.css";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };
  useEffect(() => {
    if (loading) return;
    if (user) console.log("Already logged in");
  }, [user, loading]);
  return (
    <Container fluid className="register">
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control
            className="mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Joe Shmoe"
            type="text"
          />
          <Form.Control
            className="mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
            type="email"
          />
          <Form.Control
            className="mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />

          <Button
            variant="outline-secondary"
            className="mr-2"
            onClick={register}
          >
            Register
          </Button>

          <Button variant="outline-primary" onClick={signInWithGoogle}>
            Register with Google
          </Button>
        </Form.Group>
        <div>
          Already have an account? <Link to="/login">Login</Link> now.
        </div>
      </Form>
    </Container>
  );
}
export default Register;
