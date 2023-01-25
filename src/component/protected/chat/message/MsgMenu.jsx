import  { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MDBBtn, MDBCollapse } from 'mdb-react-ui-kit'

import {MdOutlineAddReaction, MdOutlineReply, MdOutlineMoreHoriz} from 'react-icons/md'
import {BsFillPinAngleFill} from 'react-icons/bs'
import {FaTrash} from 'react-icons/fa'
import {AiFillEdit} from 'react-icons/ai'
import { useUserContext } from '../../../../context/UserContext'


const MsgMenu = ({message, setShowReply, setReplyToMsg}) => {
   const {id,subID} = useParams()
   const {user, pinMsg, deleteMsg} = useUserContext()
   const [show, setShow] = useState(false)
   const ref = useRef(null)
   
   const toggleShow = useCallback(() => {
      setShow(!show)
      if (show)
         ref.current.blur()
   },[show])

   useEffect(() => {
      const handleClick = (event) => {
         if (show) {
            if (ref.current && !ref.current.contains(event.target))
               toggleShow()
         }
         };

         document.addEventListener('click', handleClick, true);

      return () => {
      document.removeEventListener('click', handleClick, true);
      };
   }, [ref, show, toggleShow])

   const handleReplyToMsg = () => {
      setShowReply(true)
      setReplyToMsg(message)
   }

   const handlePinMsg = async () => {
      const type = !subID ? '01' : '02' 
      await pinMsg(type, id, message.msgID, !message.pinned, subID)
   }

   const handleDelete = async () => {
      const type = !subID ? '01' : '02'
      await deleteMsg(type, id, message, subID)
   }

   return (
      <div className='absolute flex items-center right-3 opacity-0 -top-3 p-2 focus-within:shadow-md focus-within:bg-subBg focus-within:opacity-100 group-hover:shadow-md group-hover:bg-subBg group-hover:opacity-100 transition-all duration-200 ease-in-out rounded-md'>
         <button className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
            <MdOutlineAddReaction className='text-light_1 text-2xl'/>
         </button>

         <button onClick={handleReplyToMsg} className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
            <MdOutlineReply className='text-light_1 text-2xl'/>
         </button>

         <MDBBtn className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1' ref={ref} onClick={toggleShow}>
            <MdOutlineMoreHoriz className='text-light_1 text-2xl'/>
         </MDBBtn>

         <MDBCollapse show={show} className='absolute top-2 right-11 w-max rounded-md shadow-popup z-10'>
            <div className='flex flex-col gap-1 w-max p-2 bg-subBg rounded-md'>
               <button onClick={handlePinMsg} className='flex items-center gap-3 w-full hover:bg-mainBg/[.65] rounded-md p-1 transition-all duration-150 ease-out'>
                  <BsFillPinAngleFill/>
                  <small>{message.pinned ? 'unpin' : 'pin'}</small>
               </button>
               { message.author === user.displayName && 
                  <>
                     <button onClick={() => console.log('edit')} className='flex items-center gap-3 w-full hover:bg-mainBg/[.65] rounded-md p-1 transition-all duration-150 ease-out'>
                        <AiFillEdit/>
                        <small>edit</small>
                     </button>
                     <button onClick={handleDelete} className='group/dlt flex items-center gap-3 w-full hover:bg-red-700 rounded-md p-1 transition-all duration-150 ease-out'>
                        <FaTrash className='group-hover/dlt:text-mainBg text-red-700'/>
                        <small className='group-hover/dlt:text-mainBg text-red-700'>delete message</small>
                     </button>
                  </>
               }
            </div>
         </MDBCollapse>
      </div>
   )
}

export default MsgMenu