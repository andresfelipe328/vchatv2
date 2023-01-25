import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useUserContext } from '../../context/UserContext'

const CreateMainRoomForm = ({show, setShow}) => {
   const [mainRoomName, setMainRoomName] = useState('')
   const {id} = useParams()
   const {createMainRoom} = useUserContext()

   const handleCreateMainRoom = async (e) => {
      e.preventDefault()
      await createMainRoom(mainRoomName, id)
      setMainRoomName('')
      setShow(!show)
   }

   return (
      <form onSubmit={handleCreateMainRoom} className='flex flex-col gap-2 px-4 pb-4'>
         <input type="text" placeholder='main room name' value={mainRoomName} onChange={(e) => setMainRoomName(e.target.value)}/>

         <button 
            className='bg-dark_2 text-mainBg shadow-md rounded-md p-2 w-3/4 m-auto disabled:opacity-70 hover:bg-dark_1 transition-all duration-200 ease-out'
            disabled={mainRoomName.length === 0 ? true : false}   
         >
            <small>Create Main Room</small>
         </button>
      </form>
   )
}

export default CreateMainRoomForm