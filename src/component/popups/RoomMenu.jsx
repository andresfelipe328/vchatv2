import {useState, useEffect, useRef, useCallback} from 'react'

import { useUserContext } from '../../context/UserContext'
import { MDBBtn, MDBCollapse } from 'mdb-react-ui-kit'

import { BsFillCaretDownFill } from 'react-icons/bs'
import { FaUserPlus, FaTrash, FaFolderPlus } from 'react-icons/fa'

const RoomMenu = ({data, showNewMR, setShowNewMR}) => {
   const [show, setShow] = useState(false)
   const ref = useRef(null) 
   const {user, deleteRoom, leaveRoom} = useUserContext()
   
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

   const handleDeleteRoom = async (mode) => {
      if (mode === 'owner')
         await deleteRoom(data)
      else
         await leaveRoom(data.roomID)
      setShow(!show)
   }

   const handleCreateNewMR = () => {
      setShowNewMR(!showNewMR)
      setShow(!show)
   }

   return (
      <div ref={ref}>
         <MDBBtn onClick={toggleShow} className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
            <BsFillCaretDownFill className='text-light_1 text-lg'/>
         </MDBBtn>

         <MDBCollapse show={show} className='absolute top-9 left-2 w-max rounded-md shadow-popup z-30'>
            <div className='p-4 bg-subBg rounded-md flex flex-col gap-1'>
               {user.uid === data?.userID && 
                  <>   
                     <button className='flex items-center gap-3 w-full rounded-md p-1 hover:bg-mainBg transition-all duration-200 ease-in-out'>
                        <FaUserPlus className='text-sm text-light_1/[.75]'/>
                        <small className='font-semibold text-light_1'>invite to room</small>
                     </button>
                     <button onClick={handleCreateNewMR} className='flex items-center gap-3 w-full rounded-md p-1 hover:bg-mainBg transition-all duration-200 ease-in-out'>
                        <FaFolderPlus className='text-sm text-light_1/[.75]'/>
                        <small className='font-semibold text-light_1'>create main room</small>
                     </button>
                  </>
               }
               {user.uid === data?.userID 
                  ?
                     <button onClick={()=>handleDeleteRoom('owner')} className='group flex items-center gap-3 w-full rounded-md p-1 hover:bg-red-700 transition-all duration-200 ease-in-out'>
                        <FaTrash className='text-sm text-red-700 group-hover:text-mainBg'/>
                        <small className='font-semibold text-light_1 group-hover:text-mainBg'>delete room</small>
                     </button>
                  :
                     <button onClick={()=>handleDeleteRoom('ptc')} className='group flex items-center gap-3 w-full rounded-md p-1 hover:bg-red-700 transition-all duration-200 ease-in-out'>
                        <FaTrash className='text-sm text-red-700 group-hover:text-mainBg'/>
                        <small className='font-semibold text-light_1 group-hover:text-mainBg'>delete room</small>
                     </button>
               }
            </div>
         </MDBCollapse>
      </div>
   )
}

export default RoomMenu