import { React, useState, useEffect } from 'react'
import Axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom'
import '../pagesCSS/searchFiles.css'
import '../pagesCSS/normalize.css'
import ReactPagination from 'react-paginate'

export default function SearchFiles() {
    Axios.defaults.withCredentials = true;

    const navigator = useNavigate();

    const { filename } = useParams();
    // console.log(filename);
    const [fileData, setFileData] = useState([]);
    // Start Pagination logic
    const [pageNumber, setPageNumber] = useState(0);
    const dataPerPage = 10; // we want to display 10 items per page
    const pagesVisited = pageNumber * dataPerPage;

    const countPage = Math.ceil(fileData.length / dataPerPage); // From IS424 , Celi function will round up , not Down

    const displaySearchedKeyWord = fileData.slice(pagesVisited, pagesVisited + dataPerPage).map((value) => {
        return (
            <div className='contentCardKeyword'>
                <Link to={`/${value.Creator}/${value.name}/${value.header_id}/${value.release_id}/readme`}>
                    <p className='title'>{value.name}</p>
                </Link>
                <p dangerouslySetInnerHTML={{ __html: value.brief_desc }}></p> {/* To make the desc of type html to display probably in the screen */}
                <div className='tagsKey'>{value.tags.split(",").map((tagsValue) => {
                    return <div className='tagsKeyword'><Link to={`/search/${tagsValue}`}>{tagsValue}</Link></div>;
                })}</div>
                <div className='fileInformation'>
                    <div className='createdBy'>Created By : <Link to={`/profile/${value.Creator}/${value.Creator_id}`}>{value.Creator}</Link></div>
                    <div className='dateFile'>{value.date}</div>
                </div>
            </div>
        );
    })

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    }// By using this function it will handle the decrement and increment to the transiton between pages


    // End Pagination logic

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get(`http://localhost:3001/api/get/file_header/search/${filename}`)
                setFileData(response.data);
            }
            catch (err) { console.log("errroor !! ", err) }
        }
        fetchData();
    }, fileData); // [] to call it once only when every time that we reload the page !
    const handleClickTags = (tagSrc) => { // This function handle when the user click on Enter button
        // <Link to={`/search/${tagSrc}`} ></Link>
        navigator(`/search/${tagSrc}`);
    }




    return (
        <div>
            <div className='AllFiles'>
                <div className='searchStatus'>{fileData.length === 0 ? <h3>There's no result for "{filename}"</h3> : <h3>The Searched Result for "{filename}" : </h3>
                }</div>
                <div className='searchResultKeyword'>
                    <div className='leftCardKeyword'>
                        {/* <p>Filter By :</p> */}
                    </div>
                    {displaySearchedKeyWord}
                    <ReactPagination
                        previousLabel={"< Previous"}
                        nextLabel={"Next >"}
                        pageCount={countPage}
                        onPageChange={changePage}
                        containerClassName={"pagination"}
                        previousLinkClassName={"prePage"}
                        nextLinkClassName={"nextPage"}
                        activeClassName={"activePage"}
                        breakLabel="..."
                    />

                </div>
            </div>
        </div>
    )
}
