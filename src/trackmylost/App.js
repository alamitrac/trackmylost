import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./register";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Signalement from "./Signalement";
import Admin from "./Admin";
import Message from "./Message";
import AdminLogin from "./loginadmin";
import Alertes from "./alertes";
import Moncompte from "./moncompte";
import ForgotPassword from "./ForgotPassword";
function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
        {/* REGISTER */}
        <Route path="/register" element={<Register />} />
<Route path="/loginadmin" element={<AdminLogin />} />
        {/* AUTRES */}
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signalement" element={<Signalement />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/message" element={<Message />} />
        <Route path="/moncompte" element={<Moncompte />} />


<Route path="/alertes" element={<Alertes />} />
      </Routes>
    </Router>
  );
}

export default App;