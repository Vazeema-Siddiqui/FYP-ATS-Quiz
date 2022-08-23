import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import { Card, Button, Form, Modal } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function LoginCandidate() {
  const [cand_email, setCandEmail] = useState("");
  let navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const handleErrorShow = () => setShowError(true);
  const handleErrorClose = () => setShowError(false);
  const handleFailureShow = () => setShowFailure(true);
  const handleFailureClose = () => setShowFailure(false);
  const [modalError, setModalError] = useState("");
  const [showFailure, setShowFailure] = useState(false);

  const processVerifcation = async (event) => {
    try {
      axios
        .post(`https://atsbackend.herokuapp.com/api/candinfo/verifycandidate`, {
          verify_cand_email: cand_email,
        })
        .then((res) => {
          if (res.status == 200) {
            Cookies.set("candidate_email", cand_email);
            Cookies.set("candidate_id", res.data.getCand[0].cand_id);
            console.log(Cookies.get("candidate_id"));
            navigate("/aptitude-test");
          } else if (res.status == 500) {
            handleFailureShow();
          } else {
            handleFailureShow();
          }
        });
    } catch (error) {
      handleErrorShow();
      setModalError(error);
    }
  };
  return (
    <div className="login col-sm-9 col-md-8 col-lg-7">
      <Card style={{ boxShadow: "rgba(0, 0, 0, 0.5) 0px 3px 8px" }}>
        <Card.Header
          as="h6"
          style={{ backgroundColor: "rgb(0, 51, 153)", color: "white" }}
        >
          Candidate Aptitude Test Login
        </Card.Header>
        <Card.Body
          style={{ backgroundColor: "rgb(204, 204, 204)", color: "white" }}
        >
          <Form style={{ paddingLeft: "0.5em", paddingRight: "0.5em" }}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label
                style={{ color: "gray", fontWeight: "bold", margin: "0", float: "left" }}
              >
                Email
              </Form.Label>
              <Form.Control
                type="text"
                value={cand_email}
                onChange={(e) => setCandEmail(e.target.value)}
                placeholder="Enter registered email"
              />
            </Form.Group>
          </Form>

          <Button
            style={{
              backgroundColor: "rgb(6, 89, 167)",
              color: "white",
              float: "right",
              marginTop: "1em",
              marginRight: "0.5em"
            }}
            onClick={processVerifcation}
          >
            Verify User
          </Button>
        </Card.Body>
      </Card>

      <Modal
        contentClassName="modalFailure"
        show={showError}
        onHide={handleErrorClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal contentClassName="modalFailure" show={showFailure} onHide={handleFailureClose} backdrop="static" keyboard={false} centered>
          <Modal.Header closeButton>
            <Modal.Title>Failure</Modal.Title>
          </Modal.Header>
          <Modal.Body>Something Went Wrong. Try Again.</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleFailureClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalError}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleErrorClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
