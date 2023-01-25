import React, { useEffect, useState } from 'react'

import Resizer from "react-image-file-resizer"
import { useUserContext } from '../../context/UserContext'

import { FaCameraRetro } from 'react-icons/fa'
import { BsDoorOpenFill } from 'react-icons/bs'
import { TiPlus } from 'react-icons/ti'

const CreateRoomForm = ({show, setShow}) => {
   const {createRoom} = useUserContext()
   const [roomIcon, setRoomIcon] = useState(null)
   const [roomName, setRoomName] = useState('')
   const [err, setErr] = useState('')

   useEffect(() => {
      if (!show) {
         setRoomIcon(null)
         setRoomName('')
      }
   }, [show])

   const handleRoomIcon = async (e) => {
      try {
         const file = e.target.files[0];

         const image = await resizeFile(file);
         setRoomIcon(image)
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

   const handleAddFile = (e) => {
      e.target.value=""
      setErr('')
   }

   const handleCreate = async (e) => {
      e.preventDefault()
      await createRoom(roomName, roomIcon)
      setShow(false)
   }

   return (
      <form className='flex flex-col gap-2' onSubmit={handleCreate} autoComplete='off'>
         <div className='relative m-auto w-[7rem] h-[7rem] rounded-full flex items-center justify-center border-4 border-light_1'>
            { roomIcon ?
                  <img src={URL.createObjectURL(roomIcon)} alt="user icon" className='w-[6.25rem] h-[6.25rem] rounded-full object-cover'/>
               :
                  <TiPlus className='text-6xl text-light_2'/>
            }

            <label htmlFor="acc_imgInput" className='absolute cursor-pointer bottom-0 -right-[.95rem] w-[2.75rem] h-[2.75rem] rounded-full flex items-center justify-center border-4 border-light_1 bg-light_2'>
               <FaCameraRetro className='text-xl text-light_1'/>
            </label>
         </div>
         <input
            onChange={handleRoomIcon}
            onClick={handleAddFile}
            type='file'
            style={{display: 'none'}}
            id ='acc_imgInput'
            required
         />

         <label htmlFor="username">Room Name:</label>
         <input 
            type="text" 
            name='username' 
            placeholder='room name'
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
         />

         {err ?
               <small className='bg-red-700 rounded-md p-1 text-center w-full text-mainBg'>{err}</small>
            :
               <button className='flex items-center justify-between bg-dark_2 text-mainBg rounded-md p-2 mt-5 mb-4 w-3/5 m-auto hover:bg-dark_1 transition-all duration-200 ease-out'>
                  <small>Create</small>
                  <BsDoorOpenFill className='text-lg'/>
               </button>
         }
      </form>
   )
}

export default CreateRoomForm