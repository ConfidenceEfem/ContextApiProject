import React,{useContext} from 'react'
import styled from "styled-components"
import {BsFillCameraVideoFill} from "react-icons/bs"
import {AiFillLike, AiOutlineLike} from "react-icons/ai"
import {BiComment} from "react-icons/bi"
import {app} from "../base"
import {AuthContext} from "../components/AuthProvider"
import firebase from "firebase"
import Profile from './Profile'
import LikeComp from './LikeComp'
import CommentComp from './CommentComp'
import CommentNumber from "./CommentNumber"
import {useNavigate} from "react-router-dom"
const TheHome = () => {
    const navigate = useNavigate()
    const {currentUser} = useContext(AuthContext)
    const [comment, setComment] = React.useState("")

    const [likeToggle, setLikeToggle] = React.useState(false)

    const [userData, setUserData] = React.useState([])
    const [currentData, setCurrentData] = React.useState([])

    const [toggle, setToggle] = React.useState(false)

    const onToggle = ()=>{
        setToggle(!toggle)
    }
    

    const getPost = async ()=>{
        await app.firestore().collection("post").orderBy("createdAt", "desc").onSnapshot((snapshot)=>{
            const r = []
            snapshot.forEach((doc)=>{
                r.push({...doc.data(),id: doc.id})
            })
            setUserData(r)
        })
        // console.log(userData)
    }

    React.useEffect(()=>{
        getPost()
    },[])

  

    const [data, setData] = React.useState([])
    const [image, setImage] = React.useState("")
    // const [movie, setMovie] = React.useState("")
    const [content, setContent] = React.useState("")



    const getData = async ()=>{
        await app.firestore().collection("pratice").doc(currentUser?.uid).get().then((store)=>{
            setData(store.data())
        })
    }

    React.useEffect(()=>{
        getData()
      
    },[data])

    
    const uploadPhoto = async (e)=>{
        const file = e.target.files[0]
        const save = URL.createObjectURL(file)

        const fileRef = await app.storage().ref()
        const storageRef = fileRef.child("img/" + file.name).put(file)
        storageRef.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot)=>{
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

    const pushData = async ()=>{
        await app
        .firestore()
        .collection("post")
        .doc()
        .set({
            content,
            image,
            createdBy: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
    
    
    navigate("/")
        setContent("")
        setImage("")


    }

    
    return (
        <Container>
            <Wrapper>
               <CardBody>
                   <Up>
                       <Avatar src={data?.avatar}/>
                       <Input placeholder={`What's on your mind ${data?.name}`}
                       type="text"
                       value={content}
                       onChange={(e)=>{
                           setContent(e.target.value)
                       }}/>
                   </Up>
                   <Down>
                       <IconAndText bg="red" htmlFor="video">
                           <span >
                               <BsFillCameraVideoFill/>
                           </span>
                           <Text>Video</Text>
                       </IconAndText>
                       <input type="file" id="video" accept="video/mp4" style={{display: "none"}} onChange={uploadPhoto}/>
                       <IconAndText bg="Green" htmlFor="photo">
                           <span >
                               <BsFillCameraVideoFill/>
                           </span>
                           <Text>Photo</Text>
                       </IconAndText>
                       <input type="file" id="photo" accept="image/png, image/jpeg, image/jpg, image/gif"style={{display: "none"}} onChange={uploadPhoto}/>
                   </Down>
                   <Posts onClick={pushData}>Post</Posts>
               </CardBody>
               <HomeMainPost>
                     
{userData?.map((props)=>(
                          <ThePost key={props.id}>
                               <Profile current={props.createdBy} identity={props.id}
                               time={props.createdAt}/>
                               <WriteUp><span>{props.content}</span></WriteUp>
                              {
                                  (props.image).split(".")[5].split("?")[0]==="mp4"? 
                                  <VideoPost controls src={props.image}/>:
                                  (props.image).split(".")[5].split("?")[0]==="jpg" || 
                                  (props.image).split(".")[5].split("?")[0]==="jpeg" ||
                                  (props.image).split(".")[5].split("?")[0]==="png" ||
                                  (props.image).split(".")[5].split("?")[0]==="gif"? 
                                  <PostPictures src={props.image}/> : null     
                              }
                             <LikeNameComment>
                               <LikeNumberName>
                               <Onw>
                                <LikeComp myId={props.id} icon/>
                                <LikeComp myId={props.id} myself/>
                                <LikeComp myId={props.id} number/>
                                <LikeComp myId={props.id} others/>
                                </Onw>
                                <Names>
                                <LikeComp myId={props.id} mapName/>
                                </Names>
                               </LikeNumberName>
                             {/* <LikeComp myId={props.id} number /> */}
                             <div style={{display:"flex", alignItems: "center"}}>
                             <CommentNumber id={props.id}/>
                                 <CommentsNumber>
                                        Comments
                                  </CommentsNumber>
                             </div>
                               </LikeNameComment>
                               <LiveCommentIcon>
                                   <LikeComp myId={props.id} view/>
                                   <LikeClickHolder fs="15px" bg="gray" onClick={onToggle}>
                                       <BiComment/>
                                       <span>Comment</span>
                                   </LikeClickHolder>
                               </LiveCommentIcon>
                               <CommentComp id={props.id} created={props.createdBy} toggle={toggle} setToggle={setToggle}/>
                               {/* <ProfileCommentStickers>  
                               <PictureBox>
                                   <Picture src={data?.avatar}/>
                                   <ActiveCircle></ActiveCircle>
                               </PictureBox>
                               <InputHolder 
                               onClick={(e)=>{

                                        console.log(comment)
                                        e.preventDefault()
                               }}
                               >
                                   <MyComment placeholder="Write a comment"
                                   value={comment}
                                   onChange={(e)=>{
                                       setComment(e.target.value)
                                   }}/>
                                   <CommentSticker type="submit">
                                      Send
                                   </CommentSticker>
                               </InputHolder>
                               </ProfileCommentStickers> */}
                          </ThePost>
))}
                    </HomeMainPost>
            </Wrapper>
        </Container>
    )
}

export default TheHome
const LikeNumberName = styled.div`
position: relative;
`
const Names = styled.div`
position: absolute;
color: white;
z-index: 2;
/* width: 150px; */
background-color: rgb(0,0,0,0.7);
top: 30px;
left: 10px;
display: flex;
justify-content: center;
/* padding: 10px 10px; */
padding-bottom: 10px;
padding-left: 10px;
padding-right: 10px;
padding-top: 30px;
border-radius: 4px;
opacity: 0;
text-align: left;
:hover{
    opacity: 1;
}

`
const VideoPost = styled.video`
width: 100%;
display: flex;
object-fit: cover;
height: 300px;
background-color: black;
`
const Posts = styled.div`
width: 120px;
height: 40px;
display: flex;
justify-content: center;
align-items: center;
background-color: gold;
/* color: green; */
font-size: 13px;
`
const Text = styled.div`
font-size: 17px;
font-weight: bold;
font-family: arial;
`
const IconAndText = styled.label`
display: flex;
align-items: center;
justify-content: center;
height: 50px;
width: 150px;
transition: all 350ms;
margin: 0 20px;
:hover{
    background-color: rgba(0,0,0,0.2);
    cursor: pointer;
}
span{
font-size: 22px;
margin-right: 10px;
color: ${({bg})=>bg};
display: flex;
align-items: center;

}
`
const Input = styled.input`
border: none;
outline: none;
background-color: #eee;
border-radius: 25px;
width: 500px;
height: 48px;
padding-left: 10px;
display: flex; 
flex: 1;
::placeholder{
    /* padding-left: 10px; */
    opacity: 0.7;
}
`
const Avatar = styled.img`
width: 40px;
height: 40px;
border-radius: 50%;
/* border: solid 2px black; */
margin-right: 15px;
`
const Down = styled.div`
display: flex;
align-items:center;
justify-content: center;
width: 90%;
`
const Up = styled.div`
margin-top: 15px;
margin-bottom: 20px;
display: flex;
width: 93%;
align-items: center;
`
const CardBody = styled.div`
display: flex;
flex-direction: column;
align-items:center;
width: 600px;
box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
height: 200px;
margin-bottom: 40px;
background-color: white;
`
const Wrapper = styled.div`
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
align-items: center;
font-size:30px;
font-family: Arial, Helvetica, sans-serif;
text-align: center;
color: black;
margin-top: 40px;
/* font-weight: bold; */
`
const Container = styled.div`
width: 100%;
min-height:calc(100vh - 70px);
height: 100%;
display: flex;
justify-content: center;
align-items: center;
background-color: #eee;
`


const HomeMainPost = styled.div`
width: 40%;
height: 100%;
/* background-color: white; */
display: flex;
flex-direction: column;
align-items: center;
margin-bottom: 30px;
`

const OneSticker = styled.div``
const CommentSticker = styled.button`
outline: none;
border: none;
display: none;
`
const MyComment = styled.input`
display: flex;
padding-left: 10px;
outline: none;
border: none;
background-color:transparent;
height: 30px;
width: 60%;

::placeholder{
font-size: 12px;
color: black;
}
`
const InputHolder = styled.form`
width: 90%;
background-color: #eee;
display: flex;
align-items: center;
border-radius: 20px;
justify-content: space-between;
`
const LikeClickHolder = styled.div`
display: flex;
align-items: center;
transform: scale(1);
transition: all 350ms;
font-size: ${({fs})=>fs};
color: ${({bg})=>bg};
justify-content: center;
align-items: center;

:hover{
    transform: scale(1.02);
    cursor: pointer;
}
span{
    font-size: 12px;
    margin-left: 5px;
}
`

const CommentsNumber = styled.div`
font-size: 12px;
color: gray;
`
const LikerName = styled.div`
font-size: 12px;
color: gray;
`
const Like = styled(AiFillLike)`
color: blue;
font-size: 13px;
margin-right: 5px;
`
const Onw = styled.div`
display: flex;
align-items: center;
/* position: relative; */
`


const PosterDate = styled.div`
font-size: 10px;
margin-top: 1px;
`
const PosterName = styled.div`
font-weight: bold;
font-size: 12px;
font-family: Arial, Helvetica, sans-serif;
`
const NameTime = styled.div``
const ProfileCommentStickers = styled.div`
display: flex;
align-items: center;
width: 95%;
margin-bottom: 20px;
margin-top: 10px;
`
const LiveCommentIcon = styled.div`
width: 90%;
display: flex;
justify-content: space-around;
align-items: center;
border-top: solid 2px #eee;
border-bottom: solid 2px #eee;
margin-bottom: 10px;
padding: 3px 0;
margin-top: 10px;

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
text-align: left;
/* align-items: flex-start; */
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
const ThePost = styled.div`
width: 100%;
min-height: 300px;
height: 100%auto;
display: flex;
flex-direction: column;
background-color: white;
align-items: center;
border-radius: 7px;
`

const Picture = styled.img`
width: 35px;
height: 35px;
border-radius: 50%;
object-fit: cover;
/* background-color: blue; */

`
const ActiveCircle = styled.div`
position: absolute;
width: 8px;
height: 8px;
border-radius: 50%;
background-color: #31A24C;
border: 2px solid white;
/* top: 0; */
right: 0;
bottom: 0;
`
const PictureBox = styled.div`
display: flex;
position: relative;
/* background-color: purple; */
width: 40px;
height: 35px;
margin-right: 10px;
`