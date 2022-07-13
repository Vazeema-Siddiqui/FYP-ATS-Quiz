import React from "react";
import Euronetlogo from "./Euronetlogo.png";
import { Container, Navbar, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'

function Header(props) {
  return (
    <div>
    
      <Navbar>
      <Container style={{display:"flex", justifyContent: "space-between"}}>
        <Navbar.Brand href="#">
          <img src={Euronetlogo} alt="Euronetlogo" />
        </Navbar.Brand>
        <h3 style={{alignSelf: "end", margin:"0"}}><Badge pill bg="light" style={{color: "gray"}}><FontAwesomeIcon icon={faCircleUser} /> User X</Badge></h3>
        </Container>
      </Navbar>

    </div>
  );
}

export default Header;
