import React from "react";
import Euronetlogo from "./Euronetlogo.png";
import "./Header.css";
import { Container, Navbar, Badge } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaUserCircle } from "react-icons/fa";
// import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";

function Header(props) {
  return (
    <div>
      <Navbar>
        <Container style={{ display: "flex", justifyContent: "space-between" }}>
          <Navbar.Brand href="#">
            <img src={Euronetlogo} alt="Euronetlogo" />
          </Navbar.Brand>
          <h3 style={{ margin: "0" }}>
            {Cookies.get("candidate_email") ? (
              <Badge className="mybadge" bg="light" style={{ color: "gray" }}>
                <FaUserCircle />{" "}
                {Cookies.get("candidate_email").substring(
                  0,
                  Cookies.get("candidate_email").lastIndexOf("@")
                )}
              </Badge>
            ) : (
              ""
            )}
          </h3>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
