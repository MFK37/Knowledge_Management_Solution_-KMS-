import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './App.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import '../../pagesCSS/home.css'
import { FiUpload, FiSearch } from 'react-icons/fi'
import { TfiSearch, TfiViewListAlt } from 'react-icons/tfi'
import { BiSearchAlt2 } from 'react-icons/bi'
import { TbEditCircle } from 'react-icons/tb'
import { VscOpenPreview } from 'react-icons/vsc'
import { RiUserSettingsLine } from 'react-icons/ri'

function SuperuserHomePage() {

    var navigate = useNavigate();
    const [username, setUsername] = useState("");


    Axios.get("http://localhost:3001/api/session_data")
        .then((response) => {
            if (!response.data.isLoggedIn) {
                navigate("/")
            } else {
                // console.log(response.data)
                // username = response.data.user[0].user_name;
                // console.log(username)
                if (response.data.user[0].user_role !== "Superuser") {
                    return navigate(`/home_${response.data.user[0].user_role}`)
                }
                setUsername(response.data.user[0].user_name)

            }
        })

    // const logout = () => {
    //     Axios.get("http://localhost:3001/api/delete_session")
    //         .then((conf) => {
    //             navigate("/")
    //         })
    // }

    return (
        <div className='Home'>
            <div className='container'>
                <h2>Hello , Welcome Back {username} !</h2>
                <h2 className='main-title'>Services</h2>
                <div className='services-list'>
                    <Link to={'/newFile'}>
                        <div className='box'>
                            <span className='imgBox'><FiUpload size={"60px"} /></span>
                            {/* <span className='imgBox'><GrUpload  size={"60px"} viewBox="0 0 25 30" /></span> */}

                            <h3 className='box-title'>Upload</h3>
                            <p className='box-desc'>Upload your files </p>
                        </div></Link>
                    <Link to={"/search"}>
                        <div className='box'>
                            <span className='imgBox'><TfiSearch size={"60px"} /></span>
                            <h3 className='box-title'>Search</h3>
                            <p className='box-desc'>Search for files </p>
                        </div></Link>
                    <Link to={"/EditProfile"}>
                        <div className='box'>
                            <span className='imgBox'><RiUserSettingsLine size={"60px"} /></span>
                            <h3 className='box-title'>Edit Profile</h3>
                            <p className='box-desc'>Edit your infromation </p>
                        </div>
                    </Link>
                    <Link to={"/requests"}>
                        <div className='box'>
                            <span className='imgBox'><TfiViewListAlt size={"60px"} /></span>
                            {/* <span className='imgBox'><VscOpenPreview size={"60px"} viewBox="0 0 17.5 16" /></span> */}
                            <h3 className='box-title'>View your Requests</h3>
                            <p className='box-desc'>See the files that's you're requested to be deleted</p>
                        </div>
                    </Link>

                </div>
                {/* <button onClick={logout}>Logout</button> */}
            </div>
        </div >
    );
}


export default SuperuserHomePage;