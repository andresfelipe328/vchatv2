import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../context/UserContext'

import { BiLogInCircle } from 'react-icons/bi'

const LoginForm = () => {

   const {login} = useUserContext()
   const navigate = useNavigate()

   const [email, setEmail] = useState('')
   const [pwd, setPwd] = useState('')
   const [err, setErr] = useState('')

   useEffect(() => {
      setErr('')
   }, [email, pwd])

   const handleLogin = async (e) => {
      e.preventDefault()
      
      try {
         await login(email, pwd)
         navigate('/')
      } catch(e) {
         setErr(e.code)
      }
   }

   return (
      <form className='flex flex-col gap-2' onSubmit={handleLogin}>
         <label htmlFor="email">Email:</label>
         <input 
            type="email" 
            name='email' 
            placeholder='example@email.com'
            onChange={(e) => setEmail(e.target.value)}
            required
         />

         <label htmlFor="password">Password:</label>
         <input 
            type="password"
            name='password' 
            placeholder='&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;'
            onChange={(e) => setPwd(e.target.value)}
            required
         />

         {err ?
               <small className='bg-red-700 rounded-md p-1 text-center w-full text-mainBg'>{err}</small>
            :
               <button className='flex items-center justify-between bg-dark_2 text-mainBg rounded-md p-2 mt-5 mb-4 w-3/5 m-auto hover:bg-dark_1 transition-all duration-200 ease-out'>
                  <small>login</small>
                  <BiLogInCircle className='text-lg'/>
               </button>
         }
      </form>
   )
}

export default LoginForm