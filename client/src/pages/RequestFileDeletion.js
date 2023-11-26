import { React, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Axios from 'axios';

export default function RequestFileDeletion() {
    const { title, id, user_id } = useParams();
    const [userInfo, setUserInfo] = useState([]);
    const [description, setDescription] = useState("");
    useEffect(() => {
        Axios.get("http://localhost:3001/api/Home_status").then((response) => {
            if (response.data.isLoggedIn) {
                setUserInfo(response.data.user[0]);

                return;
            } else {
                console.log("hellp")
                navigator("/")
            }
        }
        )
    }, [])

    const submitRequest = () => {
        Axios.post(`http://localhost:3001/api/create_requests`, {
            user_id: userInfo.user_id,
            user_name: userInfo.user_name,
            file_id: id,
            desc: description,
        }).then(() => {
            alert("The Request has been sent Sucessfully")
        })
    }

    return (
        <div className='FileHeader'>
            {/* RequestFileDeletion id={id} , user_id = {userInfo.user_name} and the title is : {title} */}
            <div className='form'>
                <div className='nameField'>
                    <p>Reason why you want to delete the file "{title}" : </p>
                    <input type="text"
                        placeholder='Enter the reason why you want to delete the file ..'
                        onChange={(event) => { setDescription(event.target.value) }} />
                    <button className='submitButton' onClick={submitRequest}>Send Request</button>
                </div>
            </div>
        </div>
    )
}
