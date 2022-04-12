import React,{useState, useEffect,useContext} from 'react'
import styled from "styled-components"
import {app} from "../base"
import { AuthContext } from '../components/AuthProvider'
import CommentProfile from './CommentProfile'

const ViewComment = ({id,justOne,all}) => {
    const [data, setData] = React.useState([])
    const [data1, setData1] = React.useState([])
  
    const {currentUser} = useContext(AuthContext)
    const getData = async ()=>{
        await app.firestore().collection("post").doc(id).collection("comment").orderBy("createdAt", "desc").limit(1).onSnapshot((snapshot)=>{
           const store = []
           snapshot.forEach((doc)=>{
               store.push({...doc.data(), id: doc.id})
           }) 
           setData(store)
        })
    }
    const getData1 = async ()=>{
        await app.firestore().collection("post").doc(id).collection("comment").onSnapshot((snapshot)=>{
           const store = []
           snapshot.forEach((doc)=>{
               store.push({...doc.data(), id: doc.id})
           }) 
           setData1(store)
        })
    }

    useEffect(()=>{
        getData1()
        getData()
    })

    return (
     <div>
         <div>
          {justOne? 
        <Container>
        <CardHolder>
            {data?.map((props)=>(
                <CommentProfile 
                comment={props.comment}
                time={props.createdAt}
                createdBy={props.createdBy}

                />
            ))}
        </CardHolder>
    </Container>: null}
     </div>
     <div>
     {all? 
        <Container>
        <CardHolder>
            {data1?.map((props)=>(
                <CommentProfile 
                comment={props.comment}
                time={props.createdAt}
                createdBy={props.createdBy}

                />
            ))}
        </CardHolder>
    </Container>: null} 
     </div>
     </div>
    )
}

export default ViewComment

const CardHolder = styled.div`
display: flex;
flex-direction: column;

`
const Container = styled.div`
margin: 10px 0;
width: 100%;
display: flex;
`

