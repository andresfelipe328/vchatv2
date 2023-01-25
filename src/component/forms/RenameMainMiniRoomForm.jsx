import React from 'react'
import { useParams } from 'react-router-dom'

import { useUserContext } from '../../context/UserContext'

const RenameMainMiniRoomForm = ({newName, editName, show, setShow,setNewName, setEditName, typeEdit, miniRoomID, setMiniRoomID }) => {

   const {id} = useParams()
   const {editMainMiniName} = useUserContext()

   const handleEditName = async () => {
      setShow(!show)
      setNewName('')
      setEditName('')
      setMiniRoomID('')
      await editMainMiniName(typeEdit, editName, newName, id, miniRoomID)
   }

   return (
      <form className='flex flex-col gap-2'>
         <input type="text" value={newName} placeholder={editName} onChange={(e) => setNewName(e.target.value)}/>

         <button 
            className='bg-dark_2 text-mainBg shadow-md rounded-md p-2 w-3/5 m-auto disabled:opacity-70 hover:bg-dark_1 transition-all duration-200 ease-out'
            onClick={handleEditName}
            disabled={editName === newName ? true : false}
         >
            <small>Rename</small>
         </button>
      </form>
   )
}

export default RenameMainMiniRoomForm