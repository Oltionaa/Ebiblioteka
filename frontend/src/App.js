import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AllBooks from "./components/AllBooks";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/style.css";

function App() {
  return (
    <Router>
      <main style={{ minHeight: "80vh", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<AllBooks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    
    </Router>
  );
}

export default App;
