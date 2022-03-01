import React, { useState, useEffect } from "react";
import
{
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import
{
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Button,
  Form,
} from "react-bootstrap";
import "./Header.css";
import { auth, logout } from "../../firebase.js";

import { useAuthState } from "react-firebase-hooks/auth";

import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "../GlobalStyles";
import { lightTheme, darkTheme } from "../ColorTheme";

export default function Header(props)
{
  const [user, loading, error] = useAuthState(auth);

  const [theme, setTheme] = useState("light");
  const themeToggler = () =>
  {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const navigate = useNavigate();

  function HandleLogout()
  {
    logout();
    navigate("/");
  }
  useEffect(() =>
  {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) {
    }
  }, [user, loading]);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />

        <Navbar className="Navbar" expand="lg" sticky="top">
          <Container>
            <Navbar.Brand as={Link} to="/">
              <Navbar.Text>
                Journal
              </Navbar.Text>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              className="justify-content-end"
              id="basic-navbar-nav"
            >
              <Nav className="ml-auto">
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

                    <NavDropdown title={user.displayName} id="nav-dropdown">
                      <NavDropdown.Item eventKey="4.1">
                        <Nav.Link as={Link} to="/profile">
                          Profile
                        </Nav.Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item eventKey="4.2">
                        <Nav.Link as={Button} onClick={HandleLogout}>
                          Logout
                        </Nav.Link>
                      </NavDropdown.Item>
                    </NavDropdown>
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
                <Navbar.Text>
                  <Form.Check
                    className="justify-content-end"
                    type="switch"
                    id="disabled-custom-switch"
                    onChange={themeToggler}
                  />
                </Navbar.Text>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    </ThemeProvider>
  );
}
