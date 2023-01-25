import {useRef, useEffect} from 'react'
import { Link } from 'react-router-dom'

import {gsap} from 'gsap'
import logo from '../../../assets/img/app-icon.svg'
import { useUserContext } from '../../../context/UserContext'

import RoomMgmt from './RoomMgmt'
import SideBarMenu from './SideBarMenu'

const Sidebar = ({showCreateRoom, setShowCreateRoom}) => {
   const {userAuth} = useUserContext()

   // Animation
   const headerBox = useRef(null)
   useEffect(() => {
      gsap.to(headerBox.current, 
         // {x: -15, opacity: 0}, 
         {duration: 1, x: 0, opacity: 1, ease: "elastic.out(1, 0.75)"}
      )
      gsap.to(headerBox.current.childNodes, 
         // {y: -15, opacity: 0},
         {duration: .8, y:0, opacity: 1, stagger: .2, delay: .4, ease: "elastic.out(1, 0.75)"}
      )
   }, [])

   return (
      <header className='-translate-x-4 opacity-0 relative bg-subBg flex flex-col h-full items-center shadow-lg rounded-md z-10' ref={headerBox}>
         <div className='flex flex-col items-center justify-center gap-1 p-2 border-b-2 border-mainBg z-10'>
            <p className='font-[700]'>VChat</p>
            <Link to='' className='group'>
               <img src={logo} alt="VChat logo" className='w-14 group-hover:scale-110 transition duration-250 ease-in-out'/>
            </Link>
         </div>

         {userAuth && <RoomMgmt/>}

         <SideBarMenu
            showCreateRoom={showCreateRoom}
            setShowCreateRoom={setShowCreateRoom}
         />
      </header>
   )
}

export default Sidebar