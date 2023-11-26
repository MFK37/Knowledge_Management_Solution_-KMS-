import React, { useEffect, useState } from 'react';
// import './App.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangePasswordPage() {

  const navigate = useNavigate();

  const [currentPass, setCurrentPassword] = useState("");
  const [newPass, setNewPassword] = useState("");
  var id, role;

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/api/session_data").then((response) => {
      console.log(response.data.isLoggedIn + "213")

      if (response.data.isLoggedIn) {
        console.log("hello")
        document.getElementById("name").innerHTML += response.data.user[0].user_name;
        id = response.data.user[0].user_id;
      } else {
        navigate("/")
      }
    })
  }, [])

  const changePassword = () => {
    Axios.post("http://localhost:3001/api/change_password", {
      id: id,
      currentPass: currentPass,
      newPass: newPass,
    }).then(() => {
      alert("password changed !");
      navigate(`/home_${role}`)
    });
  };

  return (
    <div className="FileHeader">
      <div className='form'>
        <div className='nameField'>
          <p>Current Password: </p>
          <input type="password" placeholder='Enter your current password' name='currentPass' onChange={(e) => {
            setCurrentPassword(e.target.value)
          }} />

          <p>New Password: </p>
          <input type="password" placeholder='Enter the new password' name='newPass' onChange={(e) => {
            setNewPassword(e.target.value)
          }} />

        </div>

        <button type="button" className='submitButton' onClick={changePassword}>Submit</button>
      </div>
    </div>
  );
}

export default ChangePasswordPage;