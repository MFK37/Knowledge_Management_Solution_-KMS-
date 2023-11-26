import { React, useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import '../pagesCSS/navBar.css'
import { MdLightMode, MdDarkMode } from 'react-icons/md'
import { HiOutlineLogout } from 'react-icons/hi'
import Axios from 'axios'
import LoginImg from '../pagesCSS/Logo.png'



export default function NavBar() {
    const navigate = useNavigate();


    Axios.defaults.withCredentials = true;
    const [userRole, setUserRole] = useState("");
    const [role,setRole] = useState("");


    useEffect(() => {
        Axios.get("http://localhost:3001/api/Home_status").then((response) => {
            console.log(response + "Dsadaaa")
            if (response.data.isLoggedIn) {
                // console.log("hellpss")
                // console.log("Meow", response.data.user[0].user_role);
                setUserRole(`/home_${response.data.user[0].user_role}`)
                setRole(response.data.user[0].user_role)
                // navigate(`/home_${response.data.user[0].user_role}`)
                return;
            } else {
                // console.log("hellp")
                // setUserRole("/")
                navigate("/")
            }
        }
        )
    }, [])


    const [changeMode, setChangedMode] = useState(false);
    const Mode = () => {
        setChangedMode(!changeMode);
    }

    const logout = () => {
        Axios.get("http://localhost:3001/api/delete_session")
            .then((conf) => {
                Axios.delete();
                console.log(conf + "Dsdadsa")
                navigate("/")
            })
    }

    const Home = () => {
        Axios.get("http://localhost:3001/api/Home_status").then((response) => {
            console.log(response + "Dsadaaa")
            if (response.data.isLoggedIn) {
                console.log("hellpss")
                console.log("Meow", response.data.user[0].user_role);
                setUserRole(`/home_${response.data.user[0].user_role}`)
                navigate(`/home_${response.data.user[0].user_role}`)
                return;
            } else {
                console.log("hellp")
                // setUserRole("/")
                navigate("/")
            }
        }
        )
    }
    return (
        <div>
            <div className='navBar'>
                <div className='container'>
                    {/* <div className="Logo"><Link to={"/"}>KMS</Link></div> */}
                    <div className="Logo">
                        <Link to={userRole}><img className='img-logo' src={LoginImg} alt="Login-img" /></Link>
                    </div>

                    <div className='rightSide'>
                        {/* <NavLink className={({ isActive }) => (isActive ? 'active' : '')} onClick={Home} >Home</NavLink> */}
                        <NavLink to={userRole} className={({ isActive }) => (isActive ? 'active' : '')} >Home</NavLink>

                        <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={"/search"}>Search</NavLink>
                        {role === "User" ? "" : 
                        <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={"/profile"}>MY uploads</NavLink>
                        }
                        {/* <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={"/about"}>About us</NavLink> */}
                        {/* <Link to={"/preview"}>Preview</Link> */}

                        {/* <button onClick={Mode} className='ChangeModeButton'>{changeMode ? <MdDarkMode className='DarkModeIcon' size={"22px"} /> :
                            <MdLightMode style={{ cursor: "pointer" }} className='LightModeIcon' size={"22px"} />}</button> */}
                        {/* {<LightModeIcon />} */}

                        <HiOutlineLogout title='Logout' cursor={"pointer"} onClick={logout} size={"22px"} color="red" />
                    </div>
                </div>
            </div>
        </div>
    )
}
