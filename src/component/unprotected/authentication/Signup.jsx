import {useEffect, useRef} from 'react'
import { Helmet } from 'react-helmet'

// import signup from '../../../assets/img/signup.svg'
import {gsap} from 'gsap'

import SignupForm from '../../forms/SignupForm'

const Signup = () => {

   // Animation
   const signupBox = useRef(null)
   useEffect(() => {
      gsap.fromTo(signupBox.current, 
         {y: -25, opacity: 0}, 
         {duration: 1, y: 0, opacity: 1, ease: "elastic.out(2, 0.75)"}
      )
   }, [])

   return (
      <div className='w-[285px] h-max flex flex-col gap-2 bg-mainBg shadow-md rounded-md p-4' ref={signupBox}>
         <Helmet>
            <meta charSet="utf-8" />
            <title>VChat - Sign Up</title>
         </Helmet>

         <h1>Signup</h1>
         <SignupForm/>
      </div>
   )
}

export default Signup