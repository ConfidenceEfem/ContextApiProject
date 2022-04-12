import React from 'react'
import Header from "./components1/HeaderComp"
import Register from "./components1/RegisterComp"
import SignIn from "./components1/LoginComp"
import Home from "./components/Home"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import MainScreen from './components1/MainScreen'
import PrivateRoute from './components1/PrivateRoute'
import TheApp from './components3/TheApp'


const App = () => {
  return (
    <div>
     {/* <Router>
      <Header/>
      <Routes>
        <Route exact path="/register" element={<Register/>}/>
        <Route path="/" element={
          <PrivateRoute>
            <MainScreen/>
          </PrivateRoute>
        }/>
        <Route exact path="/signin" element={<SignIn/>}/>
        <Route exact path="/home" element={<Home/>}/>
      </Routes>
    </Router>  */}

     <TheApp/>
    </div>
  )
}

export default App

