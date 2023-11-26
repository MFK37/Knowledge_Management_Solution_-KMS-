import { React, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MdCancel } from 'react-icons/md'



export default function FileEdit() {
    const { Creator, title, id, version_id } = useParams();
    const [name, setName] = useState("");
    const [fileData, setFileData] = useState([])
    const [desc, setDesc] = useState("");
    const [tags, setTags] = useState([]);
    const navigator = useNavigate();

    useEffect(() => {
        console.log("Before")
        Axios.get(`http://localhost:3001/api/get/file_header/${id}/${version_id}`)
            .then((response) => {
                console.log("After")
                setFileData(response.data);
                setName(response.data[0].name)
                setDesc(response.data[0].description)
                setTags(response.data[0].tags.split(","))
                // console.log(response.data[0].tags.split(","))
            })
    }, []);

    const HandleTags = (e) => {
        // console.log(tags);
        if (e.key !== 'Enter') {
            return;
        }
        const val = e.target.value;
        if (val === "") return;
        // if(tags.length === 0) setTags([tags,val]);
        setTags([...tags, val])
        e.target.value = "";
    }

    const removeTags = (index) => {
        // console.log(tags[index])
        setTags(tags.filter((element, ind) => ind !== index));
    }

    const submitData = () => {
        Axios.post(`http://localhost:3001/api/edit_file/${id}/`, {
            filename: name,
            fileDesc: desc,
            fileTags: tags.toString()
        }).then(() => {
            alert("Success");
            // window.location.reload();
            navigator(`/${Creator}/${title}/${id}/${version_id}`);

        })
    }


    return (
        <div className='FileHeader'>
            {fileData.map((val, index) => {
                return (
                    <div className='form'>
                        <h3>Edit File {val.name}</h3>
                        <div className='nameField'>
                            <p>Name :</p>
                            <input type="text" value={name} placeholder='Enter the name of the file ..' onChange={(e) => { setName(e.target.value) }} />
                        </div>
                        <div className='descField'>
                            <p>Description :</p>
                            <ReactQuill theme="snow" value={desc} onChange={setDesc} className="desc" />

                        </div>
                        {/* <input type="text" placeholder='Enter the Description of the file ..' onChange={(e) => { setDesc(e.target.value) }} /> */}
                        <div className='tagsField'>
                            <p>Tags :</p>
                            <div className='tags-container'>
                                {tags.map((value, index) => {
                                    return (<div className='tagResult' key={index}>
                                        <span className='tagItem'>{value}</span>
                                        <span className='tagDelete' onClick={() => { removeTags(index) }}><MdCancel /></span>
                                    </div>
                                    )
                                })}
                                <input type="text" className='tagInput' placeholder='Enter the tags of the file ..' onKeyDown={HandleTags} />
                            </div>
                        </div>
                        <button className='submitButton' onClick={submitData}>Update File</button>
                    </div>

                )
            })}
        </div>
    )
}
