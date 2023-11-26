import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './App.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import { Link } from 'react-router-dom';
import '../../pagesCSS/home.css'
import { FiUpload } from 'react-icons/fi'
import { BiSearchAlt2 } from 'react-icons/bi'
import { TbEditCircle } from 'react-icons/tb'
import { VscOpenPreview } from 'react-icons/vsc'

import { RiUserSettingsLine } from 'react-icons/ri'
import { TfiSearch } from 'react-icons/tfi'

import { CiViewTimeline } from 'react-icons/ci'
import { MdManageAccounts } from 'react-icons/md'

import AnnouncementImg from '../../pagesCSS/ann.png'

function AdminHomePage() {
  const [username, setUsername] = useState("");

  var navigate = useNavigate();

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/api/session_data").then((response) => {
      console.log(response.data.isLoggedIn + "213")

      if (response.data.isLoggedIn) {
        console.log("hello")
        // document.getElementById("name").innerHTML += response.data.user[0].user_name;
        if (response.data.user[0].user_role !== "Admin") {
          return navigate(`/home_${response.data.user[0].user_role}`)
        }
        setUsername(response.data.user[0].user_name)
      } else {
        navigate("/")
      }
    })
  }, [])

  const logout = () => {
    Axios.get("http://localhost:3001/api/delete_session")
      .then((conf) => {
        Axios.delete();
        console.log(conf + "Dsdadsa")
        navigate("/")
      })
  }

  const change_password = () => {
    console.log("dsa")
    navigate("/change_password")
  }

  return (
    <div className='Home'>
      <div className='container'>
        <div className='services-section'>
          <h2>Hello , Welcome Back Admin {username} !</h2>
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
            <Link to={"/view_requests"}>
              <div className='box'>
                <span className='imgBox'><CiViewTimeline size={"60px"} /></span>
                {/* <span className='imgBox'><VscOpenPreview size={"60px"} viewBox="0 0 17.5 16" /></span> */}
                <h3 className='box-title'>View Requests</h3>
                <p className='box-desc'>See the files that're requested to be deleted </p>
              </div>
            </Link>
            <Link to={"/manageUsers"}>
              <div className='box'>
                <span className='imgBox'><MdManageAccounts size={"60px"} /></span>
                {/* <span className='imgBox'><VscOpenPreview size={"60px"} viewBox="0 0 17.5 16" /></span> */}
                <h3 className='box-title'>Manages Users</h3>
                <p className='box-desc'>To manage all users</p>
              </div>
            </Link>


          </div>

        </div>

        {/* <button onClick={logout}>Logout</button>
        <button onClick={change_password}>Change Password</button>
 */}
        {/* <button onClick={change_password}>Change Password</button> */}

      </div>
      {/* <div className='spikes'></div>
      <div className='ann-section'>
        <div className='container'>
          <h2 className='main-title'>announcement</h2>
          <div className='ann-box'>

            <img src={AnnouncementImg} alt="announcement image" />
            <div className='ann-box-content'>
              <marquee behavior="scroll" direction="up"  >
                Hello World !
              </marquee>

            </div>


          </div>


        </div>

      </div> */}

    </div >

  );
}


export default AdminHomePage;