import { useState } from 'react'

import ReplyingTo from '../../popups/ReplyingTo'
import MessageForm from '../../forms/MessageForm'
import MsgFile from '../../popups/MsgFile'

const SendingArea = ({replyToMsg, showReply, setShowReply, setReplyToMsg}) => {
   const [msgFile, setMsgFile] = useState(null)

   return (
      <div className='mt-auto'>
         <ReplyingTo 
            showReply={showReply}
            setShowReply={setShowReply}
            replyToMsg={replyToMsg}
            setReplyToMsg={setReplyToMsg}
         />

         <MsgFile
            msgFile={msgFile}
            setMsgFile={setMsgFile}
         />

         <MessageForm
            replyToMsg={replyToMsg} 
            showReply={showReply} 
            setShowReply={setShowReply}
            setReplyToMsg={setReplyToMsg}
            msgFile={msgFile}
            setMsgFile={setMsgFile}
         />
      </div>
   )
}

export default SendingArea