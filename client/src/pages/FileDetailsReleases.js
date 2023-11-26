import { React, useEffect, useState } from 'react'
import { useParams, Link, useNavigate, Outlet } from 'react-router-dom'
import Axios from 'axios'
import fileDownload from 'js-file-download';
import '../pagesCSS/FileDetails.css'

export default function FileDetailsReleases() {
    const { id, version_id, name, Creator } = useParams();
    const navigator = useNavigate();
    const [fileData, setFileData] = useState([]);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        Axios.get(`http://localhost:3001/api/get/file_header/${id}`).then((res, err) => {
            if (err) return console.log("Errr", err);
            setFileData(res.data);
        })

        Axios.get("http://localhost:3001/api/Home_status").then((response) => {
            console.log(response + "Dsadaaa")
            if (response.data.isLoggedIn) {
                setUserRole(`${response.data.user[0].user_role}`)
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
            // console.log(res)
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

    return (
        <div>

            {userRole === "User" ? <div>
                {fileData.length === 0 ? "There's no versions" :
                    <div>
                        {fileData.map((value) => {
                            return (
                                <div className='FileCard'>
                                    <div className='FileCardLeftRelease'>
                                        <Link to={`/${value.Creator}/${value.name}/${value.header_id}/${value.release_id}`}>
                                            <h3 className='title'>{value.name} | version : v{value.release_id}</h3>
                                        </Link>
                                        <div className='personalInfo'>
                                            <p className='creator'>Created By : {value.Creator}</p>
                                            {/* <p className='entity_name'>Working in : {value.entity_name}</p> */}
                                        </div>

                                        {/* <p className='creatorRelease'>Created By : {value.super_name}</p>
                                <p className='entity_nameRelease'>Working in : {value.entity_name}</p> */}
                                        <p className='Desc' dangerouslySetInnerHTML={{ __html: value.description }}></p>
                                    </div>
                                    <div className='FileCardRightRelease'>
                                        <button onClick={() => { downloadFile(value.file_id, value.name) }}>Download</button>
                                    </div>

                                    {/* <p className='Desc'>Description : {value.description}</p> */}

                                </div>);
                        })}

                    </div>
                }
            </div> : // Else if the user_role is not a USER !

                <div>
                    {fileData.length === 0 ? "There's no versions" : <div>
                        {fileData.map((value) => {
                            return (
                                <div className='FileCard'>
                                    <div className='FileCardLeftRelease'>
                                        <Link to={`/${value.Creator}/${value.name}/${value.header_id}/${value.release_id}`}>
                                            <h3 className='title'>{value.name} | version : v{value.release_id}</h3>
                                        </Link>
                                        <div className='personalInfo'>
                                        <p className='creator'>Created By : <Link to={`/profile/${value.Creator}/${value.Creator_id}`}>{value.Creator}</Link></p>
                                            {/* <p className='entity_name'>Working in : {value.entity_name}</p> */}
                                        </div>

                                        {/* <p className='creatorRelease'>Created By : {value.super_name}</p>
                                <p className='entity_nameRelease'>Working in : {value.entity_name}</p> */}
                                        <p className='Desc' dangerouslySetInnerHTML={{ __html: value.brief_desc }}></p>
                                    </div>
                                    <div className='FileCardRightRelease'>
                                        <button onClick={() => { downloadFile(value.file_id, value.name) }}>Download</button>
                                        {/* <button onClick={() => { uploadRelease(value.name, value.file_id) }}>Upload New Release</button> */}
                                    </div>

                                    {/* <p className='Desc'>Description : {value.description}</p> */}

                                </div>);
                        })}

                    </div>}

                </div>}
        </div>
    )
}
