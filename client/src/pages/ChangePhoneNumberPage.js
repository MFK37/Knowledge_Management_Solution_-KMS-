import React, { useEffect, useState } from 'react';
// import './App.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangePhoneNumberPage() {

  const navigate = useNavigate();

  const [currentPass, setCurrentPassword] = useState("");
  const [newPn, setnewPn] = useState("");
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

  const changePhoneNumber = () => {
    Axios.post("http://localhost:3001/api/edit_phonenumber", {
      id: id,
      currentPass: currentPass,
      pn: newPn,
    }).then(() => {
      // alert("sent");
      navigate(`/home_${role}`)
    });
  };

  return (

    <div className="FileHeader">
      <div className='form'>
        <h2>Change Phone number </h2>
        <div className='nameField'>
          <p>Current Password: </p>
          <input type="password" placeholder='Enter your current password' name='currentPass' onChange={(e) => {
            setCurrentPassword(e.target.value)
          }} />

          <p>New Phone number: </p>
          <input type="text" placeholder='Enter the new phone number' name='newPn' onChange={(e) => {
            setnewPn(e.target.value)
          }} />

        </div>



        <button type="button" className='submitButton' onClick={changePhoneNumber}>Submit</button>

      </div  >
    </div>
  );
}

export default ChangePhoneNumberPage;
