import MsgMenu from './MsgMenu'

// import {BiDownload} from 'react-icons/bi'
import file from '../../../../assets/img/file.svg'

const Message = ({messages, message, setShowReply, setReplyToMsg}) => {
   const reply = messages.find(msg => msg.msgID === message.replyTo)

   return (
      <li className='relative group flex flex-col gap-1 focus-within:shadow-md focus-within:bg-mainBg/[.25] hover:shadow-md hover:bg-mainBg/[.25] transition-all duration-200 ease-in-out p-2 rounded-md'>
         <MsgMenu 
            message={message}
            setShowReply={setShowReply}
            setReplyToMsg={setReplyToMsg}
         />


         {message.replyTo &&
            <>   
               <svg viewBox='-1 -1 100 100' className='absolute -top-1 left-5 w-10'>
                  <path className='fill-none stroke-[5px] stroke-light_1/[.85]' d="
                     M  100,50
                     L  50,50
                     Q  30,50
                        30,68 
                  "/>
               </svg>
               <small className='ml-14 mr-32 text-xs text-light_1/[.75] truncate'>
                  {'@' + reply.author + ': ' + reply.msg}
               </small>
            </>
         }

         <div className='flex gap-1 items-end'>
            <div className='relative w-[3.05rem] h-[3.05rem] rounded-full bg-mainBg flex items-center justify-center'>
               <img src={message.authorIcon} alt="user Icon" className='w-[2.75rem] h-[2.75rem] rounded-full object-cover'/>
            </div>
            <div className='flex gap-1 items-center'>
               <p className='font-bold'>{message.author} - </p>
               <small className='text-xs text-light_1/[.75]'>{message.timestamp}</small>
            </div>
         </div>
         {message.file && (
               message.fileName.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/) 
               ?
                  <div className='group/file relative w-max'>
                     <img src={message.file} alt="msg File"/>
                  </div>
                  
               :
                  <div className='group/file relative w-max flex gap-2 items-end p-2 rounded-md bg-light_1/[.25]'>
                     <img src={file} alt="file" className='h-10'/>
                     <small>{message.fileName}</small>
                  </div>
            )
         }
         <p className='ml-5 text-light_1/[.95]'>{message.msg}</p>
      </li>
   )
}

export default Message