import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import "./Header.css";
import { auth, logout } from "../../firebase.js";

import { useAuthState } from "react-firebase-hooks/auth";

export default function Header(props) {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  function HandleLogout() {
    logout();
    navigate("/");
  }
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) {
    }
  }, [user, loading]);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Journal
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/journal">
                  My Journal
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <Nav.Link as={Button} onClick={HandleLogout}>
                  Logout
                </Nav.Link>
              </>
            )}

            {!user && (
              <>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>{" "}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
