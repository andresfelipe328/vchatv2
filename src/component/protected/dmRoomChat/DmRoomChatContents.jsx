import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useUserContext } from '../../../context/UserContext'

import gsap from 'gsap'
import { RiGroupFill } from 'react-icons/ri'
import { pickIconColor } from '../../../utils/helpers'
import Message from '../chat/message/Message'

const DmRoomChatContents = ({data, messages, setShowReply, setReplyToMsg}) => {
   const {id} = useParams()
   const {user, friends} = useUserContext()

   const contentRef = useRef(null)
   useEffect(() => {
      gsap.fromTo(contentRef.current, 
         {x: -10, opacity: 0}, 
         {duration: 1, x: 0, opacity: 1, delay: .15, ease: "elastic.out(1, 0.75)"}
      )
   }, [id])

   // useEffect(() => {
   //    if (messages?.length > 0) {
   //       const parentElem = document.getElementById("messages")
   
   //       const lastChild = parentElem.childNodes[parentElem.childNodes.length - 1]
   //       lastChild.scrollIntoView({behavior: "smooth"})
   //    }
   // }, [messages])

   const displayDmRoomIcon = () => {
      if (data) {
         const nameList = data.dmRoomName.split(', ')
   
         if (nameList.length < 3) {
            const participant = nameList.filter(name => name !== user.displayName).join(', ')
            const friend = friends.find(friend => friend.friendUsername === participant)
            if (friend)
               return (
                  <div className='relative w-[7.05rem] h-[7.05rem] rounded-full bg-mainBg flex items-center justify-center'>
                     <img src={friend.friendIcon} alt="user Icon" className='w-[6.75rem] h-[6.75rem] rounded-full object-cover'/>
                  </div>
               )
         }

         return (
            <div className='w-[7.05rem] h-[7.05rem] rounded-full border-2 border-mainBg flex items-center justify-center' style={{backgroundColor: data.dmRoomIcon}}>
               <RiGroupFill className='text-5xl' style={{color: pickIconColor(data.dmRoomIcon, '#504538', '#fbf2e0')}}/>
            </div>
         )
      }
   }

   const displayDmRoomName = () => {
      if (data) {
         const nameList = data.dmRoomName.split(', ')
         const newDmRoomName = nameList.filter(name => name !== user.displayName).join(', ')
   
         return newDmRoomName
      }
   }
   
   return (
      <div className='flex flex-col h-full justify-start overflow-auto p-2' ref={contentRef}>
         <div className='flex flex-col border-b-2 border-light_1/[.7] mt-auto'>
            {displayDmRoomIcon()}
            <h1> {displayDmRoomName()} </h1>
            <h4 className='mb-2 text-light_1/[.65] text-xs'> This is the beginning of {displayDmRoomName()} DM Room.</h4>
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

export default DmRoomChatContents