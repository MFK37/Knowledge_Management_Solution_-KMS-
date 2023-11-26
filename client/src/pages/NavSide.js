import { React, useState, useEffect } from 'react';
import {
    FaAngleRight,
    FaAngleLeft,
    FaChartBar,
    FaThLarge,
    FaShoppingCart,
    FaCog,
    FaSignOutAlt,
    FaBars,
    FaHome,
    FaSearch

} from 'react-icons/fa';
import { NavLink, useNavigate } from "react-router-dom";
import "../pagesCSS/navSide.css";
import Axios from 'axios'

const ICON_SIZE = 20;


function NavSide({ visible, show }) {

    const [userRole, setUserRole] = useState("");
    const[userName,setUserName] = useState("");
    const[entityName,setEntityName] = useState("");


    var navigate = useNavigate();

    useEffect(() => {
        Axios.get("http://localhost:3001/api/Home_status").then((response) => {
            console.log(response + "Dsadaaa")
            if (response.data.isLoggedIn) {
                console.log("hellpss")
                console.log("Meow", response.data.user[0].user_role);
                setUserRole(`/home_${response.data.user[0].user_role}`)
                setUserName(response.data.user[0].user_name);
                setEntityName(response.data.user[0].entity_name);
                // navigate(`/home_${response.data.user[0].user_role}`)
                return;
            } else {
                console.log("hellp")
                // setUserRole("/")
                navigate("/")
            }
        }
        )


    }, [])


    const logout = () => {
        Axios.get("http://localhost:3001/api/delete_session")
            .then((conf) => {
                Axios.delete();
                console.log(conf + "Dsdadsa")
                navigate("/")
            })
    }


    return (
        <>
            <div className="mobile-nav">
                <button
                    className="mobile-nav-btn"
                    onClick={() => show(!visible)}
                >
                    <FaBars size={24} />
                </button>
            </div>
            <nav className={!visible ? 'navbar' : ''}>
                <button
                    type="button"
                    className="nav-btn"
                    onClick={() => show(!visible)}
                >
                    {!visible
                        ? <FaAngleRight size={30} /> : <FaAngleLeft size={30} />}
                </button>
                <div>
                    <NavLink
                        className="logo"
                        to={"/profile"}
                    >
                        <img
                            src={require('../pagesCSS/male_ava.png')}
                            alt="logo"
                        />

                    </NavLink>
                    <p className='userName-navSide'>{userName}</p>
                    <p className='userName-navSide'>{entityName}</p>
                    <div className="links nav-top">
                        <NavLink to={userRole} className="nav-link">
                            <FaHome size={ICON_SIZE} />
                            <span>Home</span>
                        </NavLink>
                        <NavLink to="/search" className="nav-link">
                            <FaSearch size={ICON_SIZE} />
                            <span>Search</span>
                        </NavLink>
                        {/* <NavLink to="/orders" className="nav-link">
                            <FaShoppingCart size={ICON_SIZE} />
                            <span>Orders</span>
                        </NavLink> */}
                    </div>
                </div>

                <div className="links">
                    <NavLink to="/EditProfile" className="nav-link">
                        <FaCog size={ICON_SIZE} />
                        <span>Settings</span>
                    </NavLink>
                    <NavLink onClick={logout} className="nav-link">
                        <FaSignOutAlt size={ICON_SIZE} />
                        <span>Logout</span>
                    </NavLink>
                </div>
            </nav>
        </>
    );
}

export default NavSide;