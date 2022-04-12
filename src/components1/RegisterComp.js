import React,{ useContext} from 'react'
import styled from "styled-components"
import * as yup from "yup"
import img from "../components/avatar.png"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import {NavLink} from "react-router-dom"
import {app} from "../base"
import firebase from "firebase"
import { AuthContext } from '../components/AuthProvider'
const RegisterComp = () => {

    const {currentUser} = useContext(AuthContext)

    const [image, setImage] = React.useState(img)

    const schema = yup.object().shape({
        username: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().required(),
        confirm: yup.string().oneOf([yup.ref("password"), null])
    })

    const {register, handleSubmit, formState:{errors}, reset} = useForm({resolver: yupResolver(schema)})

    const done = handleSubmit(async (value)=>{
        console.log(value)
        const {username, email, password} = value
        const user = await app.auth().createUserWithEmailAndPassword(email,password)
        // console.log(user)
        if(user){
            await app.firestore().collection("SignUpDatas").doc(user.user.uid).set({
                username,
                email,
                password,
                createdBy: user.user.uid,
                image,
            })
        }


        reset()
    })

    const upload = async (e)=>{
        const file = e.target.files[0]
        const save = URL.createObjectURL(file)
        setImage(save)
        const fileRef = await app.storage().ref()
        const storageRef = fileRef.child("img/"+file.name).put(file)
        storageRef.on(firebase.storage.TaskEvent.STATE_CHANGED,(snapshot)=>{
                const count = (snapshot.bytesTransferred/snapshot.totalBytes) *100
                console.log(count)
        },(err)=>{
            console.log(err)
        },()=>{
            storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                console.log(url)
                    setImage(url)
            })
        })
    }

    const authGoogle = async ()=>{
            const them = new firebase.auth.GoogleAuthProvider()
          const user =  await app.auth().signInWithPopup(them)
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
                <Image src={image}/>
                <Upload htmlFor="pix">Upload Image</Upload>
                <input type="file" id="pix" style={{display: "none"}} onChange={upload}/>
                <Error><span>{errors?.username?.message}</span></Error>
                <Inputs placeholder="Enter Username"
                {...register("username")}/>

                <Error><span>{errors?.email?.message}</span></Error>
                <Inputs placeholder="Enter email"
                {...register("email")}/>

                <Error><span>{errors?.password?.message}</span></Error>
                <Inputs placeholder="Enter password"
                {...register("password")}/>

                <Error><span>{errors?.confirm?.message}</span></Error>
                <Inputs placeholder="Confirm password"
                {...register("confirm")}/>
                <Button type="submit">Sign Up</Button>
            </Wrapper>
            <Signgoole onClick={authGoogle}>Sign in With Google</Signgoole>
            <Already>Already have an accout? 
                    <Log to="/signin">Log In</Log>
                </Already>
        </Container>
    )
}

export default RegisterComp

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
text-decoration: none;
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
