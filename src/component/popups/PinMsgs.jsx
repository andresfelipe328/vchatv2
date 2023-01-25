import {useCallback, useEffect, useRef, useState} from 'react'
import { useParams } from 'react-router-dom'
import { MDBBtn } from 'mdb-react-ui-kit'
import { useUserContext } from '../../context/UserContext'

import { BsFillPinAngleFill } from 'react-icons/bs'
import { FaTimes } from 'react-icons/fa'
import Collapse from '../../hooks/Collapse'

const STYLE = {width: 'max-content'}

const PinMsgs = ({messages}) => {
   const {id, subID} = useParams()
   const {pinMsg} = useUserContext()
   const [show, setShow] = useState(false)
   const ref = useRef(null)
   
   const toggleShow = useCallback(() => {
      setShow(!show)
      if (show)
         ref.current.blur()
   },[show])

   useEffect(() => {
      const handleClick = (event) => {
         if (show) 
            if (ref.current && !ref.current.contains(event.target)) {
               toggleShow()
            }
         };

         document.addEventListener('click', handleClick, true);

      return () => {
      document.removeEventListener('click', handleClick, true);
      };
   }, [ref, show, toggleShow])

   const handlePinMsg = async (message) => {
      const type = !subID ? '01' : '02' 
      await pinMsg(type, id, message.msgID, !message.pinned, subID)
   }

   return (
      <div className='relative z-10' ref={ref}>
         <MDBBtn className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1' onClick={toggleShow}>
            <BsFillPinAngleFill className='text-light_1 text-xl'/>
         </MDBBtn>

         <Collapse show={show} style={STYLE}>
            <h4 className='p-2 shadow-sm'>
               Pinned Messages:
            </h4>
            { !messages?.find(msg => msg.pinned === true)
               ?
                  <div className='flex p-2 flex-col gap-1 items-center justify-center'>
                     <BsFillPinAngleFill/>
                     <small className='text-xs'>There are no pinned messages</small>
                  </div>
               :
                  <ul className='p-2 flex flex-col gap-1'>
                     {messages.map(msg => {
                        if (msg.pinned)
                           return (
                              <li key={msg.msgID} className='relative flex gap-1 p-3 pt-6 items-center bg-mainBg/[.45] rounded-md'>
                                 <div className='absolute top-0 right-0 flex rounded-md'>
                                    <button className='p-1 hover:bg-mainBg rounded-md transition-all duration-200 ease-in-out'>
                                       <small className='text-xs font-bold'>
                                          jump
                                       </small>
                                    </button>
                                    <button onClick={async () => await handlePinMsg(msg)} className='group p-1 hover:bg-mainBg rounded-md transition-all duration-200 ease-out'>
                                       <FaTimes className='text-xs group-hover:text-red-700'/>
                                    </button>
                                 </div>
                                 <div className='relative w-[3.5rem] h-[3.5rem] rounded-full bg-mainBg flex items-center justify-center'>
                                    <img src={msg.authorIcon} alt="user Icon" className='w-[3.05rem] h-[3.05rem] rounded-full object-cover'/>
                                 </div>

                                 <div className='flex flex-col gap-1'>
                                    <div className='flex gap-2 items-center'>
                                       <p className='font-bold'>{msg.author}</p>
                                       <small className='text-xs text-light_1/[.75]'>{msg.timestamp}</small>
                                    </div>
                                    <p>{msg.msg}</p>
                                 </div>
                              </li>
                           )
                        return null
                     })}
                  </ul>
            }
         </Collapse>
      </div>
   )
}

export default PinMsgs