import { useState, useEffect } from 'react'

import Resizer from "react-image-file-resizer"
import { useUserContext } from '../../context/UserContext'

import {FaUserCheck, FaUserAlt, FaCameraRetro} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const CreateForm = () => {
   const {finishSignup} = useUserContext()
   const navigate = useNavigate()

   const [username, setUsername] = useState('')
   const [accImg, setAccImg] = useState(null)
   const [err, setErr] = useState('')

   useEffect(() => {
      setErr('')
   },[username])

   const handleAccImg = async (e) => {
      try {
         const file = e.target.files[0];

         const image = await resizeFile(file);
         setAccImg(image)
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
      setErr('')
   }



   const handleCreate = async (e) => {
      e.preventDefault()
      const res = await finishSignup(username, accImg)
      if (!res.status) 
         setErr(res.message)
      else {
         setUsername('')
         setAccImg(null)
         navigate('/')
      }
   }

   return (
      <form className='flex flex-col gap-2' onSubmit={handleCreate} autoComplete='off'>
         <div className='relative m-auto w-[7rem] h-[7rem] rounded-full flex items-center justify-center border-4 border-light_1'>
            { accImg ?
                  <img src={URL.createObjectURL(accImg)} alt="user icon" className='w-[6.25rem] h-[6.25rem] rounded-full object-cover'/>
               :
                  <FaUserAlt className='text-6xl text-light_2'/>
            }

            <label htmlFor="acc_imgInput" className='absolute cursor-pointer bottom-0 -right-[.95rem] w-[2.75rem] h-[2.75rem] rounded-full flex items-center justify-center border-4 border-light_1 bg-light_2'>
               <FaCameraRetro className='text-xl text-light_1'/>
            </label>
         </div>
         <input
            onChange={handleAccImg}
            onClick={handleAddFile}
            type='file'
            style={{display: 'none'}}
            id ='acc_imgInput'
            required
         />

         <label htmlFor="username">Username:</label>
         <input 
            type="text" 
            name='username' 
            placeholder='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
         />

         {err ?
               <small className='bg-red-700 rounded-md p-1 text-center w-full text-mainBg'>{err}</small>
            :
               <button className='flex items-center justify-between bg-dark_2 text-mainBg rounded-md p-2 mt-5 mb-4 w-3/5 m-auto hover:bg-dark_1 transition-all duration-200 ease-out'>
                  <small>Create</small>
                  <FaUserCheck className='text-lg'/>
               </button>
         }
      </form>
   )
}

export default CreateForm