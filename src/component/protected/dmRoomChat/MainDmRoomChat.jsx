import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { BsFillBellFill, BsFillTelephoneOutboundFill } from 'react-icons/bs'
import { collection, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../../config/firebase'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';

import SendingArea from '../chat/SendingArea'
import AddToDmRoom from '../../popups/AddToDmRoom'
import ChatContents from './DmRoomChatContents'
import PinMsgs from '../../popups/PinMsgs';


const MainDmRoomChat = () => {
   const {id} = useParams()
   const [showReply, setShowReply] = useState(false)
   const [replyToMsg, setReplyToMsg] = useState(null)

   const dmRoomRef = doc(db, 'dmRooms', id)
   const [data] = useDocumentData(dmRoomRef)
   const messagesRef = query(collection(db, `dmRooms/${id}`, 'messages'), orderBy('timestamp', "asc"))
   const [messages] = useCollectionData(messagesRef);

   return (
      <div className='flex flex-col w-full h-full'>
         <ul className='flex gap-1 items-center justify-end shadow-sm p-2'>
            <li>
               <button className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
                  <BsFillTelephoneOutboundFill className='text-light_1 text-xl'/>
               </button>
            </li>
            <li>
               <button className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
                  <BsFillBellFill className='text-light_1 text-xl'/>
               </button>
            </li>
            <li>
               <PinMsgs messages={messages}/>
            </li>
            <AddToDmRoom data={data}/>
            <li>
               <input type="text" placeholder='search...' className='bg-mainBg'/>
            </li>
         </ul>

         <ChatContents 
            data={data} 
            messages={messages}
            setShowReply={setShowReply}
            setReplyToMsg={setReplyToMsg}
         />

         <SendingArea
            replyToMsg={replyToMsg}
            showReply={showReply}
            setShowReply={setShowReply}
            setReplyToMsg={setReplyToMsg}
         />
      </div>
   )
}

export default MainDmRoomChat