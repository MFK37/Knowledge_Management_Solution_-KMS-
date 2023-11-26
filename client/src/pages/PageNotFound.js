import React from 'react'
import Pic from '../pagesCSS/PageNotFound.svg'

export default function PageNotFound() {
  return (
    <div className='searchBar-container' >
        <img src={Pic} alt='Page NOT FOUND pic' width={"500px"} height={"350px"} />
        <h3>404 Page Not Found</h3>
        </div>
  )
}
