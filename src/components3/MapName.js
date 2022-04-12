import React,{useContext, useEffect, useState} from 'react'
import {app} from "../base"
import {AuthContext} from "../components/AuthProvider"
import styled from "styled-components"


const MapName = ({likeBy}) => {
    const [data, setData]  = useState([])

    const getData = async ()=>{
        await app.firestore().collection("pratice").doc(likeBy).get().then((items)=>{
            setData(items.data())
        })
    }

    useEffect(()=>{
        getData()
    },[])
    const {currentUser} = useContext(AuthContext)
    return (
        <div>
           {currentUser.uid === likeBy? 
            <Name>You</Name>:
              <Name>{data?.name}</Name>}
        </div>
    )
}

export default MapName
const Name = styled.div`
font-size: 12px;
font-weight: bold;
color: lightgray;
margin: 3px 0;
text-align: left;
`

