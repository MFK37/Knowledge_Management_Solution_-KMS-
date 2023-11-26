import { React, useState, useRef, useEffect } from 'react'
import Axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MdCancel } from 'react-icons/md'
import { CgFileRemove } from 'react-icons/cg'



export default function FileRelease() {
    const { title, id } = useParams();
    const [desc, setDesc] = useState("");
    const [briefDesc, setBriefDesc] = useState("");
    const [tags, setTags] = useState([]);
    const [uploadedFile, setUploadedFile] = useState([]);
    const inputRef = useRef();
    var navigate = useNavigate();

    useEffect(() => {
        Axios.get("http://localhost:3001/api/Home_status").then((response) => {
            if (response.data.isLoggedIn) {
                // setUserRole(`${response.data.user[0].user_role}`)
                if (response.data.user[0].user_role === "User") {
                    return navigate(`/home_User`)
                }
                return;
            } else {
                navigator("/")
            }
        }
        )
    }, [])


    const submitNewRelease = () => {
        Axios.post(`http://localhost:3001/api/insert/file_header/${title}/${id}`, {
            fileBriefDesc: briefDesc,
            fileDesc: desc,
            fileTags: tags.toString(),
        }).then(() => {
            alert("Success");
            window.location.reload();
        })

        if (uploadedFile.length === 0) {
            return alert("Please select a file !");
        }

        const formData = new FormData();
        for (const i in uploadedFile) {
            formData.append("files", uploadedFile[i]);
        }

        console.log(uploadedFile);
        Axios.post('http://localhost:3001/api/upload', formData)
    }
    const HandleTags = (e) => {
        if (e.key !== 'Enter') {
            return;
        }
        const val = e.target.value;
        if (val === "") return;
        setTags([...tags, val])
        e.target.value = "";
    }

    const removeTags = (index) => {
        setTags(tags.filter((element, ind) => ind !== index));
    }

    const HandleDrag = (event) => {
        event.preventDefault();

    }
    const HandleDrop = (event) => {
        event.preventDefault();
        console.log(event.dataTransfer.files);
        setUploadedFile(event.dataTransfer.files)
        console.log("Drop list ..", uploadedFile);
    }

    const handleFile = (event) => {
        console.log("Files On changre", event.target.files)
        setUploadedFile(event.target.files)
        console.log("Up list", uploadedFile);
    }

    const removeUploadedFile = (index) => {
        setUploadedFile(Array.from(uploadedFile).filter((element, ind) => ind !== index));
    }

    return (
        <div className='FileHeader'>
            <div className='form'>
                <h3>New release of {title}</h3>
                <div className='bried-desc-Field'>
                    <p>Brief Description :</p>
                    <input type={"text"} placeholder='(Optional) enter brief description' onChange={(e) => { setBriefDesc(e.target.value) }} />
                </div>
                <div className='descField'>
                    <p>Description :</p>
                    <ReactQuill theme="snow" value={desc} onChange={setDesc} className="desc" />
                </div>
                {/* <input type="text" placeholder='Enter the Description of the file ..' onChange={(e) => { setDesc(e.target.value) }} /> */}
                <div className='tagsField'>
                    <p>Tags :</p>
                    <div className='tags-container'>
                        {tags.map((val, index) => {
                            return (<div className='tagResult' key={index}>
                                <span className='tagItem'>{val}</span>
                                <span className='tagDelete' onClick={() => { removeTags(index) }}><MdCancel /></span>
                            </div>
                            )
                        })}
                        <input type="text" className='tagInput' placeholder='Enter the tags of the file ..' onKeyDown={HandleTags} />

                    </div>

                </div>
                <div className='filesField' onClick={() => { inputRef.current.click() }} onDragOver={HandleDrag} onDrop={HandleDrop}  >
                    <p>Drag n Drop your files here Or Click to uplaod</p>
                    <input type="file" hidden onDragOver={HandleDrag} onDrop={HandleDrop} ref={inputRef} name='files' multiple onChange={handleFile} />
                </div>
                <h3>{uploadedFile.length !== 0 ? <div className='uploadedFileContainer'>
                    <span className='numFiles'>Selected Files ({uploadedFile.length}) :</span>
                    {Array.from(uploadedFile).map((val, index) => {
                        return (<div className='uploadedFileResult' key={index}>
                            <span className='fileNameItem'>{val.name}</span>
                            <span className='fileTagDelete' onClick={() => { removeUploadedFile(index) }}><CgFileRemove /></span>
                        </div>
                        )
                    })}</div> : ""}</h3>

                <button className='submitButton' onClick={submitNewRelease}>Upload New Release</button>
            </div>
        </div>
    )
}
