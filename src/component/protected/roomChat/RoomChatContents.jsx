import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import gsap from 'gsap'

import { BsFillChatLeftTextFill } from 'react-icons/bs'
import { HiSpeakerphone } from 'react-icons/hi'

import Message from '../chat/message/Message'

const RoomChatContents = ({data, messages, setShowReply, setReplyToMsg}) => {
   const {id, subID} = useParams()

   const contentRef = useRef(null)
   useEffect(() => {
      gsap.fromTo(contentRef.current, 
         {x: -10, opacity: 0}, 
         {duration: 1, x: 0, opacity: 1, delay: .15, ease: "elastic.out(1, 0.75)"}
      )
   }, [id, subID])


   // useEffect(() => {
   //    if (messages?.length > 0) {
   //       const parentElem = document.getElementById("messages")
   
   //       const lastChild = parentElem.childNodes[parentElem.childNodes.length - 1]
   //       lastChild.scrollIntoView({behavior: "smooth"})
   //    }
   // }, [messages])

   const handleMiniRoomName = () => {
      if (data) {
         if (subID === data.mainMiniRoom)
            return displayMainMiniRoomName()
         else
            return displayMiniRoomName()
      }
   }

   const displayMainMiniRoomName = () => {
      return (
         <>
            <div className='flex items-end gap-2'>
               <div className='relative w-[7.05rem] h-[7.05rem] rounded-full bg-mainBg flex items-center justify-center'>
                  <img src={data.roomIcon} alt="user Icon" className='w-[6.75rem] h-[6.75rem] rounded-full object-cover'/>
               </div>
               <h1> {data.roomName} </h1>
            </div>
            <h4 className='mb-2 text-light_1/[.65] text-xs'> This is the beginning of {data.roomName} Room.</h4>
         </>
      )
   }

   const displayMiniRoomName = () => {
      let miniRoom
      for (let i = 0; i < data.mainRooms.length; ++i) {
         miniRoom = data.mainRooms[i].miniRooms.find(miniRoom => miniRoom.miniRoomID === subID)
         if (miniRoom)
            break
      }
      const icon = miniRoom?.miniRoomType === 'text' 
      ? <BsFillChatLeftTextFill className='text-light_1/[.65]'/> 
      : <HiSpeakerphone className='text-light_1/[.65]'/>

      return (
         <>
            <div className='flex items-end gap-2'>
               <h1 className='flex items-center gap-2'>Welcome to - {icon} {miniRoom?.miniRoomName}</h1>
            </div>
            <h4 className='mb-2 text-light_1/[.65] text-xs'> This is the beginning of {miniRoom?.miniRoomName} mini Room.</h4>
         </>
      )
   }

   return (
      <div className='flex flex-col h-full justify-start overflow-auto p-2' ref={contentRef}>
         <div className='flex flex-col gap-2 border-b-2 border-light_1/[.7] mt-auto'>
            {handleMiniRoomName()}
         </div>

         { messages &&
            <ul className='flex flex-col gap-1 p-2' id='messages'>
               { messages.map((message) => (
                  <Message
                     messages={messages} 
                     message={message} 
                     key={message.msgID}
                     setShowReply={setShowReply}
                     setReplyToMsg={setReplyToMsg}
                  />
               ))}
            </ul>
         }
      </div>
   )
}

export default RoomChatContents