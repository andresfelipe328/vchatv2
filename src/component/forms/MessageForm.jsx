import { useState } from 'react'
import { useParams } from 'react-router-dom'

import Resizer from "react-image-file-resizer"
import { v4 as uuidv4 } from 'uuid';
import { useUserContext } from '../../context/UserContext'
import ReactTextareaAutosize from 'react-textarea-autosize'

import { AiOutlineGif } from 'react-icons/ai'
import { BiUpload } from 'react-icons/bi'
import { MdOutlineAddReaction } from 'react-icons/md'

const MessageForm = ({replyToMsg, showReply, setShowReply, setReplyToMsg, msgFile, setMsgFile}) => {
   const {id, subID} = useParams()
   const {user, sendMessage} = useUserContext()
   const [msg, setMsg] = useState('')

   const onEnterPress = async (e) => {
      if(e.keyCode === 13 && e.shiftKey === false) {
         e.preventDefault();
         if (msg.length > 0 || msgFile) {
            const msgID = uuidv4()
            let type = '01'
            const message = {
               messageID: msgID,
               messageAuthor: user.displayName,
               authorIcon: user.photoURL,
               msg: msg,
               messageFileName: msgFile?.name || null,
               messageFile: msgFile,
               pinned: false,
               replyTo: replyToMsg ? replyToMsg.msgID : null,
               timestamp: new Date().toLocaleString()
            }
            
            if (subID)
               type = '02'
            await sendMessage(type, id, message, subID)
   
            if (msgFile)
               setMsgFile(null)
   
            if (showReply) {
               setShowReply(!showReply)
               setReplyToMsg(null)
            }
            setMsg('')
            const parentElem = document.getElementById("messages")
   
            const lastChild = parentElem.childNodes[parentElem.childNodes.length - 1]
            lastChild.scrollIntoView({behavior: "smooth"})
         }
      }
   }

   const handleMsgFile = async (e) => {
      try {
         let file = e.target.files[0];

         if (file.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/))
            file = await resizeFile(file);
         setMsgFile(file)
      } catch (err) {
         console.log(err);
      }
   }

   const resizeFile = (file) =>
      new Promise((resolve) => {
         Resizer.imageFileResizer(
            file,
            300,
            300,
            "JPEG",
            100,
            0,
            (uri) => {
            resolve(uri);
            },
            "file"
         );
      });

   const handleAddFile = async (e) => {
      e.target.value=""
   }

   return (
      <div className='flex items-center shadow-input p-2 mx-2 mb-2 rounded-md'>
         <label htmlFor="msg_file" className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
            <BiUpload className='text-xl text-light_1'/>
         </label>
         <input
            onChange={handleMsgFile}
            onClick={handleAddFile}
            type='file'
            style={{display: 'none'}}
            id ='msg_file'
            required
         />

         <ReactTextareaAutosize 
            placeholder={`@${user.displayName} message...`}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={onEnterPress}
            value={msg}
            className='flex-1'
            id='msg-input'
         />

         <div className='flex items-center'>
            <button className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
               <AiOutlineGif className='text-xl text-light_1'/>
            </button>   
            <button>

            </button>
            <button className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
               <MdOutlineAddReaction className='text-xl text-light_1'/>
            </button>
         </div>
      </div>
   )
}

export default MessageForm