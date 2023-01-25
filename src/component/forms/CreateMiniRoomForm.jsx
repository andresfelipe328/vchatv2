import { useParams } from 'react-router-dom'

import { useUserContext } from '../../context/UserContext'

import {BsCheckLg, BsFillChatLeftTextFill} from 'react-icons/bs'
import {HiSpeakerphone} from 'react-icons/hi'

const CreateMiniRoomForm = ({mainRoomName, name, setName, type, setType, setShow}) => {
   const {id} = useParams()
   const {createMiniRoom} = useUserContext()

   const handleCreateMiniRoom = async (e) => {
      e.preventDefault()
      await createMiniRoom(id, mainRoomName, name, type)
      setShow(false)
      setName('')
      setType(null)
      document.querySelectorAll('#typeCheck').forEach(elem => elem.checked = false)
   }

   return (
      <form onSubmit={handleCreateMiniRoom} className='flex flex-col gap-4 mt-2'>
         <input 
            type="text" 
            value={name}
            placeholder='mini room name'
            className='bg-mainBg'
            onChange={(e) => setName(e.target.value)}
         />
         <label className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
               <BsFillChatLeftTextFill className='text-sm text-light_1/[.75]'/>
               <small>Text Mini Room</small>
            </div>
            <input id='typeCheck' name='type' type="radio" className='hidden peer' onClick={() => setType('text')}/>
            <div className='w-5 h-5 flex items-center justify-center rounded-md bg-mainBg peer-checked:bg-light_1/[.85] hover:shadow-md hover:bg-light_1/[.85] transition-all duration-200 ease-in-out cursor-pointer'>
               <BsCheckLg className='text-xs text-mainBg'/>
            </div>
         </label>

         <label className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
               <HiSpeakerphone className='text-sm text-light_1/[.75]'/>
               <small>Voice Mini Room</small>
            </div>
            <input id='typeCheck' name='type' type="radio" className='hidden peer' onClick={() => setType('voice')}/>
            <div className='w-5 h-5 flex items-center justify-center rounded-md bg-mainBg peer-checked:bg-light_1/[.85] hover:shadow-md hover:bg-light_1/[.85] transition-all duration-200 ease-in-out cursor-pointer'>
               <BsCheckLg className='text-xs text-mainBg'/>
            </div>
         </label>

         <button 
            className='bg-dark_2 text-mainBg shadow-md rounded-md p-2 w-3/4 m-auto disabled:opacity-70 hover:bg-dark_1 transition-all duration-200 ease-out'
            disabled={name.length > 0 && type ? false : true}   
         >
            <small>Create Mini Room</small>
         </button>
      </form>
   )
}

export default CreateMiniRoomForm