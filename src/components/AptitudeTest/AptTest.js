import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Container, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { useTimer } from "react-timer-hook";
import Axios from "axios";

function AptTest() {
    const navigate = useNavigate();

    const [test, setTest] = useState([]);
    useEffect(function getTest() {
        Axios.get("https://atsbackend.herokuapp.com/api/aptTest/getapttests")
            .then((response) => {
                const testData = response.data.getAllAptTest;
                setTest(testData && testData.map((test) => {
                    return ({
                        id: test.aptTest_id,
                        question: test.aptTest_question,
                        options: ([
                            { text: test.aptTest_optionA },
                            { text: test.aptTest_optionB },
                            { text: test.aptTest_optionC },
                            { text: test.aptTest_optionD },
                        ]),
                    });
                }))
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
            })
    }, []);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSelected, setSelected] = useState(false);
    const { question, options } = test[currentIndex] || {};

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
            ...(test && { expiryTimestamp: time}),
            autoStart: false,
            onExpire: () => setCurrentIndex(test.length - 1)
    })
    useEffect(() => {
        start()
      })
    

    if (!(test && options)) {
        return <div>Loading...</div>
    }
    else {
        return (
            <div className="my-4">
                <Container className="my-4 px-5">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h6>Question: {currentIndex + 1} of {test.length}</h6>
                        <h6>{hours}:{minutes}:{seconds}</h6>
                    </div>
                    <Card className="my-4" style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
                        <Card.Header as="h5" style={{ textAlign: "left" }}>{question}</Card.Header>
                        <Card.Body>
                            <ListGroup style={{ textAlign: "left" }}>
                                {options.map((item, index) => (
                                    <div key={index}>
                                        {
                                            item.text ?
                                                <ListGroupItem className="my-2"
                                                    style={{
                                                        borderRadius: 10,
                                                        backgroundColor: item.selected ? "LightGray" : "",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => {
                                                        selectOption(currentIndex, index);
                                                        setSelected(true);
                                                    }}>
                                                    {item.text}
                                                </ListGroupItem>
                                                : null
                                        }
                                    </div>
                                )
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>

                    <Container className="my-4" style={{ display: "flex", justifyContent:"right" }}>
                        {test.length - 1 === currentIndex ? (
                            <Button className="btn-success col-sm-2"
                                disabled={!isSelected}
                                onClick={(e) => {
                                    setSelected(false);
                                    e.preventDefault();
                                    navigate(`/result`);
                                }
                                }
                            >
                                Submit
                            </Button>
                        ) : (
                            <Button className="col-sm-2"
                                disabled={!isSelected}
                                onClick={() => {
                                    setSelected(false)
                                    nextQuestion()
                                }}
                            >
                                Next
                            </Button>
                        )}
                    </Container>
                </Container>
            </div>
        )
    }
}

export default AptTest