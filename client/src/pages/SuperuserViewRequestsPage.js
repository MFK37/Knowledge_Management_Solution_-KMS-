import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import 'C:/Users/Mohammed/Desktop/programing/VS/HTML/KMS-Project/client/src/App.css';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { DataGrid } from '@mui/x-data-grid';
import {CgClose} from 'react-icons/cg'
function SuperuserViewRequestsPage() {

    var navigate = useNavigate();

    const [reqData, setReqData] = useState([]);
    const [showFeedBack, setShowFeedBack] = useState(false);
    const[feedback,setFeedback] = useState("");

    useEffect(() => {
        // const check = async () => {
        Axios.get("http://localhost:3001/api/Home_status").then((response) => {
            console.log(response + "Dsadaaa")
            if (response.data.isLoggedIn) {
                console.log("hellpss")
                console.log("Meow", response.data.user[0].userrole);
                if (response.data.user[0].user_role !== "Superuser") {
                    return navigate(`/home_${response.data.user[0].user_role}`)
                  }
                // navigate(`/home${response.data.user[0].user_role}`)

                Axios.get(`http://localhost:3001/api/view_requests_superuser/${response.data.user[0].user_id}`)
                    .then((response) => {
                        console.log("im here\n " + response.data[0])
                        console.log(response.data.length)
                        var data = response.data;
                        setReqData(data)
                    })

                return;
            } else {
                console.log("hellp")
                // setUserRole("/")
                navigate("/")
            }
        })
    }, [])

    const back = () => {

        Axios.get(`http://localhost:3001/api/session_data`).then((respone) => {
            navigate(`/home_${respone.data.user[0].user_role}`)
        })

    };

    const getFeedback = (req_id) => {

        Axios.get(`http://localhost:3001/api/get_feedback/${req_id}`).then((respone) => {

            if (respone.data.length !== 0) {
                // window.alert(respone.data[0].request_feedback)
                setFeedback(respone.data[0].request_feedback);
                ToggleFeedback();
            }

        })

    };

    const ToggleFeedback = () => {
        setShowFeedBack(!showFeedBack);
        console.log("FeedBack isss " + showFeedBack);
    }

    return (
        <div>
            <h1 id='welcome'>Welcome to view requests</h1>
            <h3 id="res"></h3>
            {/* <button onClick={back}>Back</button> */}

            {reqData.length === 0 ? <h3>No requests available</h3> :
                <div>
                    <div className="Tablecontainer" id='con'>
                        <h2>Available Requests</h2>

                        <ul className="responsive-table" id='table'>

                            <li className="table-header">
                                <div className="col col-1"><b>Request ID</b></div>
                                <div className="col col-2"><b>Description</b></div>
                                <div className="col col-3"><b>Status</b></div>
                            </li>

                            {
                                reqData.map((value) => {
                                    return (
                                        <li className="table-row">
                                            <div className="col col-1" data-label="Request ID">{value.request_id}</div>
                                            <div className="col col-2" data-label="request description">{value.request_description}</div>
                                            <div class="col col-3" data-label="Request Status">{value.request_status === "Rejected" ? <button onClick={() => { getFeedback(value.request_id) }}>{value.request_status}</button> : value.request_status}</div>
                                        </li>
                                    )
                                })
                            }
                        </ul>

                        {showFeedBack ? <div className='feedback-res'>
                            <div className='feedback-overlay' onClick={ToggleFeedback}></div>
                            <div className='feedback-content'>
                                <h2>The reason why it's rejected : </h2>
                                <p>{feedback}</p>
                                <CgClose cursor={"pointer"} size={"30px"}  onClick={ToggleFeedback} />
                            </div>
                        </div> : ""}

                    </div>
                </div>}

        </div >
    );
}


export default SuperuserViewRequestsPage;