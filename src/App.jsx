import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HostRoom from './pages/HostRoom';
import RemoteControl from './pages/RemoteControl';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/host/:roomId" element={<HostRoom />} />
        <Route path="/remote/:roomId" element={<RemoteControl />} />
      </Routes>
    </Router>
  );
}

export default App;
