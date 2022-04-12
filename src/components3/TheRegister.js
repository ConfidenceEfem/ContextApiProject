import React from 'react'
import styled from "styled-components"
import * as yup from "yup"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import {NavLink} from "react-router-dom"
import {app} from "../base"
import img from "../components/avatar.png"
import firebase from "firebase"

const TheRegister = () => {
    const [counter, setCounter] = React.useState(0)
    const [image, setImage] = React.useState(img)
    const [avatar, setAvatar] = React.useState("")



    const schema =  yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().required(),
        confirm: yup.string().oneOf([yup.ref("password"), null])
    })

    const onRandom = ()=>{
        const change = Math.floor(Math.random() * 10)
        setCounter(change)
        
    }

    const {register, handleSubmit, formState:{errors}, reset} = useForm({resolver: yupResolver(schema)})
    const done = handleSubmit(async (data)=>{
            const {name,email,password}  = data
            const userData = await app.auth().createUserWithEmailAndPassword(email, password)
           if(userData){
            await app.firestore().collection("pratice").doc(userData.user.uid).set({
                name,
                email,
                password,
                avatar,
                createdBy: userData.user.uid,
                 counter
            })
           }


            reset()
    })

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


    const upload = async (e)=>{
        const file = e.target.files[0]
        const save = URL.createObjectURL(file)
        setImage(save)

        const fileRef = await app.storage().ref()
         const storageRef = fileRef.child("/img" + file.name).put(file)
         storageRef.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot)=>{
                const count = (snapshot.bytesTransferred/snapshot.totalBytes)*100
                console.log(count)
         },(err)=>{
            console.log(err)
         },()=>{
             storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                 console.log(url)
                 setAvatar(url)
             })
         })
    }
    return (
        <Container>
            <Wrapper>
                <Avatar src={image}/>
                <Upload htmlFor="pix" >Upload Image</Upload>
                <input type="file" id="pix" onChange={upload} style={{display: "none"}}/>
                <TheForm onSubmit={done} >
                    <Error><span>{errors?.name?.message}</span></Error>
                    <Input 
                    placeholder="Enter Username"
                    {...register("name")}
                    />
                    <Error><span>{errors?.email?.message}</span></Error>
                    <Input
                    placeholder="Enter Email"
                    {...register("email")}
                    />
                    <Error><span>{errors?.password?.message}</span></Error>
                    <Input
                    placeholder="Enter Password"
                    onClick={()=>{
                        onRandom()
                        console.log(counter)
                    }}
                    {...register("password")}/>
                    <Error><span>{errors?.confirm?.message}</span></Error>
                    <Input
                    placeholder="Confirm Password"
                    {...register("confirm")}/>
                    <Button type="submit">Sign Up</Button>
                </TheForm>
                <Question>Don't have an account yet? 
                <Sign to="/login">Login</Sign>
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

export default TheRegister

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
 object-fit: cover;
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
