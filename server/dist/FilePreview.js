import { React, useState, useEffect } from 'react'
// import { DocViewerRenderers, DocViewerProps } from '@cyntler/react-doc-viewer'
// import { DocViewer, DocViewerRenderers } from 'react-doc-viewer';
import Axios from 'axios'
import '../pagesCSS/codePreview.css'
import { useParams } from 'react-router-dom';

export default function FilePreview() {
    const { id, version_id, name, Creator } = useParams();

    const [fileContent, setFileContent] = useState([]);
    const [fileID, setFileID] = useState("");

    useEffect(() => {
        Axios.get(`http://localhost:3001/api/get/file_header/${id}/${version_id}`).then((response) => {
            console.log(response.data[0].file_id);
            // setFileID(response.data[0].file_id)
            Axios.get(`http://localhost:3001/api/getFileContent/${response.data[0].file_id}`).then((res) => {
                setFileContent(res.data)
                console.log(res.data, " Dataaaaaaaa")
            })
        })
    }, [])

    return (
        <div className='codePreview'>
            {fileContent.length === 0 ? "There's an error please try again ! " :
                <div className='codePreviewCard'>
                    {fileContent.map((val) => {
                        return (
                            <div className='codeContent'>
                                <h3>{val.path}</h3>
                                <p className='codeData'>
                                    <pre className='codeData-Content'>{val.data}</pre>
                                </p>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}
