import './App.css';
import { useState, useEffect } from 'react'
import Axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom'
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
import UserHomePage from './pages/LoginAndHome/UserHomePage'
import SuperuserHomePage from './pages/LoginAndHome/SuperuserHomePage'
import AdminHomePage from './pages/LoginAndHome/AdminHomePage'
import ChangePasswordPage from './pages/LoginAndHome/ChangePasswordPage'
import FileEdit from './pages/FileEdit';
import AdminViewRequestsPage from './pages/AdminViewRequestsPage';
import RequestFileDeletion from './pages/RequestFileDeletion';
import NavSide from './pages/NavSide';
import SuperuserViewRequestsPage from './pages/SuperuserViewRequestsPage';
import ManagesUsers from './pages/ManagesUsers';

import ChangeEmailPage from './pages/ChangeEmailPage';
import ChangePhoneNumberPage from './pages/ChangePhoneNumberPage';
import EditProfile from './pages/EditProfile';
import PageNotFound from './pages/PageNotFound';
import UserProfileUploads from './pages/UserProfileUploads';




// Client Front-End ! 

function Main() {
    const [navVisible, showNavbar] = useState(false);
    var navigate = useNavigate();


    useEffect(() => {
        Axios.get("http://localhost:3001/api/session_data").then((response) => {
            if (response.data.isLoggedIn) {
                console.log("Welcome to the website")
            } else {
                navigate("/")
            }
        })
    }, [])



    return (
        <div className="App">
            <NavSide visible={navVisible} show={showNavbar} />

            <div className={!navVisible ? "page" : "page page-with-navbar"}><NavBar /></div>
            <div className={!navVisible ? "page" : "page page-with-navbar"}>
                
                <Routes>
                    <Route path='/home' element={<Home />} />
                    <Route path='/home_user' element={<UserHomePage />} />
                    <Route path='/home_superuser' element={<SuperuserHomePage />} />
                    <Route path='/home_admin' element={<AdminHomePage />} />

                </Routes>
                <div className='container'>
                    <Routes>
                        <Route path='/search' element={<SearchBar />} />
                        <Route path='Newfile' element={<FileHeader />} />
                        <Route path='/:Creator/:name/:id/:version_id' element={<FileDetails />} >
                            <Route path='readme' element={<FileDetailsReadMe />} />
                            <Route path='versions' element={<FileDetailsReleases />} />
                            <Route path='code' element={<FilePreview />} />
                            <Route path='' element={<FileDetailsReadMe />} />
                        </Route>
                        <Route path='/search/:filename' element={<SearchFiles />} />
                        <Route path='/newRelease/:title/:id' element={<FileRelease />} />
                        <Route path='/EditProfile' element={<EditProfile />} />
                        <Route path='/editfile/:Creator/:title/:id/:version_id' element={<FileEdit />} />
                        <Route path='/view_requests' element={<AdminViewRequestsPage />} /> {/* For admin requests */}
                        <Route path='/requests' element={<SuperuserViewRequestsPage />} /> {/* For SuperUser requests */}
                        <Route path='/manageUsers' element={<ManagesUsers />} />
                        <Route path='requestFileDeletion/:title/:id/:user_id' element={<RequestFileDeletion />} />
                        <Route path='user' element={<User />} />
                        <Route path='/profile' element={<Porfile />} />
                        <Route path='/profile/:Creator/:Creator_id' element={<UserProfileUploads />} />
                        <Route path='/change_password' element={<ChangePasswordPage />} />
                        <Route path='/edit_email' element={<ChangeEmailPage />} />
                        <Route path='/edit_phonenumber' element={<ChangePhoneNumberPage />} />
                        {/* <Route path='*' element={<Navigate to="/" />} /> */}
                    </Routes>
                </div>

            </div>

        </div >
    );
}

export default Main;
