import React,{useContext} from 'react'
import styled from "styled-components"
import {app} from "../base"
import {AiTwotoneDelete} from "react-icons/ai"
import {AuthContext} from "../components/AuthProvider"
import moment from "moment"


const Profile = ({current,identity,time}) => {
    const [data, setData]= React.useState([])
    const getData = async ()=>{
        await app.firestore().collection("pratice").doc(current).get().then((store)=>{
            setData(store.data())
        })
    }


    const deleteData = async ()=>{
        await app.firestore().collection("post").doc(identity).delete()
    }

    const {currentUser} = useContext(AuthContext)

    React.useEffect(()=>{
        getData()
            console.log(data)
    },[])

    return (
                             <PicNameTime key={data.id}>
                                  <Holder>
                                  <FirstProfile src={data.avatar}/>
                                   <NameTime>
                                       <PosterName>
                                      {data.name}
                                       </PosterName>
                                       <PosterDate>{moment(time.toDate()).fromNow()}</PosterDate>
                                   </NameTime>
                                  </Holder>
                                   {currentUser?.uid === current?
                                   (<DeleteIcon onClick={deleteData}>
                                    <AiTwotoneDelete/>
                                </DeleteIcon>): null}
                               </PicNameTime>
    )
}

export default Profile

const Holder = styled.div`
display: flex;
flex: 1;
`

const DeleteIcon = styled(AiTwotoneDelete)`
font-size: 20px;
color: red;
display: flex;
cursor: pointer;
`

const PosterDate = styled.div`
font-size: 10px;
margin-top: 5px;
display: flex;
justify-content: flex-start;
`
const PosterName = styled.div`
font-weight: bold;
font-size: 12px;
font-family: Arial, Helvetica, sans-serif;
display: flex;

`
const NameTime = styled.div`
display: flex;
flex-direction: column;
/* flex: 1; */
`

const LikeNameComment = styled.div`
width: 90%;
display: flex;
align-items: center;
justify-content: space-between;
margin:5px 0;
`
const PostPictures = styled.img`
width: 100%;
display: flex;
object-fit: cover;
height: 300px;
background-color: black;

`
const WriteUp = styled.div`
width: 90%;
display: flex;
color: black;
font-family: Arial, Helvetica, sans-serif;
font-size: 13px;
margin-bottom: 10px;
flex-wrap: wrap;
letter-spacing: 0.4px;
line-height: 20px;
`
const FirstProfile = styled.img`
width: 40px;
height: 40px;
object-fit: cover;
margin-right: 20px;
border-radius: 50%;
`
const PicNameTime = styled.div`
display: flex;
width: 90%;
align-items: center;
margin-top: 15px;
margin-bottom: 20px;
`
