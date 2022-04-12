import React from "react"
import styled from "styled-components"
import { AuthContext } from '../components/AuthProvider'
import {app} from "../base"
const HeaderComp = ()=>{
    const [toggle, setToggle] = React.useState(false)
    const [data, setData] = React.useState([])
const {currentUser} = React.useContext(AuthContext)


    const getData = async ()=>{
        await app.firestore().collection("SignUpDatas").doc(currentUser?.uid).get().then((store)=>{
            setData(store.data())
            console.log(data)
        })
    }

    React.useEffect(()=>{
getData()
console.log(data)
    },[])
    return(
        <Container>
            <Wrapper>
                <Logo>Logo</Logo>
                <Name>Welcome {data?.username}</Name>
                {currentUser?
                ( <Navigation>
                        <Avatar src={data?.image}/>
                        <Register onClick={ async ()=>{
                            await app.auth().signOut()
                        }}>Logout</Register>
                    </Navigation>)
                    :
                    (<Register>Register</Register>)}
            </Wrapper>
        </Container>
    )
}
export default HeaderComp 

const Avatar = styled.img`
width: 40px;
height: 40px;
border-radius: 50%;
margin-right: 10px;
border: solid 2px gray;
`
const Navigation = styled.div`
display: flex;
align-items: center;
`
const Register = styled.div`
width: 150px;
height: 40px;
display: flex;
justify-content: center;
align-items: center;
background-color: red;
border-radius: 5px;
font-size: 14px;
transform: scale(1);
transition:all 350ms;
:hover{
    transform: scale(1.02);
    background-color:gray;
    cursor: pointer;
}
`
const Name = styled.div`
display: flex;
flex: 1;
font-size: 14px;
font-family: arial;
`
const Logo = styled.div`
color: white;
font-size: 20px;
font-weight: bold;
font-family: hobo std;
display: flex;
flex: 1;
`
const Wrapper = styled.div`
width: 90%;
display: flex;
align-items: center;
color: white;
`
const Container = styled.div`
width: 100%;
height: 80px;
display: flex;
justify-content: center;
background-color: black;
`