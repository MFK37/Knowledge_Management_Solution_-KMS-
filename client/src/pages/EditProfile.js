import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './App.css';
// import Axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import '../App.css'
// import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import '../pagesCSS/home.css'
// import { FiUpload, FiSearch } from 'react-icons/fi'
// import { TfiSearch, TfiViewListAlt } from 'react-icons/tfi'
// import { BiSearchAlt2 } from 'react-icons/bi'
// import { TbEditCircle } from 'react-icons/tb'
// import { VscOpenPreview } from 'react-icons/vsc'
// import { RiUserSettingsLine } from 'react-icons/ri'
import {MdPassword,MdSettingsPhone} from 'react-icons/md'
// import {AiOutlineNumber} from 'react-icons/Ai'
import {RiMailSettingsLine} from 'react-icons/ri'

export default function EditProfile() {

  return (
    <div className='Home'>
        <div className='container'>
            <h2 className='main-title'>Services</h2>
            <div className='services-list'>
                <Link to={"/change_password"}>
                    <div className='box'>
                        <span className='imgBox'><MdPassword size={"60px"} /></span>
                        {/* <span className='imgBox'><GrUpload  size={"60px"} viewBox="0 0 25 30" /></span> */}

                        <h3 className='box-title'>Change Password</h3>
                        <p className='box-desc'>Password Changing </p>
                    </div></Link>
                <Link to={"/edit_email"}>
                    <div className='box'>
                        <span className='imgBox'><RiMailSettingsLine size={"60px"} /></span>
                        <h3 className='box-title'>Edit E-Mail</h3>
                        <p className='box-desc'>Edit E-Mail </p>
                    </div></Link>
                <Link to={"/edit_phonenumber"}>
                    <div className='box'>
                        <span className='imgBox'><MdSettingsPhone size={"60px"}/></span>
                        <h3 className='box-title'>Edit Phone Number</h3>
                        <p className='box-desc'>Edit Phone Number </p>
                    </div>
                </Link>
            </div>
        </div>
    </div >
);
}
