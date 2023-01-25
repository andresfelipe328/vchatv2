import {useCallback, useEffect, useRef, useState} from 'react'
import { useUserContext } from '../../context/UserContext'
import { MDBCollapse, MDBBtn } from 'mdb-react-ui-kit';

import { MdMoreHoriz } from 'react-icons/md'
import {HiSpeakerphone} from 'react-icons/hi'
import {FaTrash} from 'react-icons/fa'

const FriendMoreMenu = ({friend}) => {
   const {deleteFriend} = useUserContext()
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

   return (
      <div className='relative'>
         <MDBBtn ref={ref} onClick={toggleShow} className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
            <MdMoreHoriz className='text-2xl'/>
         </MDBBtn>

         <MDBCollapse show={show} className='absolute right-9 top-0 shadow-popup rounded-md z-10'>
            <div className='flex flex-col gap-1 w-max p-2 bg-subBg rounded-md'>
               <button className='flex items-center gap-2 w-full hover:bg-mainBg/[.65] rounded-md p-1 transition-all duration-150 ease-out'>
                  <HiSpeakerphone/>
                  <small>start voice call</small>
               </button>
               <button onClick={async () => await deleteFriend(friend)} className='group/dlt flex items-center gap-2 w-full hover:bg-red-700 rounded-md p-1 transition-all duration-150 ease-out'>
                  <FaTrash className='group-hover/dlt:text-mainBg text-red-700'/>
                  <small className='group-hover/dlt:text-mainBg text-red-700'>delete</small>
               </button>
            </div>
         </MDBCollapse>
      </div>
   )
}

export default FriendMoreMenu