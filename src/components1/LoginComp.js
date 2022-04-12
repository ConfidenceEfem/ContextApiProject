import React from 'react'
import styled from "styled-components"
import * as yup from "yup"
import {NavLink} from "react-router-dom"
import img from "../components/avatar.png"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import {app} from "../base"
import firebase from "firebase"
const LoginComp = () => {


    const schema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required(),
    })

    const {register, handleSubmit, formState:{errors}, reset} = useForm({resolver: yupResolver(schema)})

    const done = handleSubmit(async (value)=>{
        // console.log(value)
        const {email, password} = value

        await app.auth().signInWithEmailAndPassword(email, password)

        reset()
    })

    const authGoogle = async ()=>{
        const provider = new firebase.auth.GoogleAuthProvider()
        const user = await app.auth().signInWithPopup(provider)
        if(user){
            await app.firestore().collection("SignUpDatas").doc(user.user.uid).set({
                username: user.user.displayName,
                email: user.user.email,
                image: user.user.photoURL,
                createdBy: user.user.uid,
            })
        }
    }
    return (
        <Container>
            <Wrapper onSubmit={done}>
                <Error><span>{errors?.email?.message}</span></Error>
                <Inputs placeholder="Enter email"
                {...register("email")}/>

                <Error><span>{errors?.password?.message}</span></Error>
                <Inputs placeholder="Enter password"
                {...register("password")}/>


                <Button type="submit">Login In</Button>
            </Wrapper>
            <Signgoole onClick={authGoogle}>Sign in With Google</Signgoole>
            <Already>Don't have an accout yet? 
                    <Log to="/register">Sign Up</Log>
                </Already>
        </Container>
    )
}

export default LoginComp

const Signgoole= styled.div`
width: 255px;
color:white;
margin-top: 10px;
cursor: pointer;
height: 35px;
background-color: gray;
outline: none;
border: none;
transform: scale(1);
transition: all 350ms;
display: flex;
justify-content: center;
align-items: center;
font-size: 14px;
font-family: arial;
:hover{
    background-color: lightgray;  
    transform: scale(1.02);
}
`

const Log = styled(NavLink)`
cursor: pointer;
color: red;
text-decoration:none;
`
const Already = styled.div`
display: flex;
font-size: 14px;
font-weight: bold;
color: black;
margin-top: 10px;
margin-bottom: 20px;
`
const Error = styled.div`
width: 250px;
font-size: 10px;
font-weight: bold;
color: red;
`
const Button = styled.button`
width: 255px;
color:white;
margin-top: 10px;
cursor: pointer;
height: 35px;
background-color: red;
outline: none;
border: none;
transform: scale(1);
transition: all 350ms;
display: flex;
justify-content: center;
align-items: center;
font-size: 14px;
font-family: arial;
:hover{
    background-color: gray;  
    transform: scale(1.02);
}
`
const Inputs = styled.input`
width: 250px;
border: 2px solid black;
margin: 10px 0;
height: 35px;
outline: none;
`
const Upload = styled.label`
width: 250px;
height: 40px;
display: flex;
justify-content: center;
align-items: center;
background-color:black;
border-radius: 30px;
color: white;
transform: scale(1);
transition: all 350ms;
margin: 20px 0;
:hover{
    transform: scale(1.02);
    cursor: pointer;
    background-color: gray;
}
`
const Image = styled.img`
width: 180px;
height: 180px;
object-fit: cover;
border: solid 2px black;
border-radius: 50%;
margin-bottom: 10px;
`
const Wrapper = styled.form`
display: flex;
flex-direction: column;
align-items: center;
margin-top: 20px;
`
const Container = styled.div`
width: 100%;
height: calc(100vh - 80px);
display: flex;
align-items: center;
flex-direction: column;
`
