import React from "react"
import styled from "styled-components"
import {NavLink, useNavigate,} from "react-router-dom"
import {app} from "../base"
import * as yup from "yup"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import { AuthContext } from "./AuthProvider"

const SignIn = ()=>{
    const {msg,currentUser} = React.useContext(AuthContext)
    const navigate = useNavigate()
    const [hold, setHold] = React.useState({})

    const schema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required()
    })
    const {register, handleSubmit,formState:{errors},reset} = useForm({resolver: yupResolver(schema)})

    const onGo = handleSubmit(async (store) =>{
        console.log(store)
        const {email,password} = store
       
      await  app.auth().signInWithEmailAndPassword(email,password)
      console.log(currentUser)
    //   console.log(typeof onGo)


        reset()

      
    })
    
    return(
        <Container>
        <Wrapper onSubmit={onGo}>
       
            <Error><span>{errors?.email?.message}</span></Error>
            <Input placeholder="Enter email"
            {...register("email")}/>
            <Error><span>{errors?.password?.message}</span></Error>
            <Input placeholder="Enter password"
            {...register("password")}/>
            <Button type="submit">Log In</Button>
            <Already>Already have an account? Click here to {" "}
                    <Sign to="/signin">Log In</Sign>
            </Already>
        </Wrapper>
    </Container>
    )
}
export default SignIn
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