import {useEffect, useRef, useCallback} from 'react'
import { Link, useNavigate } from 'react-router-dom'


import { useUserContext } from '../../context/UserContext'
import {BiLogInCircle, BiLogOutCircle} from 'react-icons/bi'
import {GoPrimitiveDot} from 'react-icons/go'
import {GiNightSleep, GiCancel} from 'react-icons/gi'
import {AiFillEyeInvisible} from 'react-icons/ai'

import Collapse from '../../hooks/Collapse'

const USERSTATUS = [
   {
      name: "active",
      color: '#378139',
      icon: GoPrimitiveDot 
   },
   {
      name: "invisible",
      color: '#606A6D',
      icon: AiFillEyeInvisible,
   },
   {
      name: "sleep",
      color: '#FFAD27',
      icon: GiNightSleep
   },
   {
      name: "busy",
      color: '#B30F0F',
      icon: GiCancel
   }
]

const STYLE = {
   'top': '-3.75rem',
   'right': '-10.6rem',
   'width': '165px',
   'padding': '1rem'
}

const UserMenu = ({show, setShow}) => {
   const {userAuth, logout, changeStatus} = useUserContext()
   const navigate = useNavigate()
   const ref = useRef(null)
   
   const toggleShow = useCallback(() => {
      setShow(!show)
      if (show)
         ref.current.blur()
   },[show, setShow])

   useEffect(() => {
      const handleClick = (event) => {
         if (show) 
            if (ref.current && !ref.current.contains(event.target)) {
               toggleShow()
            }
         };

         document.addEventListener('click', handleClick, true);

      return () => {
      document.removeEventListener('click', handleClick, true);
      };
   }, [ref, show, toggleShow])

   const handleLogout = async () => {
      await logout()
      navigate('/')
   }

   return (
      <div ref={ref}>
         <Collapse show={show} style={STYLE}>
            <ul className='flex flex-col gap-1'>
               <li className='group border-b-2 border-mainBg mb-1'>
                  { userAuth ?
                        <button className='flex items-center justify-between w-full pb-2 group-hover:translate-x-2 transition-transform duration-150 ease-out' onClick={handleLogout}>
                           <small>logout</small>
                           <BiLogOutCircle className='text-lg'/>
                        </button>
                     :
                        <Link to='/' className='flex items-center justify-between w-full pb-2 group-hover:translate-x-2 transition-transform duration-150 ease-out'>
                           <small>login</small>
                           <BiLogInCircle className='text-lg'/>
                        </Link>
                  }
               </li>
               {USERSTATUS.map((status, i) => (
                  <li className='group' key={i}> 
                     <button onClick={async () => {await changeStatus(status.name)}} className='flex items-center gap-1 w-full group-hover:translate-x-2 group-hover:bg-mainBg/[.65] rounded-md p-1 transition-all duration-150 ease-out'>
                        <status.icon style={{color: status.color}}/>
                        <small>{status.name}</small>
                     </button>
                  </li>
               ))}
            </ul>
         </Collapse>
      </div>
   )
}

export default UserMenu