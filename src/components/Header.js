import React,{useContext} from "react"
import styled from 'styled-components'
import logo from "./logo.png"
import {app} from "../base"
import {AuthContext} from "./AuthProvider"



const Header = ()=>{
    const {currentUser} = useContext(AuthContext)
    const [data, setData] = React.useState([])
    const [toggle, setToggle] = React.useState(false)
    

    const onToggle = ()=>{
        setToggle(!toggle)
    }

    // const getData = async ()=>{
    //     await app.firestore().collection("userDatas").doc(currentUser.uid).get().then((value)=>{
    //         setData(value.data())
    //     })
    // }

    // React.useEffect(()=>{
    //         getData()
    //         console.log()
    // },[])

    return(
        <Container>
            <Wrapper>
                <LogoHolder>
                <Logo src={logo}/>
                </LogoHolder>
                {currentUser? 
                (<Name>Welcome back {data.firstname}</Name>)
            :null}
               {currentUser?
               ( <RightItems>
                <Avatar src={data.images}/>
                <Register 
                onClick={ app.auth().signOut()}>Logout</Register>
            </RightItems>) :
            (<Register>Register</Register>)}
            </Wrapper>
        </Container>
    )
}

export default Header


const Name = styled.div`
font-size: 15px;
color: white;
display: flex;
flex: 1;
`
const Register = styled.div`
width: 100px;
height: 30px;
display: flex;
justify-content: center;
align-items: center;
background-color: red;
border-radius: 4px;
color: white;
transform: scale(1);
transition: all 350ms;
:hover{
    transform: scale(1.02);
    cursor: pointer;
    background-color: lightgray;
}
`
const Avatar = styled.img`
width: 40px;
height: 40px;
display: flex;
border-radius: 50%;
object-fit: cover;
margin: 0 10px;
`
const RightItems = styled.div`
display: flex;
align-items: center;
`
const Logo = styled.img`
width: 150px;
height: 35px;
object-fit: cover;

`
const LogoHolder = styled.div`
display: flex;
flex: 1;
`
const Wrapper = styled.div`
width: 90%;
display: flex;
align-items: center;
`
const Container = styled.div`
width: 100%;
height: 70px;
display: flex;
justify-content: center;
background-color: black;
`

