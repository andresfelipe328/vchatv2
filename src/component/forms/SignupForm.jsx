import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiLogIn } from 'react-icons/bi'

import {BsFillCheckCircleFill} from 'react-icons/bs'
import {FaTimesCircle} from 'react-icons/fa'
import { useUserContext } from '../../context/UserContext'

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,24}$/

const SignupForm = () => {
   const {signup} = useUserContext()
   const navigate = useNavigate()

   const [email, setEmail] = useState('')

   const [pwd, setPwd] = useState('')
   const [validPwd, setValidPwd] = useState(false)

   const [matchPwd, setMatchPwd] = useState('')
   const [validMatch, setValidMatch] = useState(false)

   const [err, setErr] = useState('')

   useEffect(() => {
      const result = PWD_REGEX.test(pwd)
      setValidPwd(result)
      const match = pwd === matchPwd
      setValidMatch(match)

   },[pwd, matchPwd])

   useEffect(() => {
      setErr('')
   },[email, pwd, matchPwd])

   const handleSignUp = async (e) => {
      e.preventDefault()
      
      try {
         await signup(email, pwd)
         navigate('/create-account')
      } catch(e) {
         setErr(e.code)
      }
   }


   return (
      <form className='flex flex-col gap-2' onSubmit={handleSignUp} autoComplete='off'>
         <label htmlFor="email">Email:</label>
         <input 
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            placeholder='example@email.com'
            value={email}
            type="email"
            required
         />

         <span className='flex items-center gap-1'>
            {pwd ? (validPwd ? <BsFillCheckCircleFill className="text-green-700"/> : <FaTimesCircle className="text-red-700"/>) : null}
            <label htmlFor="pwd">Password:</label>
         </span>
         <input 
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            type="password"
            placeholder='&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;'
            required
         />
         <small className='font-[600] opacity-60 text-center'>6-24 characters. Must contain lower/uppercase letters, numbers, and special characters</small>

         <span className='flex items-center gap-1'>
            { pwd ? (validMatch && validPwd ? <BsFillCheckCircleFill className="text-green-700"/> : <FaTimesCircle className="text-red-700"/>) : null}
            <label htmlFor="confirmPwd">Confirm Password:</label>
         </span>
         <input 
            onChange={(e) => setMatchPwd(e.target.value)}
            type="password"
            placeholder='&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;'
            required
         />

         {err ?
               <small className='bg-red-700 rounded-md p-1 text-center w-full text-mainBg'>{err}</small>
            :
               <button 
                  className='flex items-center justify-between bg-dark_2 text-mainBg rounded-md p-2 mt-5 mb-4 w-3/5 m-auto hover:bg-dark_1 transition-all duration-200 ease-out'
                  disabled={!validMatch ? true : false}
               >
                  <small>Sign Up</small>
                  <BiLogIn className='text-lg'/>
               </button>
         }
      </form>
   )
}

export default SignupForm