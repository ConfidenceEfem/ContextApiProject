import React,{useState, useEffect,useContext} from 'react'
import styled from "styled-components"
import {app} from "../base"
import { AuthContext } from '../components/AuthProvider'

const CommentNumber = ({id})=>{
    const [data, setData] = useState([])
    const {currentUser} = useContext(AuthContext)
    
    const getData = async ()=>{
        await app.firestore().collection("post").doc(id).collection("comment").onSnapshot((snap)=>{
            const store = []
            snap.forEach((doc)=>{
                store.push({...doc.data(), id: doc.id})
            })
            setData(store)
        })
    }
    

    useEffect(()=>{
        getData()
    })
    return(
        <Container>
            <Wrapper>{data?.length}</Wrapper>
        </Container>
    )
    }

export default CommentNumber 

const Container = styled.div`
margin-right: 3px;
`
const Wrapper = styled.div`
font-size: 12px;
color: gray;
`