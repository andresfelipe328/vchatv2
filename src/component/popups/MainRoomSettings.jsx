import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { MDBBtn, MDBCollapse } from 'mdb-react-ui-kit'
import { useUserContext } from '../../context/UserContext'

import {IoSettingsSharp} from 'react-icons/io5'
import { FaTrash } from 'react-icons/fa'
import {AiFillEdit} from 'react-icons/ai'

const MainRoomSettings = ({name, setTypeEdit, setShowEdit, setEditName}) => {
   const [show, setShow] = useState(false)
   const ref = useRef(null)
   const {id} = useParams()
   const {editMainMiniName} = useUserContext()
   
   const toggleShow = useCallback(() => {
      setShow(!show)
      if (show)
         ref.current.blur()
   },[show])

   useEffect(() => {
      const handleClick = (event) => {
         if (show) 
            if (ref.current && !ref.current.contains(event.target))
               toggleShow()
         }

         document.addEventListener('click', handleClick, true);

      return () => {
      document.removeEventListener('click', handleClick, true);
      };
   }, [ref, show, toggleShow])

   const handleEditName = () => {
      setTypeEdit('main')
      setEditName(name)
      setShow(!show)
      setShowEdit(true)
   }

   const handleDeleteMainRoom = async () => {
      await editMainMiniName('main', name, '', id)
   }
   return (
      <div ref={ref}>
         <MDBBtn onClick={toggleShow} className='p-1 rounded-md hover:bg-mainBg hover hover:shadow-sm transition-all duration-200 ease-in-out'>
            <IoSettingsSharp className='text-light_1 text-xs'/>
         </MDBBtn>

         <MDBCollapse show={show} className='absolute top-6 right-[.02rem] w-max rounded-md shadow-popup bg-subBg z-30'>
            <div className='p-2 bg-subBg rounded-md flex gap-2 items-center'>
               <button onClick={handleEditName} className='p-2 rounded-md hover:bg-mainBg hover hover:shadow-sm transition-all duration-200 ease-in-out'>
                  <AiFillEdit className='text-light_1/[.85]'/>
               </button>
               <button onClick={handleDeleteMainRoom} className='group p-2 rounded-md hover:bg-red-700 hover hover:shadow-sm transition-all duration-200 ease-in-out'>
                  <FaTrash className='text-red-700 group-hover:text-mainBg'/>
               </button>
            </div>
         </MDBCollapse>

         
      </div>
   )
}

export default MainRoomSettings