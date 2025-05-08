// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SocialMedia from './pages/SocialMedia';
import Logs from './pages/Logs';
import Composer from './pages/Composer';
import PostsList from './pages/PostsList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/social-media/:projectId" element={<SocialMedia />} />
        <Route path="/composer/:projectId" element={<Composer />} />
        <Route path="/posts/:projectId" element={<PostsList />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </Router>
  );
}

export default App;
