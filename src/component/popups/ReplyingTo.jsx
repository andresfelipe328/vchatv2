import React from 'react'
import { FaTimes } from 'react-icons/fa'

import { MDBBtn, MDBCollapse } from 'mdb-react-ui-kit'

const ReplyingTo = ({showReply, setShowReply, replyToMsg, setReplyToMsg}) => {

   const toggleShow = () => {
      if (showReply)
         setReplyToMsg(null)
      setShowReply(!showReply)
   }

   return (
      <MDBCollapse  show={showReply}>
         <div className='flex rounded-t-md mx-2 mb-1 bg-light_1'>
            <small className='flex-1 text-sm font-bold text-mainBg p-2'>Replying to {replyToMsg?.author}</small>
            <MDBBtn className='group hover:bg-mainBg p-2 rounded-tr-md transition-all duration-200 ease-out' onClick={toggleShow}>
               <FaTimes className='text-lg text-mainBg group-hover:text-light_1/[.85]'/>
            </MDBBtn>
         </div>
      </MDBCollapse>
   )
}

export default ReplyingTo