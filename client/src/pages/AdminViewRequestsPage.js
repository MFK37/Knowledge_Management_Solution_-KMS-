import React, { createElement, useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import 'C:/Users/Mohammed/Desktop/programing/VS/HTML/KMS-Project/client/src/App.css';
import Axios from 'axios';
import { Await, useNavigate } from 'react-router-dom';
import '../pagesCSS/AdminViewRequest.css'
import { BsFileEarmarkCheck, BsFileEarmarkX } from 'react-icons/bs'


// import { DataGrid } from '@mui/x-data-grid';

function AdminViewRequestsPage() {

  var navigate = useNavigate();

  const [reqData, setReqData] = useState([]);

  useEffect(() => {
    // const check = async () => {
    Axios.get("http://localhost:3001/api/Home_status").then((response) => {
      console.log(response + "Dsadaaa")
      if (response.data.isLoggedIn) {
        // console.log("hellpss")
        // console.log("Meow", response.data.user[0].userrole);
        if (response.data.user[0].user_role !== "Admin") {
          return navigate(`/home_${response.data.user[0].user_role}`)
        }

        Axios.get("http://localhost:3001/api/view_requests_admin")
          .then((response) => {
            console.log("im here\n " + response.data[0])
            var data = response.data
            // console.log(response.data.length)
            if (response.data.length > 0) {
              setReqData(data)
            }
          })

        return;
      } else {
        console.log("hellp")
        navigate("/")
      }
    })

  }, [])

  const back = () => {

    Axios.get(`http://localhost:3001/api/session_data`).then((respone) => {
      navigate(`/home_${respone.data.user[0].user_role}`)
    })

  };

  const accept = (req_id) => {
    // console.log("Accepted" + req_id)

    Axios.get(`http://localhost:3001/api/accept_requests/${req_id}`).then((respone) => {
      // console.log(respone.data);

      if (respone.data) {
        // console.log("de");
        window.location.reload();
      } else {
        // console.log("Wrong user id or password");
        alert("Something wrong try again !");
      }
    })

  }

  const reject = (req_id) => {
    console.log("rejected")

    var feedback = window.prompt("Enter your feedback (optional): ")

    Axios.post(`http://localhost:3001/api/reject_requests`, {
      req_id: req_id,
      feedback: feedback,
    }).then((respone) => {
      console.log(respone.data);

      if (respone.data) {
        // console.log("de");
        window.location.reload();
      } else {
        // console.log("Wrong user id or password");
      }
    })

    // console.log(feedback)
  }


  return (
    <div>
      <h1 id='welcome'>Welcome admin to view requests</h1>
      <h3 id="res"></h3>
      {/* <button onClick={back}>Back</button> */}
      {reqData.length === 0 ? <h2>No requests available</h2> :
        <div>
          <div className="Tablecontainer" id='con'>
            <h2>Available Requests</h2>

            <ul className="responsive-table" id='table'>

              <li className="table-header">
                <div className="col col-1"><b>Request ID</b></div>
                <div className="col col-2"><b>Initiator ID</b></div>
                <div className="col col-3"><b>Description</b></div>
                <div className="col col-4"><b>Status</b></div>
                <div className="col col-5"><b>Response</b></div>
              </li>

              {reqData.map((value) => {
                return (
                  <li className="table-row">
                    <div className="col col-1" data-label="Request ID">{value.request_id}</div>
                    <div className="col col-2" data-label="initiator_id">{value.initiator_id}</div>
                    <div className="col col-3" data-label="request description">{value.request_description}</div>
                    <div className="col col-4" data-label="Request Status">{value.request_status}</div>
                    <div className='col col-5' data-label="Buttons">
                      {/* <div className="accept_button" ><button onClick={() => { accept(value.request_id) }}>Accept</button></div> */}
                      <BsFileEarmarkCheck title='Accept request' color='green' cursor={"pointer"} onClick={() => { accept(value.request_id) }} size="23px" />
                      <BsFileEarmarkX title='Reject request' cursor={"pointer"} color='red' onClick={() => { reject(value.request_id) }} size="23px" />
                      {/* <div className="reject_button"><button onClick={() => { reject(value.request_id) }}>Reject</button></div> */}
                    </div>
                  </li>
                )
              })}

            </ul>

          </div>

        </div>}
    </div >
  );
}


export default AdminViewRequestsPage;