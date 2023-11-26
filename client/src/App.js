import './App.css';
// import { useState, useEffect } from 'react'
// import Axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home';
import NavBar from './pages/NavBar';
import SearchBar from './pages/SearchBar';
import FileHeader from './pages/FileHeader';
import FileDetails from './pages/FileDetails';
import SearchFiles from './pages/SearchFiles';
import FileRelease from './pages/FileRelease';
import FilePreview from './pages/FilePreview';
import FileDetailsReleases from './pages/FileDetailsReleases';
import User from './pages/User';
import Porfile from './pages/Porfile';
import FileDetailsReadMe from './pages/FileDetailsReadMe';

import LoginPage from './pages/LoginAndHome/LoginPage'
import VerificationPage from './pages/LoginAndHome/VerificationPage'
import UserHomePage from './pages/LoginAndHome/UserHomePage'
import SuperuserHomePage from './pages/LoginAndHome/SuperuserHomePage'
import AdminHomePage from './pages/LoginAndHome/AdminHomePage'
import ChangePasswordPage from './pages/LoginAndHome/ChangePasswordPage'
import LoginForm from './LoginForm';
import Main from './Main';




// Client Front-End ! 

function App() {


  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<LoginForm />} />
          <Route path='*' element={<Main />} />
        </Routes>
      </Router>
    </div >
  );
}

export default App;
