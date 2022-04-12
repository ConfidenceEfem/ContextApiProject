import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import PrivateRoute from './PrivateRoute'
import TheHeader from './TheHeader'
import TheHome from './TheHome'
import TheLogin from './TheLogin'
import TheRegister from './TheRegister'
import DiaryHome from './DiaryHome'


const TheApp = () => {
    return (
        <div>
            <Router>
                <TheHeader/>
                <Routes>
                    <Route exact path="/" element={
                        <PrivateRoute>
                            <TheHome/>
                        </PrivateRoute>
                    }/>
                    <Route exact path="/diary" element={
                        <PrivateRoute>
                             <DiaryHome/>
                        </PrivateRoute>
                    }/>
                    <Route exact path="/signup" element={<TheRegister/>}/>
                    <Route exact path="/login" element={<TheLogin/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default TheApp
