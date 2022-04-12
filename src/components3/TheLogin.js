import React from 'react'
import * as yup from "yup"
import styled from "styled-components"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import {NavLink} from "react-router-dom"
import {app} from "../base"
import firebase from "firebase"


const TheLogin = () => {
    const [counter ,setCounter] = React.useState(0)
    const schema =  yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required(),
    })

    const {register, handleSubmit, formState:{errors}, reset} = useForm({resolver: yupResolver(schema)})
    const done = handleSubmit(async (data)=>{
            const {email,password} = data

            await app.auth().signInWithEmailAndPassword(email,password)
            // if(user){
            //     await app.firestore().collection("pratice").doc(user.user.uid).set({
            //         nam
            //     })
            // }
            reset()
    })

    const onRandom = ()=>{
        const change = Math.floor(Math.random() * 10)
        setCounter(change)
    }

    const authGoogle = async ()=>{
       
        const provider = new firebase.auth.GoogleAuthProvider()
       const user =  await app.auth().signInWithPopup(provider)
       if(user){
           await app.firestore().collection("pratice").doc(user.user.uid).set({
               name: user.user.displayName,
               email: user.user.email,
               avatar: user.user.photoURL,
               counter,
               createdBy: user.user.uid
           })
       }
    }


    return (
        <Container>
        <Wrapper>
            <TheForm onSubmit={done} >
                <Error><span>{errors?.email?.message}</span></Error>
                <Input
                placeholder="Enter Email"
                {...register("email")}
                />
                <Error><span>{errors?.password?.message}</span></Error>
                <Input
                onClick={onRandom}
                placeholder="Enter Password"
                {...register("password")}/>
                <Error><span>{errors?.confirm?.message}</span></Error>
                <Button type="submit">Sign Up</Button>
            </TheForm>
            <Question>Don't have an account yet? 
                <Sign to="/signup">Sign Up</Sign>
            </Question>
            <SignGoogle bg="red" onClick={()=>{
                onRandom()
                authGoogle()

            }}>
                Sign in with Google
            </SignGoogle>
            {/* <SignGoogle bg="black">
                Sign in with GitHub
            </SignGoogle> */}
        </Wrapper>
    </Container>
    )
}

export default TheLogin

const Sign = styled(NavLink)`
color: red;
font-weight: bold;
cursor: pointer;
text-decoration: none;
`
const Question = styled.div`
display: flex;
font-size: 14px;
color: black;
`

const Error  = styled.div`
font-size: 10px;
font-weight: bold;
/* font-family: arial; */
display: flex;
width: 100%;
color: red;
`
const SignGoogle  = styled.div`
width: 90%;
height: 35px;
background-color: ${({bg})=>bg};
display: flex;
justify-content: center;
align-items: center;
margin: 5px 0;
font-size: 13px;
font-family: arial;
color: white;
cursor: pointer;
border-radius: 3px;
transform: scale(1);
transition: all 350ms;
:hover{
    transform: scale(1.02);

}
`
const Button  = styled.button`
margin-top: 20px;
margin-bottom: 20px;
outline: none;
border: 1px black solid;
width: 130px;
height: 35px;
border-radius: 5px;
background-color: gold;
color: black;
display: flex;
justify-content: center;
align-items: center;
font-size: 13px;
font-family: arial;
cursor: pointer;
transition: all 350ms;
transform: scale(1);
:hover{
    transform: scale(1.03);
    background-color: gray;

}
`
const Input  = styled.input`
width: 100%;
margin: 5px 0;
height: 35px;
outline: none;
border: solid 1px black;
`
const TheForm  = styled.form`
display: flex;
flex-direction: column;
align-items: center;
width: 90%;

`
const Upload  = styled.label`
width: 250px;
background-color:black;
color: white;
height: 40px;
display: flex;
justify-content: center;
align-items: center;
border-radius: 20px;
margin: 20px 0;
transition: all 350ms;
transform: scale(1);
cursor: pointer;
:hover{
    background-color:gray;
    transform: scale(1.02);
}

`
const Avatar  = styled.img`
width: 150px;
 height: 150px;
 border-radius: 50%;
 border: solid 2px black;
 margin-bottom: 0px;
 margin-top: 20px;
`
const Wrapper  = styled.div`
width: 400px;
height: 100%;
display: flex;
flex-direction: column;
align-items: center;
margin-top: 30px;
box-shadow: 2px 2px 2px 2px lightgray;
border-radius: 10px;
padding-bottom: 20px;
`
const Container  = styled.div`
width: 100%;
min-height:calc(100vh - 70px);
height: 100%;
display: flex;
justify-content: center;
`

