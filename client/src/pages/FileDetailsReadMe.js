import { React, useEffect, useState } from 'react'
import { useParams, Link, useNavigate, Outlet } from 'react-router-dom'
import Axios from 'axios'
import fileDownload from 'js-file-download';
import '../pagesCSS/FileDetails.css'
// import { FiEdit } from 'react-icons/fi'
import { RiFileEditFill } from 'react-icons/ri'
import { CgClose } from 'react-icons/cg'

// import { RxReader } from 'react-icons/rx';
// import { BsFillTagsFill } from 'react-icons/bs'
// import NavTab from './NavTab';


export default function FileDetailsReadMe() {
    const { id, version_id, name, Creator } = useParams();
    const navigator = useNavigate();
    // console.log(id);
    const [fileData, setFileData] = useState([]);
    const [userRole, setUserRole] = useState("");
    const [user_id, setUser_ID] = useState("");
    const [showFeedBack, setShowFeedBack] = useState(false);
    const [feedback, setFeedback] = useState("");


    useEffect(() => {
        Axios.get(`http://localhost:3001/api/get/file_header/${id}/${version_id}`).then((res, err) => {
            if (err) return console.log("Errr", err);
            setFileData(res.data);
        })
        Axios.get("http://localhost:3001/api/Home_status").then((response) => {
            // console.log(response + "Dsadaaa")
            if (response.data.isLoggedIn) {
                setUserRole(`${response.data.user[0].user_role}`)
                setUser_ID(response.data.user[0].user_id)
                // navigate(`/home_${response.data.user[0].user_role}`)
                return;
            } else {
                console.log("hellp")
                // setUserRole("/")
                navigator("/")
            }
        }
        )

    }, []);
    // console.log(fileData)
    const downloadFile = (id, file_name) => {
        Axios({
            url: `http://localhost:3001/files/${id}`,
            method: 'GET',
            responseType: 'blob', // Important
        }).then((res) => {
            console.log(res + "Downloaddd")
            fileDownload(res.data, `${file_name}.zip`);
        })
        // Axios.get({`http://localhost:3001/files/${id}`}).then((res) => {
        //     console.log(res.data);
        //     // fileDownload(res.data , "download.zip" )
        // })
    }
    const uploadRelease = (title, id) => {
        <Link to={`/newRelease/${title}/${id}`} ></Link>
        navigator(`/newRelease/${title}/${id}`);

    }
    const editfile = (title) => {
        navigator(`/editfile/${Creator}/${title}/${id}/${version_id}`);
    }

    const requestFileDeletion = (title, id) => {
        // navigator(`/requestFileDeletion/${title}/${id}/${user_id}`);
        ToggleFeedback();
    }

    const ToggleFeedback = () => {
        setShowFeedBack(!showFeedBack);
        console.log("FeedBack isss " + showFeedBack);
    }

    const submitFeedback = (user_id, user_name, file_id, description) => {
        if (feedback === "") return alert("Please fill all the information")
        Axios.post(`http://localhost:3001/api/create_requests`, {
            user_id: user_id,
            user_name: user_name,
            file_id: file_id,
            desc: feedback,
        }).then(() => {
            alert("The Request has been sent Sucessfully")
            window.location.reload();
        })
    }

    return (
        <div>
            {userRole === "User" ? <div>
                {fileData.map((value) => {
                    return (
                        <div className='FileCard'>
                            <div className='FileCardLeft'>
                                <div className='title'>
                                    <h3>{value.name}</h3>
                                </div>
                                <div className='personalInfo'>
                                    <p className='creator'>Created By : <Link to={`/profile/${value.Creator}/${value.Creator_id}`}>{value.Creator}</Link></p>
                                </div>
                                <p className='descHeader'>Description :</p>
                                <p className='Desc' dangerouslySetInnerHTML={{ __html: value.description }}></p>
                                <p className='tagsHeader'>Tags : </p>
                                <div className='tagsKey'>{value.tags.split(",").map((tagsValue) => {
                                    return <div className='tagsKeyword'><Link to={`/search/${tagsValue}`} >{tagsValue}</Link></div>;
                                })}</div>
                            </div>
                            <div className='FileCardRight'>
                                <button onClick={() => { downloadFile(value.file_id, value.name) }}>Download</button>
                            </div>
                            {/* <p className='Desc'>Description : {value.description}</p> */}

                        </div>);
                })}

            </div> : // Else if the user_role is not a USER ! 
                <div>
                    {fileData.map((value) => {
                        return (
                            <div className='FileCard'>
                                <div className='FileCardLeft'>
                                    <div className='title'>
                                        <h3>{value.name}</h3>
                                        {parseInt(user_id) === value.Creator_id || userRole === "Admin" ? <RiFileEditFill onClick={() => { editfile(value.name) }} />
                                            : ""}
                                    </div>
                                    <div className='personalInfo'>
                                        <p className='creator'>Created By : <Link to={`/profile/${value.Creator}/${value.Creator_id}`}>{value.Creator}</Link></p>
                                        {/* <p className='entity_name'>Working in : {value.entity_name}</p> */}
                                    </div>
                                    <p className='descHeader'>Description :</p>
                                    <p className='Desc' dangerouslySetInnerHTML={{ __html: value.description }}></p>
                                    <p className='tagsHeader'>Tags : </p>
                                    <div className='tagsKey'>{value.tags.split(",").map((tagsValue) => {
                                        return <div className='tagsKeyword'><Link to={`/search/${tagsValue}`} >{tagsValue}</Link></div>;
                                    })}</div>
                                </div>
                                <div className='FileCardRight'>
                                    <button onClick={() => { downloadFile(value.file_id, value.name) }}>Download</button>
                                    {version_id === "1" ? <button onClick={() => { uploadRelease(value.name, value.file_id) }}>Upload New Release</button>
                                        :
                                        ""}
                                    {/* {parseInt(user_id) === value.Creator_id || userRole === "Admin" ? <button onClick={() => { requestFileDeletion(value.name, value.file_id) }}>Request file deletion</button> */}
                                    {parseInt(user_id) === value.Creator_id || userRole === "Admin" ? <button onClick={requestFileDeletion}>Request file deletion</button>

                                        : ""}
                                </div>
                                {/* <p className='Desc'>Description : {value.description}</p> */}
                                {showFeedBack ? <div className='feedback-res'>
                                    <div className='feedback-overlay' onClick={ToggleFeedback}></div>
                                    <div className='feedback-content'>
                                        <h3>Enter the reason why you want to delete this file : </h3>
                                        {/* <p>{feedback}</p> */}
                                        <input type={"text"} onChange={(e) => { setFeedback(e.target.value) }} />
                                        <CgClose cursor={"pointer"} size={"30px"} onClick={ToggleFeedback} />
                                        <button type="button" className='submitButton' onClick={() => { submitFeedback(value.Creator_id, value.Creator, value.file_id) }}>Submit</button>

                                    </div>
                                </div> : ""}

                            </div>);
                    })}



                </div>}
        </div>
    )
}
