import { React, useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import Axios from 'axios'
import fileDownload from 'js-file-download';
import '../pagesCSS/FileDetails.css'
import { RxReader } from 'react-icons/rx';
import { BsFillTagsFill } from 'react-icons/bs'

export default function NavTab() {
    // const { id, version_id, name, Creator } = useParams();

    return (
        <div>NavTab

            <div className='NavTab'>
                <Link><RxReader size={"20px"} />ReadMe</Link>
                <Link to={`/Nawaf/React/1`}><BsFillTagsFill />Versions</Link>
            </div>
        </div>
    )
}
