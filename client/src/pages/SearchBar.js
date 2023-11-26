import React, { useState, useEffect, version } from 'react'
import Axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import fileDownload from 'js-file-download'
import "../pagesCSS/searchBar.css"
// import { AiOutlineEnter } from 'react-icons/ai';



export default function SearchBar() {
    // Axios.defaults.withCredentials = true;
    const [fileData, setFileData] = useState([]);

    const [searchedData, setSearchedData] = useState([]);
    const[fileList,setFileList] = useState([]);
    const [word, setWord] = useState("");
    const navigator = useNavigate();
    useEffect(() => {
        // console.log("Before")
        Axios.get('http://localhost:3001/api/get/file_header')
            .then((response) => {
                // console.log("After")
                setFileData(response.data);
            })
            Axios.get('http://localhost:3001/api/get/file_header/release')
            .then((response) => {
                // console.log("After")
                setFileList(response.data);
            })
        
    }, []); // [] to call it once only when every time that we reload the page !


    const HandleSearch = (event) => {
        const keyWord = event.target.value;
        setWord(keyWord);
        const newData = fileList.filter((value) => {
            return (
                value.name.toLowerCase().includes(keyWord.toLowerCase())
                || value.description.toLowerCase().includes(keyWord.toLowerCase())
                || value.tags.toLowerCase().includes(keyWord.toLowerCase())
            );
        });
        if (keyWord === "") {
            setSearchedData([]);
        } else {
            setSearchedData(newData);
            console.log(searchedData);
        }
    }
    const searchWord = () => {
        // const allData = searchedData.filter((value) => {
        //     return value.name;
        // })
        // console.log("Searched Clicked Array : ", allData);
        console.log("Word is ", word);
        <Link to={`/search/${word}`} ></Link>
        navigator(`/search/${word}`);

    }

    const downloadFile = (id, file_name) => {
        Axios({
            url: `http://localhost:3001/files/${id}`,
            method: 'GET',
            responseType: 'blob', // Important
        }).then((res) => {
            console.log(res)
            fileDownload(res.data, `${file_name}.zip`);
        })
        // Axios.get({`http://localhost:3001/files/${id}`}).then((res) => {
        //     console.log(res.data);
        //     // fileDownload(res.data , "download.zip" )
        // })
    }
    const HandleKey = (event) => { // This function handle when the user click on Enter button
        if (event.key === 'Enter') {
            <Link to={`/search/${word}`} ></Link>
            navigator(`/search/${word}`);
        }
    }

    return (
        <div className='searchBar-container' >
            <div className='searchBar'>
                <input className='searchInput' type='text' placeholder='Search .. ' onChange={HandleSearch} onKeyDown={HandleKey} />
                {/* <div className='searchIcon'><AiOutlineSearch /></div> */}
                <button onClick={searchWord}>Search</button>

                {(searchedData.length !== 0) ? ( // IF There's a data ..
                    <div className='searchResult'>{searchedData.map((value) => {
                        return (
                            <div className='content'>
                                <Link to={`/${value.Creator}/${value.name}/${value.header_id}/${value.release_id}/readme`}>
                                    <p className='title'>{value.name}</p>
                                    {/* <div className='EnterToJump'>Jump to<AiOutlineEnter /></div> */}
                                    {/* <p>{value.description}</p>
                                    <p>{value.tags}</p> */}
                                </Link>
                            </div>
                        );
                    })}
                    </div>) : (( // Else
                        <div className='displayResult'><h3>Recent Files</h3>
                            {fileData.slice(0, 10).map((value) => {
                                return (
                                    <div className='contentCard'>
                                        <Link to={`/${value.Creator}/${value.name}/${value.header_id}/${value.release_id}/readme`}>
                                            <p className='title'>{value.name}</p>
                                        </Link>
                                        <div className='desc-content'>{value.brief_desc}</div>
                                        <div className='tagsKey'>{value.tags.split(",").map((tagsValue) => {
                                            return <div className='tagsKeyword'><Link to={`/search/${tagsValue}`} >{tagsValue}</Link></div>;
                                        })}</div>
                                        <div className='fileInformation'>
                                            <div className='createdBy'>Created By : <Link to={`/profile/${value.Creator}/${value.Creator_id}`}>{value.Creator}</Link></div>
                                            <div className='dateFile'>{value.date}</div>
                                        </div>
                                        {/* <div className='downloadButton'><button onClick={() => { downloadFile(value.file_id, value.name) }}>Download</button></div> */}
                                    </div>
                                );
                            })}
                        </div>))}
            </div>

        </div>
    )
}
