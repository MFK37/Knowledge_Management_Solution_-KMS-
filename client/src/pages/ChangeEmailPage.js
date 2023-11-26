import React, { useEffect, useState } from 'react';
// import './App.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangeEmailPage() {

  const navigate = useNavigate();

  const [currentPass, setCurrentPassword] = useState("");
  const [newEmail, setnewEmail] = useState("");
  var id, role;

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/api/session_data").then((response) => {
      console.log(response.data.isLoggedIn + "213")

      if (response.data.isLoggedIn) {
        console.log("hello")
        document.getElementById("name").innerHTML += response.data.user[0].user_name;
        id = 'response.data.user[0].user_id';
      } else {
        navigate("/")
      }
    })
  }, [])

  const changeEmail = () => {
    Axios.post("http://localhost:3001/api/edit_email", {
      id: id,
      currentPass: currentPass,
      newEmail: newEmail,
    }).then(() => {
      // alert("sent");
      navigate(`/home_${role}`)
    });
  };

  return (
    <div className="FileHeader">
      {/* <form> */}
      <div className='form'>
        <h2>Change Email </h2>
        <div className='nameField'>
          <p>Current Password: </p>
          <input type="password" placeholder='Enter your current password' name='currentPass' onChange={(e) => {
            setCurrentPassword(e.target.value)
          }} />


          <p>New E-Mail: </p>
          <input type="email" placeholder='Enter the new email' name='newEmail' onChange={(e) => {
            setnewEmail(e.target.value)
          }} />

        </div>


        <button type="button" className='submitButton' onClick={changeEmail}>Submit</button>

      </div>

      {/* </form> */}
    </div>
  );
}

export default ChangeEmailPage;
