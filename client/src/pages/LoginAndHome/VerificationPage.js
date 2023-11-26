import React, { useEffect, useState } from 'react';
// import './App.css';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

function VerificationPage() {

  const [verCode, setVerCode] = useState("");
  var navigate = useNavigate();
  var role;

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/api/login_status").then((response) => {
      console.log(response)
      if (response.data) {
      } else {
        navigate("/")
      }
    })
  }, [])


  const ver = () => {

    Axios.post("http://localhost:3001/api/verification", {
      verCode: verCode,

    }).then((response) => {

      // if (response.data.isLoggedIn){
      //   navigate("/")
      //   return;
      // }
      console.log(response)
      console.log("4213123")
      if (response.data.auth) {
        console.log("im here")
        role = response.data.user[0].user_role;
        navigate(`/home_${role}`)
      } else {
        console.log("Incorrect otp")
        navigate("/")
        return;
      }
    });
  };
  const HandleKey = (e) => {
    if (e.key === "Enter") {
      ver();
    }

  }

  return (
    <div className="App">
      {/* <form> */}
      <p>
        <label>varification code: </label>
        <input type="text" name='verCode' onKeyDown={HandleKey} onChange={(e) => {
          setVerCode(e.target.value)
        }} />
      </p>
      <p>
        <button type="button" onClick={ver}>Submit</button>
      </p>
      {/* </form> */}
    </div>
  );
}

export default VerificationPage;