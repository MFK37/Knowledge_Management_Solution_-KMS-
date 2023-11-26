import {React , useState} from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './App.css';
import Axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { RiUserSettingsLine } from 'react-icons/ri'
import { TfiSearch } from 'react-icons/tfi'



function UserHomePage() {

    // var username;
    var navigate = useNavigate();
    const[username,setUsername] = useState("");



    Axios.get("http://localhost:3001/api/session_data")
        .then((response) => {
            if (!response.data.isLoggedIn) {
                navigate("/")
            } else {
                if (response.data.user[0].user_role !== "User") {
                    return navigate(`/home_${response.data.user[0].user_role}`)
                  }
                setUsername(response.data.user[0].user_name)


                document.getElementById("name").innerHTML = username;
            }
        })

    const logout = () => {
        Axios.get("http://localhost:3001/api/delete_session")
            .then((conf) => {
                navigate("/")
            })

    }

    return (
        <div className="Home">
            <div className='container'>
                <div className='services-section'>
                    <h2>Hello , Welcome Back {username} !</h2>
                    <h2 className='main-title'>Services</h2>
                    <div className='services-list'>
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
                    </div>
                </div>
            </div>


            {/* <button onClick={logout}>Logout</button> */}
        </div>
    );
}


export default UserHomePage;