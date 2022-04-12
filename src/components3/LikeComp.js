import React,{useState, useContext, useEffect} from 'react'
import { AiOutlineLike, AiFillLike } from 'react-icons/ai'
import styled from "styled-components"
import { app } from '../base'
import {AuthContext} from "../components/AuthProvider"
import MapName from './MapName'

const LikeComp = ({myId, view, number, icon, myself, others, mapName, commentTotal}) => {
    const {currentUser} = useContext(AuthContext)

    const [data, setData] = useState([])

    const pushLike = app.firestore().collection("post").doc(myId).collection("like")

    const pushChange = async ()=>{
        await pushLike.doc(currentUser.uid).set({
            likeBy: currentUser.uid,
            toggle: true,
           
        })
    }

    const deleteLIke = async ()=>{
        await pushLike.doc(currentUser.uid).delete()
    }

    const getData = async ()=>{
        await pushLike.onSnapshot((snap)=>{
            const store  = []
            snap.forEach((doc)=>{
                store.push({...doc.data(), id: doc.id})
            })
            setData(store)
        })
    }




//     (<LikeClickHolder fs="20px" 
//     onClick={()=>{
//         pushChange()
//     }}
//     >
//     <AiOutlineLike/>
//          <span>Like</span>
// </LikeClickHolder>

{/* <LikeClickHolder fs="20px"
onClick={()=>{
   
}}
>
 <AiOutlineLike/>
    <span>Like</span>
</LikeClickHolder> */}

    useEffect(()=>{
        getData()
    },[])
    return (
        <div>
            <div>
                {/* {commentTotal? 
                
                : null} */}
            </div>
            <div>
                {mapName? 
                    <div>
                        {data.map((props)=>(
                             <MapName likeBy={props.likeBy}/>
                        ))}
                    </div>
                 : null}
            </div>
            <div style={{margin: "0px 3px"}}>
                {number? 
                <div>
                    {data.find((el)=>el.id === currentUser.uid)? 
                    <LikerName>  
                    {data.length - 1 === -1 || data.length -1===0? null : 
                    <div>
                        {data.length - 1}
                        </div>}
                </LikerName>:
                 <LikerName>  
                     {data.length - 1 === -1 ? null : 
                     <div>{data.length}</div>}
                 </LikerName>}
                </div>
                 : null}
            </div>
            <div>
                {others? 
               <div>
                   {data.find((el)=>el.id === currentUser.uid)?
                    <div>
                        {data.length === 1 ? null :  <LikerName>  
                     Others, love this post 
                </LikerName>}
                    </div>
                : null}
               </div>
            : null}
            </div>
            <div>
                {myself? 
                 <div>
                     {data.find((el)=>el.id === currentUser.uid)? 
                     <LikerName style={{display: "flex"}}>  
                     <div >You</div>
                     <div>
                         {data.length === 1? null : 
                         <div style={{marginLeft: "3px"}}>and</div>}
                     </div>
                 </LikerName>
                  : null}
                 </div>
                : null}
            </div>
            <div>
            {icon?  
            <div>
                {data.find((el)=> el.id === currentUser.uid)?
                <Like/> : null}
            </div>
             : null}
            </div>
     <div>
         {view?  <div>
        {data.every((el)=>el.id !== currentUser.uid)? 
        (<LikeClickHolder fs="20px"
        onClick={()=>{
           pushChange()
        }}
        >
         <AiOutlineLike/>
            <span>Like</span>
        </LikeClickHolder>): (
            <div>
                {data?.map((props)=>(
              <div>
                  {props.likeBy === currentUser.uid? (
                      <div>
                          {props.toggle? (
                               <LikeClickHolder fs="20px" bg="blue"
                               onClick={()=>{
                                deleteLIke()
                               }}
                               >
                                <AiFillLike/>
                                   <span>Like</span>
                               </LikeClickHolder> 
                          ) : (
                            <LikeClickHolder fs="20px"
                            onClick={()=>{
                               pushChange()
                            }}
                            >
                             <AiOutlineLike/>
                                <span>Like</span>
                            </LikeClickHolder> 
                          )}
                      </div>
                  ) : null}
              </div>
          ))}
            </div>
        )}
          
      </div>: null}
     </div>
     </div>
        
    )
}

export default LikeComp

const Onw = styled.div`
display: flex;
align-items: center;
`


const LikeClickHolder = styled.div`
display: flex;
align-items: center;
transform: scale(1);
transition: all 350ms;
font-size: ${({fs})=>fs};
color: ${({bg})=>bg};
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
display: flex;
`
const Like = styled(AiFillLike)`
color: blue;
font-size: 13px;
margin-right: 5px;
`