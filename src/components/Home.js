import React from "react"
import styled from "styled-components"
const Home = ()=>{
    return(
        <Container>
            Welcome to Home Page
        </Container>
    )
}
export default Home

const Container = styled.div`
width: 100%;
height: calc(100vh - 70px);
display: flex;
justify-content: center;
align-items: center;
font-size: 20px;
color:red;
`