import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordResetEmail } from "../../firebase";
import "./Reset.css";
function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);
  return (
    <Container fluid className="Reset">
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
          />
        </Form.Group>
        <Button
          variant="outline-secondary"
          onClick={() => sendPasswordResetEmail(email)}
        >
          Reset Password
        </Button>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now. //{" "}
        </div>
      </Form>
    </Container>
  );
}
export default Reset;
