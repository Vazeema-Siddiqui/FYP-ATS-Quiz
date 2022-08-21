import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.js";
import AptTest from "./components/AptitudeTest/AptTest.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Result from "./components/Result/Result.js";
import LoginCandidate from "./components/LoginCandidate/LoginCandidate.js";
function App() {
  return (
    <div className="App" style={{ textAlign: "center" }}>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginCandidate />} />
          <Route path="/aptitude-test" element={<AptTest />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
