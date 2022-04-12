import React,{useContext} from 'react'
import styled from "styled-components"
import {NavLink} from "react-router-dom"
import {app} from "../base"
import {AuthContext} from "../components/AuthProvider"
const TheHeader = () => {
    const [counter, setCounter] = React.useState(0)
  const [data, setData] = React.useState([])
    const {currentUser} = useContext(AuthContext)

    const onRandom = ()=>{
        const change = Math.floor(Math.random() * 10)
        setCounter(change)
    }

    const getData = async ()=>{
        await app.firestore().collection("pratice").doc().get().then((store)=>{
            setData(store.data())
        })
    }

    React.useEffect(()=>{
getData()
// console.log(data)
    },[])
    return (
        <Container>
            <Wrapper>
                <Logo to="/">Logo</Logo>
                <Holder>
                <Welcome>Welcome Back {data?.name}</Welcome>
                <Nav to="/diary">My Diary Book</Nav>
                </Holder>
               {currentUser?
            (  <Navigations>
                {data?.avatar==""?
                <Circle bg={data?.counter}>{data?.name?.charAt(0)}</Circle>:
                <Avatar src={data?.avatar}/>}
                <Register1 onClick={async ()=>{
                        await app.auth().signOut()
                }}>Logout</Register1>
            </Navigations>): ( <Register to="/signup">Register</Register>)}
            </Wrapper>
        </Container>
    )
}

export default TheHeader
const Holder = styled.div`
display: flex;
align-items: center;
flex: 1;
`
const Nav = styled(NavLink)`
text-decoration: none;
cursor: pointer;
font-size: 12px;
color: white;
width: 150px;
height: 35px;
transition: all 350ms;
display: flex;
align-items: center;
justify-content: center;
margin: 0 20px;
border-radius: 3px;
:hover{
    background-color: gold;
    cursor: pointer;
}
`
const Circle = styled.div`
width: 40px;
height: 40px;
border-radius: 50%;
background-color: ${({bg})=>bg===0? "red" :
 bg===1? "gold"
 : bg===2? "blue" : bg===3? "green" : bg ===4? "lightcoral" : bg===5? "indigo" :
  bg===6? "cyan" : bg===7? "lightblue" : bg===8? "gray" : "lightgray"};
display: flex;
justify-content: center;
align-items: center;
font-size: 14px;font-weight: bold;
color: white;
`
const Avatar = styled.img`
width: 40px;
height: 40px;
object-fit: cover;
border-radius: 50%;
margin: 0 10px;
`
const Navigations = styled.div`
display: flex;
align-items: center;
`
const Register1 = styled.div`
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
const Register = styled(NavLink)`
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
text-decoration: none;

:hover{
    transform: scale(1.03);
    background-color: gray;
}
`
const Welcome = styled.div`
color: white;
font-size: 13px;
font-family: arial;
/* display: flex; */
/* color: red; */
`
const Logo = styled(NavLink)`
color: gold;
font-family: hobo std, sans-serif;
display: flex;
flex: 1;
text-decoration: none;
`
const Wrapper = styled.div`
width: 90%;
display: flex;align-items: center;

`
const Container = styled.div`
width: 100%;
height: 70px;
display: flex;
justify-content: center;
background-color: black;
`
