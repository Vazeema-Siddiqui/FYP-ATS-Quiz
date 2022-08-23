import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Container,
  ListGroup,
  ListGroupItem,
  Button,
} from "react-bootstrap";
import { useTimer } from "react-timer-hook";
import axios from "axios";
import Cookies from "js-cookie";

function AptTest() {
  const navigate = useNavigate();

  const [test, setTest] = useState([]);
  const [choosedOption, setchoosedOption] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSelected, setSelected] = useState(false);
  const { question, answer, category, options } = test[currentIndex] || {};

  var candID = Cookies.get("candidate_id");
  const [jobID, setJobID] = useState("");

  const [totalScore, setTotalScore] = useState(0);

  const [categorizeScore, setcategorizeScore] = useState({
    oop: 0,
    ds: 0,
    gk: 0,
    other: 0,
  });

  const checkData = (ques, ans, category) => {
    if (ans == choosedOption.text) {
      if (category == "OOP") {
        categorizeScore.oop += 1;
      } else if (category == "DS") {
        categorizeScore.ds += 1;
      } else if (category == "GK") {
        categorizeScore.gk += 1;
      } else {
        categorizeScore.other += 1;
      }
      setTotalScore(prevScore => prevScore + 1);
    }
  };

  useEffect(function getCandDetails() {
    axios
      .get("https://atsbackend.herokuapp.com/api/candinfo/getcandinfo/" + candID)
      .then((response) => {
        setJobID(response.data.getCand[0].job_id);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);


  const submitTest = async (event) => {
    try {
      axios
        .post(
          `https://atsbackend.herokuapp.com/api/testresult/addcandtestresult`,
          {
            cand_id: candID,
            job_id: jobID,
            oop_score: categorizeScore.oop,
            ds_score: categorizeScore.ds,
            gk_score: categorizeScore.gk,
            other_score: categorizeScore.other,
            total_score: totalScore,
          }
        )
        .then((res) => {
          if (res.status == 200) {
            navigate("/result", { state: { candID: candID, jobID: jobID } });
          } else if (res.status == 500) {
            // handleFailureShow();
            alert("Internal Server Error: Response Status 500");
          } else {
            // handleFailureShow();
            alert("Internal Server Error: Response Status 400");
          }
        });
    } catch (error) {
      //   handleErrorShow();
      //   setModalError(error);
      alert("catch error");
    }
  };

  const nextQuestion = () => {
    if (test.length - 1 === currentIndex) return;
    setCurrentIndex(currentIndex + 1);
  };

  const selectOption = (indexSelected, indexOptionSelected) => {
    setTest(
      test.map((item, index) =>
        index === indexSelected
          ? {
            ...item,
            selected: true,
            options: options.map((item, index) =>
              index === indexOptionSelected
                ? { ...item, selected: true }
                : { ...item, selected: false }
            ),
          }
          : item
      )
    );
  };

  const MINUTES = 60 * 60;
  const time = new Date();
  time.setSeconds(time.getSeconds() + MINUTES);

  const { seconds, minutes, hours, start } = useTimer({
    ...(test && { expiryTimestamp: time }),
    autoStart: false,
    onExpire: () => submitTest(),
  });

  useEffect(() => {
    start();
  }, []);

  useEffect(function getTest() {
    axios
      .get("https://atsbackend.herokuapp.com/api/aptTest/getapttests")
      .then((response) => {
        const testData = response.data.getAllAptTest;
        setTest(
          testData &&
          testData.map((test) => {
            return {
              id: test.aptTest_id,
              question: test.aptTest_question,
              answer: test.aptTest_answer,
              category: test.aptTest_category,
              options: [
                { text: test.aptTest_optionA },
                { text: test.aptTest_optionB },
                { text: test.aptTest_optionC },
                { text: test.aptTest_optionD },
              ],
            };
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  if (!(test && options)) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="my-4">
        <Container className="my-4 px-5">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h6>
              Question: {currentIndex + 1} of {test.length}
            </h6>
            <h6>
              {hours}:{minutes}:{seconds}
            </h6>
          </div>
          <Card
            className="my-4"
            style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
          >
            <Card.Header as="h5" style={{ textAlign: "left" }}>
              <div
                dangerouslySetInnerHTML={{ __html: question }}
              />
            </Card.Header>
            <Card.Body>
              <ListGroup style={{ textAlign: "left" }}>
                {options.map((item, index) => (
                  <div key={index}>
                    {item.text ? (
                      <ListGroupItem
                        className="my-2"
                        style={{
                          borderRadius: 10,
                          backgroundColor: item.selected ? "LightGray" : "",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          selectOption(currentIndex, index);
                          setchoosedOption(options[index]);
                          setSelected(true);
                        }}
                      >
                        {item.text}
                      </ListGroupItem>
                    ) : null}
                  </div>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>

          <Container
            className="my-4"
            style={{ display: "flex", justifyContent: "right" }}
          >
            {test.length - 1 === currentIndex ? (
              <Button
                className="btn-success col-sm-2"
                disabled={!isSelected}
                onClick={(e) => {
                  setSelected(false);
                  checkData(question, answer, category);
                  e.preventDefault();
                  // navigate(`/result`);
                  submitTest();
                }}
              >
                Submit
              </Button>
            ) : (
              <Button
                className="col-sm-2"
                style={{
                  backgroundColor: "rgb(6, 89, 167)",
                  color: "white",
                  
                }}
                disabled={!isSelected}
                onClick={() => {
                  setSelected(false);
                  checkData(question, answer, category);
                  nextQuestion();
                }}
              >
                Next
              </Button>
            )}
          </Container>
        </Container>
      </div>
    );
  }
}

export default AptTest;
