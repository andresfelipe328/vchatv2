import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import { useUserContext } from '../../context/UserContext'

import Login from './authentication/Login'
import Signup from './authentication/Signup'
import SignupPartTwo from './authentication/SignupPartTwo'


const MainUnprotected = () => {
   const {userAuth ,user} = useUserContext()

   return (
      <section className='h-full w-full flex items-center justify-center'>
         <Routes>
            <Route 
               path='' 
               element={!userAuth ? <Login/> : 
                  !(user?.displayName && user?.photoURL) ? 
                     <Navigate to='/create-account'/> 
                  : 
                     <Navigate to=''/>} 
            />
            <Route 
               path='signup' 
               element={!userAuth ? <Signup/> : 
                  !(user?.displayName && user?.photoURL) ? 
                     <Navigate to='/create-account'/> 
                  : 
                     <Navigate to=''/>}
            />
            <Route 
               path='create-account' 
               element={!(user?.displayName && user?.photoURL) ? <SignupPartTwo/> : <Navigate to=''/>}
            />
         </Routes>
      </section>
   )
}

export default MainUnprotected