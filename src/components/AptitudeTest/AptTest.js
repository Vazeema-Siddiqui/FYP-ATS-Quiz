import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Container,
  ListGroup,
  ListGroupItem,
  Button,
} from "react-bootstrap";
import Countdown from "react-countdown";
import axios from "axios";
import Cookies from "js-cookie";

function AptTest() {
  const navigate = useNavigate();

  const [test, setTest] = useState(
    JSON.parse(localStorage.getItem("currentTest")) || []
  );
  const [choosedOption, setchoosedOption] = useState("");

  const [currentIndex, setCurrentIndex] = useState(
    JSON.parse(window.localStorage.getItem("currentIndex")) || 0
  );
  const [isSelected, setSelected] = useState(false);
  const { question, answer, category, options } = test[currentIndex] || {};

  var candID = Cookies.get("candidate_id");
  const [jobID, setJobID] = useState("");

  const [totalScore, setTotalScore] = useState(
    JSON.parse(window.localStorage.getItem("totalScore")) || 0
  );

  const [categorizeScore, setcategorizeScore] = useState({
    oop: JSON.parse(window.localStorage.getItem("oopScore")) || 0,
    ds: JSON.parse(window.localStorage.getItem("dsScore")) || 0,
    gk: JSON.parse(window.localStorage.getItem("gkScore")) || 0,
    other: JSON.parse(window.localStorage.getItem("otherScore")) || 0,
  });

  useEffect(() => {
    window.localStorage.setItem("currentIndex", currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    window.localStorage.setItem("totalScore", totalScore);
  }, [totalScore]);

  useEffect(() => {
    window.localStorage.setItem("oopScore", categorizeScore.oop);
  }, [categorizeScore.oop]);

  useEffect(() => {
    window.localStorage.setItem("dsScore", categorizeScore.ds);
  }, [categorizeScore.ds]);

  useEffect(() => {
    window.localStorage.setItem("gkScore", categorizeScore.gk);
  }, [categorizeScore.gk]);

  useEffect(() => {
    window.localStorage.setItem("otherScore", categorizeScore.other);
  }, [categorizeScore.other]);

  // useEffect(()=> {
  //   console.log("currentIndex ", currentIndex);
  //   console.log("totalScore ", totalScore);
  //   console.log("oop ", categorizeScore.oop);
  //   console.log("ds ", categorizeScore.ds);
  //   console.log("gk ", categorizeScore.gk);
  //   console.log("other ", categorizeScore.other);
  // }, [currentIndex, totalScore, categorizeScore.oop, categorizeScore.ds, categorizeScore.gk, categorizeScore.other])

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
      setTotalScore((prevScore) => prevScore + 1);
    }
  };

  useEffect(function getCandDetails() {
    axios
      .get(
        "https://atsbackend.herokuapp.com/api/candinfo/getcandinfo/" + candID
      )
      .then((response) => {
        setJobID(response.data.getCand[0].job_id);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const submitTest = async (e) => {
    try {
      // e.preventDefault();
      // console.log({
      //   cand_id: candID,
      //   job_id: jobID,
      //   oop_score: categorizeScore.oop,
      //   ds_score: categorizeScore.ds,
      //   gk_score: categorizeScore.gk,
      //   other_score: categorizeScore.other,
      //   total_score: totalScore,
      // });
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
            navigate("/result/" + candID + "/" + jobID, {
              replace: true,
              state: { candID: candID, jobID: jobID },
            });
            Cookies.remove("candidate_email");
            Cookies.remove("candidate_id");
          } else if (res.status == 500) {
            alert("Internal Server Error: Response Status 500");
          } else {
            alert("Internal Server Error: Response Status 400");
          }
        });
    } catch (error) {
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

  useEffect(function getTest() {
    axios
      .get("https://atsbackend.herokuapp.com/api/aptTest/getapttests")
      .then((response) => {
        const testData = response.data.getAllAptTest;
        // setTest(
        const quiz =
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
          });
        setAndSaveTest(quiz);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const setAndSaveTest = (quiz) => {
    setTest(quiz);
    window.localStorage.setItem("currentTest", JSON.stringify(test));
  };

  const renderer = ({ hours, minutes, seconds }) => {
    return (
      <span>
        {hours}:{minutes}:{seconds}
      </span>
    );
  };

  const [data, setData] = useState({ date: Date.now(), delay: 3600000 });
  const wantedDelay = 3600000;

  useEffect(() => {
    const savedTime = window.localStorage.getItem("expireTime");
    if (savedTime != null && !isNaN(savedTime)) {
      const currentTime = Date.now();
      const delta = parseInt(savedTime, 10) - currentTime;

      if (delta > wantedDelay) {
      } else {
        setData({ date: currentTime, delay: delta });
      }
    }
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
              <Countdown
                date={data.date + data.delay}
                renderer={renderer}
                onStart={(delta) => {
                  if (window.localStorage.getItem("expireTime") == null) {
                    window.localStorage.setItem(
                      "expireTime",
                      JSON.stringify(data.date + data.delay)
                    );
                  }
                }}
                onComplete={() => {
                  submitTest();
                }}
              />
            </h6>
          </div>
          <Card
            className="my-4"
            style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
          >
            <Card.Header as="h5" style={{ textAlign: "left" }}>
              <div dangerouslySetInnerHTML={{ __html: question }} />
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
                onClick={() => {
                  setSelected(false);
                  checkData(question, answer, category);
                  // e.preventDefault();
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
