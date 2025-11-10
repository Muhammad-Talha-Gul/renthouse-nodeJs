// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './appRoutes/AppRoutes';
import Header from './components/Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './assets/css/styles.css';
import Footer from './components/Footer/Footer';
function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
       {/* This renders the Header */}
      <AppRoutes /> {/* This renders your routes */}
      
    </Router>
  );
}

export default App;
