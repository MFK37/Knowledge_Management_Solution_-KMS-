import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import LoginPage from './pages/LoginAndHome/LoginPage'


export default function LoginForm() {
    return (
        <div className='App'>
            <Routes>
                <Route path='/' element={<LoginPage />} />
            </Routes>
        </div>
    )
}
