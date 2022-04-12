import React,{useState, useEffect,useContext} from 'react'
import styled from "styled-components"
import {app} from "../base"
import { AuthContext } from '../components/AuthProvider'
import ViewComment from './ViewComment'
import firebase from "firebase"

const CommentComp = ({id, toggle, setToggle,created}) => {
    const {currentUser} = useContext(AuthContext)
    const [data, setData]= useState([])
    const [comment, setComment] = useState("")
    const getData = async ()=>{
        await app.firestore().collection("pratice").doc(currentUser?.uid).get().then((store)=>{
            setData(store.data())
        })
    }

    React.useEffect(()=>{
        getData()
      
    },[data])

    const pushComment = async ()=>{
        await app.firestore().collection("post").doc(id).collection("comment").doc().set({
            comment,
            createdBy: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })

        setComment("")
    }

    const submitHandle = async (e)=>{
        e.preventDefault()
        pushComment()
    }
    return (
        <div>
            <Container>
                {currentUser.uid === created?
                <div>
                    {toggle?<ViewComment id={id} all/>:  <ViewComment id={id} justOne/> }
                </div> : null}
              
            <ProfileCommentStickers>  
                               <PictureBox>
                                   <Picture src={data?.avatar}/>
                                   <ActiveCircle></ActiveCircle>
                               </PictureBox>
                               <InputHolder 
                               
                               >
                                   <MyComment placeholder="Write a comment"
                                   value={comment}
                                   onChange={(e)=>{
                                       setComment(e.target.value)
                                   }}/>
                                   <CommentSticker type="submit" onClick={submitHandle}>
                                      Send
                                   </CommentSticker>
                               </InputHolder>
                               </ProfileCommentStickers>
            </Container>
        </div>
    )
}

export default CommentComp
const Container = styled.div`
width: 100%;
margin-bottom: 20px;
margin-top: 10px;
/* background-color: green; */
`
const ProfileCommentStickers = styled.div`
display: flex;
align-items: center;
width: 100%;

/* background-color: red; */
`
const Picture = styled.img`
width: 35px;
height: 35px;
border-radius: 50%;
object-fit: cover;
/* background-color: blue; */

`
const ActiveCircle = styled.div`
position: absolute;
width: 8px;
height: 8px;
border-radius: 50%;
background-color: #31A24C;
border: 2px solid white;
/* top: 0; */
right: 0;
bottom: 0;
`
const PictureBox = styled.div`
display: flex;
position: relative;
/* background-color: purple; */
width: 40px;
height: 35px;
margin-right: 10px;
`
const CommentSticker = styled.button`
outline: none;
border: none;
display: none;
`
const MyComment = styled.input`
display: flex;
padding-left: 10px;
outline: none;
border: none;
background-color:transparent;
height: 40px;
width: 60%;

::placeholder{
font-size: 12px;
color: black;
}
`
const InputHolder = styled.form`
width: 500px;
background-color: #eee;
display: flex;
align-items: center;
border-radius: 20px;

justify-content: space-between;
`
const LikeClickHolder = styled.div`
display: flex;
align-items: center;
transform: scale(1);
transition: all 350ms;
font-size: ${({fs})=>fs};
color: ${({bg})=>bg};
:hover{
    transform: scale(1.02);
    cursor: pointer;
}
span{
    font-size: 12px;
    margin-left: 5px;
}
`

const CommentsNumber = styled.div`
font-size: 12px;
color: gray;
`
