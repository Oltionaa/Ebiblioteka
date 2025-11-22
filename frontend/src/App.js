import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserDashboard from "./pages/UserDashboard";
import LibrarianDashboard from "./pages/LibrarianDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import AboutUs from "./components/AboutUs";
import About from "./components/About.jsx";
import Footer from "./components/Footer.jsx";
import "./styles/style.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/dashboard-bibliotekar" element={<LibrarianDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/About" element={<About />} />
        <Route path="/Footer" element={<Footer />} />

      </Routes>
    </Router>
  );
}

export default App;