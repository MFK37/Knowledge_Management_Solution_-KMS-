import { React } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
// import Axios from 'axios'
// import fileDownload from 'js-file-download';
import '../pagesCSS/FileDetails.css'
import { RxReader } from 'react-icons/rx';
import { BsFillTagsFill, BsFillFileCodeFill } from 'react-icons/bs'
import NavTab from './NavTab';



export default function FileDetails() {
    // const { id, version_id, name, Creator } = useParams();

    return (
        <div className='File_Content'>
            <div className='NavTab'>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={`readme`}><RxReader size={"20px"} />ReadMe</NavLink>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={`code`}><BsFillFileCodeFill />Code</NavLink>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={`versions`}><BsFillTagsFill />Versions</NavLink>
            </div>
            <Outlet />
            {/* <NavTab /> */}


        </div>
    )
}
