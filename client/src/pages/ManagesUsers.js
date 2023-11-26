import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { FaUserEdit, FaUserAltSlash, FaUserMinus, FaUserPlus } from 'react-icons/fa'
import { MdPersonRemoveAlt1 } from 'react-icons/md'
import { CgClose } from 'react-icons/cg'


function ManagesUsers() {

    var navigate = useNavigate();

    const [reqData, setReqData] = useState([]);
    const [showFeedBack, setShowFeedBack] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [userID, setUserID] = useState('');
    const [username, setUsername] = useState("");
    const [userPass, setUserPass] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [Email, setEmail] = useState("");


    useEffect(() => {
        // const check = async () => {
        Axios.get("http://localhost:3001/api/Home_status").then((response) => {
            console.log(response + "Dsadaaa")
            if (response.data.isLoggedIn) {
                if (response.data.user[0].user_role !== "Admin") {
                    return navigate(`/home_${response.data.user[0].user_role}`)
                }
                // console.log("hellpss")
                // console.log("Meow", response.data.user[0].userrole);
                // navigate(`/home${response.data.user[0].user_role}`)

                Axios.get("http://localhost:3001/api/getAlluserinfo")
                    .then((response) => {
                        // console.log("im here USer INFOO O  " + response.data[0])
                        var data = response.data
                        // console.log(response.data.length)
                        if (response.data.length > 0) {
                            setReqData(data)
                        }
                    })
                return;
            } else {
                // console.log("hellp")
                navigate("/")
            }
        })

    }, [])

    const back = () => {

        Axios.get(`http://localhost:3001/api/session_data`).then((respone) => {
            navigate(`/home_${respone.data.user[0].user_role}`)
        })

    };
    const deleteUser = (user_id) => {
        console.log("Delete user")
        let text = "Are you sre that you want to delete this user ? ";
        if (window.confirm(text) === true) {
            {/* window.confirm will provide a prompt to let us make sure that our decision is the desired decision */ }
            console.log("You pressed OK!")
            Axios.get(`http://localhost:3001/api/delete_users/${user_id}`).then(() => {
                alert("User has been deleted Successfully !");
                window.location.reload();

            })

        } else {
            console.log("You pressed Canceled !")
        }

    }

    const givePermission = (user_id) => {
        let text = "Are you sre that you want to give a permission to this user ? ";
        if (window.confirm(text) === true) {
            console.log("You pressed OK!")
            Axios.get(`http://localhost:3001/api/give_permission/${user_id}`).then(() => {
                alert("The user has been upgraded sucessfully ! ")
                window.location.reload();
            })
        } else {
            console.log("You pressed Canceled !")
        }
    }
    const removePermission = (user_id) => {
        let text = "Are you sre that you want to remove the permission from this user ? ";
        if (window.confirm(text) === true) {
            console.log("You pressed OK!")
            Axios.get(`http://localhost:3001/api/remove_permission/${user_id}`).then(() => {
                alert("The user has been downgraded sucessfully ! ")
                window.location.reload();
            })

        } else {
            console.log("You pressed Canceled !")
        }
    }

    const ToggleFeedback = () => {
        setShowFeedBack(!showFeedBack);
        // console.log("FeedBack isss " + showFeedBack);
    }

    const getUserInfo = (userid) => {
        Axios.get(`http://localhost:3001/api/getUserinfo/${userid}`).then((res) => {
            // console.log("Here in user info" , res.data)
            setUserID(res.data[0].user_id);
            setUsername(res.data[0].user_name);
            setUserPass(res.data[0].user_password);
            setEmail(res.data[0].email);
            setPhoneNumber(res.data[0].phone_number);

            ToggleFeedback();
        })

    }

    const updateUser = () => {
        Axios.post(`http://localhost:3001/api/edit_users`, {
            user_id: userID,
            username: username,
            password: userPass,
            phone_number: phoneNumber,
            email: Email,
        }).then(() => {
            alert("Updated ! ");
            window.location.reload();
        })
    }
    return (
        <div>
            <h1 id='welcome'>Welcome admin to Manage Users Page </h1>
            {/* <h3 id="res"></h3> */}
            {/* <button onClick={back}>Back</button> */}

            <div className="Tablecontainer" id='con'>
                <h2>List of users: </h2>

                <ul className="responsive-table" id='table'>

                    <li className="table-header">
                        <div className="col col-1"><b>User ID</b></div>
                        <div className="col col-2"><b>Username</b></div>
                        <div className="col col-3"><b>Entity name</b></div>
                        <div className="col col-4"><b>User Role</b></div>
                        <div className="col col-5"><b>Response</b></div>
                    </li>

                    {reqData.map((value) => {
                        return (
                            <li className="table-row">
                                <div className="col col-1" data-label="Request ID">{value.user_id}</div>
                                <div className="col col-2" data-label="initiator_id">{value.user_name}</div>
                                <div className="col col-3" data-label="request description">{value.entity_name}</div>
                                <div className="col col-4" data-label="Request Status">{value.user_role}</div>
                                {/* <div className="col col-4" data-label="Request Status">{"For testing"}</div> */}
                                <div className='col col-5'>
                                    <div className='icons-col' >
                                        <FaUserEdit title='Edit User' onClick={() => { getUserInfo(value.user_id) }} />  {/* Edit User info */}
                                        <FaUserAltSlash title='Delete User' onClick={() => { deleteUser(value.user_id) }} /> {/* Delete User  */}
                                        <FaUserPlus title='Upgrade User' onClick={() => { givePermission(value.user_id) }} /> {/* Give Permission */}
                                        <FaUserMinus title='Downgrade User' onClick={() => { removePermission(value.user_id) }} /> {/* Remove permission */}
                                    </div>
                                </div>
                                {showFeedBack ? <div className='feedback-res'>
                                    <div className='feedback-overlay' onClick={ToggleFeedback}></div>
                                    <div className='feedback-content'>
                                        <h2>Edit User :  </h2>
                                        <div className="m">
                                            <p>Username : </p>
                                            <input type={"text"} placeholder="Enter the username" value={username} onChange={(e) => { setUsername(e.target.value) }} />
                                        </div>
                                        <div className='nameField'>
                                            <p>Password : </p>
                                            <input type={"password"} placeholder="Enter the password" value={userPass} onChange={(e) => { setUserPass(e.target.value) }} />
                                        </div>
                                        <div className='nameField'>
                                            <p>Email : </p>
                                            <input type={"text"} placeholder="Enter the email" value={Email} onChange={(e) => { setEmail(e.target.value) }} />
                                        </div>
                                        <div className='nameField'>
                                            <p>Phone number : </p>
                                            <input type={"text"} placeholder="Enter the phonenumber" value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value) }} />
                                        </div>
                                        <CgClose cursor={"pointer"} size={"30px"} onClick={ToggleFeedback} />
                                        <button className='submitButton' onClick={updateUser}>Update User</button>
                                    </div>
                                </div> : ""}
                            </li>


                        )
                    })}

                    {/* <div dangerouslySetInnerHTML={{ __html: li }} /> */}
                </ul>

            </div>

        </div >
    );
}


export default ManagesUsers;