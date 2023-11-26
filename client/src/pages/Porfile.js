import { React, useEffect, useState } from 'react'
import Axios from 'axios';
import { Link } from 'react-router-dom'


export default function Porfile() {
  const [myUploads, setMyUploads] = useState([]);
  useEffect(() => {
    Axios.get("http://localhost:3001/api/get/Myuploads").then((res) => {
      console.log("Uplaodsosjoidjsoai")
      setMyUploads(res.data);
      console.log(myUploads)
    })
  }, [])
  return (
    <div>
      {myUploads.length === 0 ? "You haven't uploaded any file "
        :
        <div className='displayResult'><h3>My Files</h3>
          {myUploads.map((value) => {
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
