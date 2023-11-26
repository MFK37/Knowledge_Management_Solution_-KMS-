// import React, { useEffect, useState } from 'react';
// // import 'C:/Users/Mohammed/Desktop/programing/VS/HTML/IS499/front/src/App.css';
// import Axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../LoginAndHomeCss/Login.css'
// import LoginImg from '../LoginAndHomeCss/login-img.webp'
// import LogImggg from '../../pagesCSS/bg-login.png'

// function LoginPage() {

//   var navigate = useNavigate();

//   const [userid, setUserid] = useState("");
//   const [password, setPassword] = useState("");
//   const [validation, setValidation] = useState("");

//   Axios.defaults.withCredentials = true;

//   const login = () => {
//     if (userid === "" || password === "") return setValidation("Wrong User ID / Password , Try Again !")
//     console.log(userid + "dsasdzzzzzzzzzzdasd" + password)
//     Axios.post("http://localhost:3001/api/login", {
//       userid: userid,
//       password: password,
//     }).then((respone) => {
//       console.log(respone.data);

//       if (respone.data.correctCredentials) {
//         console.log("logged in");
//         navigate("/verification");
//       } else {
//         console.log("Wrong user id or password");
//         setValidation("Wrong User ID / Password , Try Again !")
//       }
//     })
//   };

//   useEffect(() => {
//     Axios.get("http://localhost:3001/api/login_status").then((response) => {
//       console.log(response + "Dsadaaa")

//       if (response.data.isLoggedIn) {
//         console.log("hellpss, Login")
//         navigate(`/home_${response.data.user[0].user_role}`)
//       } else {
//         console.log("hellp")

//       }
//     })
//   }, [])

//   const HandleKey = (e)=>{
//     if(e.key === "Enter"){
//       login();
//     }
//   }

//   return (
//     <div className="Login">
//       <div className='LoginContainer'>
//         <div className='leftSideLogin'>
//           <img className='imgContent' src={LoginImg} alt="Login-img" />
//         </div>
//         <div className='rightSideLogin' >
//           <h1>Login</h1>
//           <div className='Login-box'>
//             <input type="text" required name='userid' onKeyDown={HandleKey} onChange={(e) => {
//               setUserid(e.target.value)
//             }} />
//             <span>User ID</span>
//           </div>
//           <div className='Login-box'>
//             <input type="password" required name='password' onKeyDown={HandleKey} onChange={(e) => {
//               setPassword(e.target.value)
//             }} />
//             <span>Password</span>
//           </div>
//           <p>{validation !== "" ? "Wrong User ID / Password , Try Again !" : ""}</p>
//           <button className='Login-button' onClick={login} type="button" >SUBMIT</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;

import React, { useEffect, useState } from 'react';
// import 'C:/Users/Mohammed/Desktop/programing/VS/HTML/IS499/front/src/App.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../LoginAndHomeCss/Login.css'
import LoginImg from '../../pagesCSS/Logo.png'



function LoginPage() {

  const navigate = useNavigate();
  var role;

  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [verCode, setVerCode] = useState("");
  const [page, setPage] = useState(true);
  const [validation, setValidation] = useState("");


  Axios.defaults.withCredentials = true;

  // useEffect(() => {
  //   Axios.get("http://localhost:3001/api/login_status").then((response) => {
  //     console.log(response + "Dsadaaa")

  //     if (response.data.isLoggedIn) {
  //       console.log("hellpss")
  //       navigate(`/home_${response.data.user[0].user_role}`)
  //     } else {
  //       console.log("hellp")

  //     }
  //   })
  // }, [])
  useEffect(() => {
    Axios.get("http://localhost:3001/api/Home_status").then((response) => {
      if (response.data.isLoggedIn) {
        navigate(`/home_${response.data.user[0].user_role}`)
      } else {
        navigator("/")
      }
    }
    )
  }, [])

  const HandleKey = (e) => {
    if (e.key === "Enter") {
      rend();
    }
  }

  const rend = () => {
    if (page) {

      if (userid === "" || password === "") return alert("Please Fill all the information")
      setValidation("")
      console.log(userid + "dsasdzzzzzzzzzzdasd" + password)
      Axios.post("http://localhost:3001/api/login", {
        userid: userid,
        password: password,
      }).then((respone) => {
        console.log(respone.data);

        if (respone.data.correctCredentials) {
          console.log("logged in");
          setPage(!page)
        } else {
          console.log("Wrong user id or password");
          setValidation("Wrong !")
        }
      })

      console.log(userid + " Hello " + password)
    }

    else {

      Axios.post("http://localhost:3001/api/verification", {
        verCode: verCode,

      }).then((response) => {
        // console.log(response)
        // console.log("4213123")
        if (response.data.auth) {
          // console.log("im here")
          role = response.data.user[0].user_role;
          navigate(`/home_${role}`)
        } else {
          console.log("Incorrect otp")
          setValidation("Wrong !")
        }
      });
    }
  }

  const opacity = () => {
    // document.getElementById("122").style.transition = "2s";
    document.getElementById("122").className = "Ver-Form2";


  }


  return (
    <div className="Login">

      <div className='LoginContainer'>

        {/* <div className='leftSideLogin'> */}
        {/* <img className='imgContent' src={LoginImg} alt="Login-img" /> */}
        {/* </div> */}

        <div className='rightSideLogin'>
          <div className="Logo-login">
            {/* <img src={LoginImg} alt='Logo' sizes='100px' /> */}
            {/* <p>KMS</p> */}
            {/* <p className='Logo-login-text'>KMS</p> */}
          </div>

          {page ?

            <div className='Login-Form' id="12">

              <img className='imgContent' src={LoginImg} alt="Login-img" />

              <h1 className='loginTitle'>Login</h1>

              <div className='Login-box'>

                <input type="text" required name='userid' onKeyDown={HandleKey} onChange={(e) => { setUserid(e.target.value) }} />
                <span>User ID</span>

              </div>

              <div className='Login-box'>
                <input type="password" required name='password' onKeyDown={HandleKey} onChange={(e) => { setPassword(e.target.value) }} />
                <span>Password</span>
              </div>
              <p style={{ color: "red" }}>{validation !== "" ? "Wrong User ID / Password" : ""}</p>
              <button className='Login-button' onClick={rend} type="button" >SUBMIT</button>

            </div>

            :

            <div id="122" className="Ver-Form" >
              {/* {document.getElementById("122").className="Ver-Form2"} */}
              <img className='imgContent' src={LoginImg} alt="Login-img" />

              <h1 className='loginTitle'>Verification</h1>

              <div className='Login-box'>

                <input type="text" required value={verCode} accept='' onKeyDown={HandleKey} name='verCode' id='ver' onChange={(e) => { setVerCode(e.target.value) }} />
                <span>Varification code</span>

              </div>
              <p style={{ color: "red" }}>{validation !== "" ? "Incorrect OTP" : ""}</p>
              <button className='Login-button' onClick={rend} type="button" >SUBMIT</button>
            </div>

          }
          {/* {opacity} */}




          {/* <button className='Login-button' onClick={rend} type="button" >SUBMIT</button> */}

        </div>


      </div>

    </div>
  );
}

export default LoginPage;