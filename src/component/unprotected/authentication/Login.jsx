import {useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'

// import loginImg from '../../../assets/img/login.svg'
import { BiLogIn } from 'react-icons/bi'
import { Helmet } from 'react-helmet'
import {gsap} from 'gsap'

import LoginForm from '../../forms/LoginForm'

const Login = () => {

   // Animation
   const loginBox = useRef(null)
   useEffect(() => {
      gsap.fromTo(loginBox.current, 
         {y: -25, opacity: 0}, 
         {duration: 1.75, y: 0, opacity: 1, ease: "elastic.out(2, 0.75)"}
      )
   }, [])

   return (
      <div className='w-[285px] h-max flex flex-col gap-2 bg-mainBg shadow-md rounded-md p-4' ref={loginBox}>
         <Helmet>
            <meta charSet="utf-8" />
            <title>VChat - Login</title>
         </Helmet>

         <h1>Login</h1>
         <LoginForm/>

         <div className='flex flex-col gap-2 items-center border-t-2 border-light_1/[.65]'>
            <small className='font-[500] text-light_1/[.75]'>Don't have an account:</small>
            <Link to='/signup' className='flex items-center justify-between bg-dark_1 text-mainBg rounded-md p-2 w-3/5 m-auto hover:bg-dark_2 transition-all duration-200 ease-out'>
               <small>Sign-up</small>
               <BiLogIn className='text-lg'/>
            </Link>
         </div>
      </div>
   )
}

export default Login