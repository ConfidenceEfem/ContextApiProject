import React,{useState, useEffect,useContext} from 'react'
import styled from "styled-components"
import {app} from "../base"
import { AuthContext } from '../components/AuthProvider'

const CommentProfile = ({comment,createdBy}) => {
    const {currentUser} = useContext(AuthContext)
    const [data1, setData1] = React.useState([])
    const getData1 = async ()=>{
        await app.firestore().collection("pratice").doc(createdBy).get().then((store)=>{
            setData1(store.data())
        })
    }

    React.useEffect(()=>{
        getData1()
      
    },[data1])
    return (
        <div>
            <Card>
                  <Avatar src={data1?.avatar} />
                  <InputAndName>
                        <Name>{data1?.name}</Name>
                        <Comment>{comment}</Comment>
                  </InputAndName>
              </Card>
        </div>
    )
}

export default CommentProfile

const Comment = styled.div`
font-size: 12px;
font-family: arial;
width: 250px;
height: 100%auto;
display: flex;
padding: 10px 8px;
background-color: lightblue;
flex-wrap: wrap;
text-align: left;
border-radius: 0 10px 0 10px;
`
const Name = styled.div`
display: flex;
font-size: 10px;
font-weight: bold;
margin-bottom: 3px;
`
const InputAndName = styled.div``
const Avatar = styled.img`
width: 30px;
height: 30px;
border-radius: 50%;
margin-right: 10px;
`
const Card = styled.div`
font-size: 12px;
font-family: arial;
height: 100%auto;
display: flex;
margin: 5px 0;
align-items: center;
`
