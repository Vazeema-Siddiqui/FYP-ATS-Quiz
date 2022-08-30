import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Row, Col, Container, ListGroup, Spinner } from "react-bootstrap";
import "./Test.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  scales: {
    y: {
      max: 25,
      min: 0,
      // ticks: {
      //   stepSize: 1,
      // },
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    maintainAspectRatio: true,
    title: {
      display: true,
      text: "Candidate Test Result",
    },
  },
};

export default function GraphicalAptTest() {
  const [candInfo, setCandInfo] = useState([]);
  const [candTestScore, setcandTestScore] = useState([]);
  const [isLoading, setLoading] = useState(true);
  var { jobID, candID } = useParams();
  const location = useLocation();
  // var candID = location.state.candID;
  // var jobID = location.state.jobID;

  async function FetchAPI() {
    const response = await fetch(
      "https://atsbackend.herokuapp.com/api/candinfo/getcandinfo/" + candID
    );

    const json = await response.json();
    setLoading(true);

    setTimeout(() => {
      setCandInfo(json.getCand[0]);
      setLoading(false);
    }, 3000);
  }
  async function FetchAPI2() {
    const response = await fetch(
      "https://atsbackend.herokuapp.com/api/testresult/getcandtestresult/" +
        jobID +
        "/" +
        candID
    );

    const json = await response.json();
    setLoading(true);

    setTimeout(() => {
      setcandTestScore(json.getonecandtestresult[0]);
      // setLoading(false);
    }, 1000);
  }
  const labels = ["OOP", "DS", "GK", "Other"];

  const data = {
    labels,
    datasets: [
      {
        label: "Test View",
        //data: labels.map(() => faker.datatype.number({ min: 0, max: 25 })),
        data: [
          candTestScore.oop_score,
          candTestScore.ds_score,
          candTestScore.gk_score,
          candTestScore.other_score,
        ],
        backgroundColor: ["red", "yellow", "green", "purple"],
        barThickness: "70",
      },
    ],
  };
  useEffect(() => {
    FetchAPI();
    FetchAPI2();
  }, []);
  if (isLoading == true) {
    return (
      <div className="job-detail-list">
        <Spinner animation="border" className="loader" />
      </div>
    );
  } else {
    return (
      <div className="jobdetail">
        <Container>
          <h5
            style={{
              backgroundColor: "rgb(6, 89, 167)",
              color: "white",
              padding: "7px",
            }}
          >
            CANDIDATE TEST RESULT
          </h5>
          <Container fluid style={{ textAlign: "left" }}>
            <Row>
              <Col style={{ padding: "1rem" }}>
                <ListGroup variant="flush" style={{ fontSize: "13px" }}>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <h5>Your Submitted Application</h5>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Name:</Col>
                      <Col>{candInfo.cand_name}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Email:</Col>
                      <Col>{candInfo.cand_email}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Contact:</Col>
                      <Col>{candInfo.cand_contact}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Highest Education:</Col>
                      <Col>{candInfo.cand_highedu}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Work Experinece:</Col>
                      <Col>{candInfo.cand_workexp} year(s)</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Gender:</Col>
                      <Col>{candInfo.cand_gender}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Preferred Shift:</Col>
                      <Col>{candInfo.cand_shiftspref}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>HEC Verified Degree:</Col>
                      <Col>{candInfo.cand_hecverif}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Applied for Position:</Col>
                      <Col>{candInfo.cand_positionApplied}</Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col style={{ padding: "1rem" }}>
                <Bar
                  options={options}
                  // data=[
                  //   {candTestScore.oop_score},
                  //   {candTestScore.ds_score},
                  //   {candTestScore.gk_score},
                  //   {candTestScore.other_score}
                  // ]
                  data={data}
                />
              </Col>
            </Row>
          </Container>
        </Container>
      </div>
    );
  }
}
