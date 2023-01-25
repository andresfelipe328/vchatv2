import {useRef, useEffect} from 'react'

import { Helmet } from 'react-helmet'
import {gsap} from 'gsap'

import CreateForm from '../../forms/CreateForm'

const SignupPartTwo = () => {

   // Animation
   const createBox = useRef(null)
   useEffect(() => {
      gsap.fromTo(createBox.current, 
         {y: -25, opacity: 0}, 
         {duration: 1, y: 0, opacity: 1, ease: "elastic.out(2, 0.75)"}
      )
   }, [])

   return (
      <div className='w-[285px] h-max flex flex-col gap-2 bg-mainBg shadow-md rounded-md p-4' ref={createBox}>
         <Helmet>
            <meta charSet="utf-8" />
            <title>VChat - Create Account</title>
         </Helmet>

         <h1>Account Info:</h1>
         <CreateForm/>
      </div>
   )
}

export default SignupPartTwo