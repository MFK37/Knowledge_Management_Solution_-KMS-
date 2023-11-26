import { React, useEffect, useState } from 'react'
import Axios from 'axios';
import { Link, useParams } from 'react-router-dom'


export default function UserProfileUploads() {
    const { Creator, Creator_id } = useParams();
    const [userUploads, setuserUploads] = useState([]);

    useEffect(() => {
        Axios.get(`http://localhost:3001/api/get/Profile_uploads/${Creator_id}`).then((res) => {
            console.log("Uplaodsosjoidjsoai")
            setuserUploads(res.data);
            //   console.log(userUploads)
        })
    }, [])
    return (
        <div>
            {userUploads.length === 0 ? "You haven't uploaded any file "
                :
                <div className='displayResult'><h3>Files of the user : {Creator}</h3>
                    {userUploads.map((value) => {
                        return (
                            <div className='contentCard'>
                                <Link to={`/${value.Creator}/${value.name}/${value.header_id}/${value.release_id}`}>
                                    <p className='title'>{value.name}</p>
                                </Link>
                                <div className='desc-content'>{value.brief_desc}</div>
                                <div className='tagsKey'>{value.tags.split(",").map((tagsValue) => {
                                    return <div className='tagsKeyword'><Link to={`/search/${tagsValue}`} >{tagsValue}</Link></div>;
                                })}</div>
                                <div className='fileInformation'>
                                    <div className='createdBy'></div>
                                    <div className='dateFile'>{value.date}</div>
                                </div>

                                {/* <div className='downloadButton'><button onClick={() => { downloadFile(value.file_id, value.name) }}>Download</button></div> */}
                            </div>
                        );
                    })}
                </div>

            }

        </div>
    )
}
