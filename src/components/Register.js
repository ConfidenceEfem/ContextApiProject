import React from "react"
import styled from "styled-components"
import avatar from "./avatar.png"
import {NavLink} from "react-router-dom"
import * as yup from "yup"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import firebase from "firebase"
import {app} from "../base"
import { AuthContext } from "./AuthProvider"

const Register = ()=>{
    const [image, setImage] = React.useState("")
    const [img, setImg] = React.useState(avatar)

    const {msg,currentUser} = React.useContext(AuthContext)

    const schema = yup.object().shape({
        username: yup.string().required("please enter your name"),
        email: yup.string().email().required(),
        password: yup.string().required(),
        confirm: yup.string().oneOf([yup.ref("password"), null])
    })
    const {register, handleSubmit,formState:{errors},reset} = useForm({resolver: yupResolver(schema)})

    const done = handleSubmit(async (data)=>{
        console.log(data)
        const {username, email, password} = data
   const user = await app.auth().createUserWithEmailAndPassword(email,password)
   console.log(user)
        if(user){
            await app.firestore().collection("userDatas").doc(user.user.uid).set({
                username,
                email, 
                password,
                createdBy: user.user.uid
            })
        }


        reset()
    })

    const upload = async (e)=>{
        const file = e.target.files[0]
        const save = URL.createObjectURL(file)
        setImg(save)
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
                    setImg(url)
            })
        })
    }


    return(
        <Container>
            <Wrapper onSubmit={done}>
                <Image src={img}/>

                <Upload htmlFor="pix" >Upload   Image</Upload>
                <input type="file" id="pix" style={{display: "none"}} onChange={upload}/>
                <Error><span>{errors?.username?.message}</span></Error>
                <Input placeholder="Enter username"
                {...register("username")}/>
                <Error><span>{errors?.email?.message}</span></Error>
                <Input placeholder="Enter email"
                {...register("email")}/>
                <Error><span>{errors?.password?.message}</span></Error>
                <Input placeholder="Enter password"
                {...register("password")}/>
                <Error><span>{errors?.confirm?.message}</span></Error>
                <Input placeholder="Confirm password"
                {...register("confirm")}/>
                <Button type="submit">Register</Button>
                <Already>Already have an account? Click here to {" "}
                        <Sign to="/signin">Sign In</Sign>
                </Already>
            </Wrapper>
        </Container>
    )
}
export default Register
const Sign = styled(NavLink)`
font-weight: bold;
text-decoration: none;
color: red;
cursor: pointer;
margin-right: 3px;
`
const Already = styled.div`
font-size: 14px;
font-family: arial;
color: black;
display: flex;
font-weight: bold;
`
const Error = styled.div`
width: 300px;
display: flex;
font-size: 10px;
font-weight: bold;
color: red;
`
const Button = styled.button`
margin-top: 10px;
width: 100px;
height: 30px;
display: flex;
justify-content: center;
align-items: center;
outline: none;
margin-bottom: 10px;
background-color: black;
border-radius: 4px;
color: white;
border: none;
cursor: pointer;
:hover{
    background-color: lightgray;
}

`
const Input = styled.input`
width: 290px;
border: 2px solid black;
outline: none;
height: 35px;
padding-left: 5px;
margin: 10px 0;
`
const Upload = styled.label`
width: 300px;
height: 40px;
display: flex;
justify-content: center;
align-items: center;
border-radius: 20px;
background-color: black;
font-family: arial;
font-size: 14px;
transform: scale(1);
transition: all 350ms;
margin-bottom: 20px;
color: white;
:hover{
    transform: scale(1.02);
    cursor: pointer;
    background-color: lightgray;
}
`
const Image = styled.img`
margin-bottom: 20px;
width: 250px;
height: 200px;
border-radius: 10px;
border: solid 2px black;
object-fit: cover;
`
const Wrapper = styled.form`
display: flex;
flex-direction: column;
margin-top: 40px;
align-items: center;
`
const Container = styled.div`
width: 100%;
min-height: calc(100vh - 70px);
height: 100%;
display: flex;
justify-content: center;
`