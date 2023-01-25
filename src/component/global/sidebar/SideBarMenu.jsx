import {useState} from 'react'

import { useUserContext } from '../../../context/UserContext'

import defaultUserIcon from '../../../assets/img/defaultUser.svg'
import {FaPlus} from 'react-icons/fa'
import {USERSTATUS_COLOR} from '../../../utils/helpers'

import UserMenu from '../../popups/UserMenu'

 
const SideBarMenu = ({showCreateRoom, setShowCreateRoom}) => {
   const {user, userStatus} = useUserContext()

   const [show, setShow] = useState(false)

   const toggleShow = () => setShow(!show)
   const toggleShowCreateRoom = () => setShowCreateRoom(!showCreateRoom)

   return (
      <div className='flex w-full flex-col items-center gap-2 mt-auto -translate-y-4 opacity-0 border-t-2 border-mainBg'>
         
         <li className='group sidebar-icon mt-2'>
            <button onClick={toggleShowCreateRoom} className='border-2 border-mainBg hover:bg-light_1 sidebar-icon bg-mainBg'>
               <FaPlus className='text-light_1 group-hover:text-mainBg'/>
            </button>
         </li>
         
         <li className='group sidebar-icon'>
            <button onClick={toggleShow} className='w-full flex flex-col items-center justify-center z-10'>
               <div className='relative sidebar-icon bg-mainBg'>
                  {user?.photoURL
                     ?
                        <>
                           <img src={user.photoURL} alt="user Icon" className='w-[3.05rem] h-[3.05rem] sidebar-icon object-cover'/>
                           <div className='absolute w-[1rem] h-[1rem] border-2 border-mainBg rounded-full bottom-0 -right-[.15rem]' style={{backgroundColor: USERSTATUS_COLOR[userStatus]}}>
                           </div>
                        </>
                     :
                        <img src={defaultUserIcon} alt="user Icon" className='w-[2.75rem] h-[2.75rem] rounded-full object-cover'/>
                  }
               </div>
            </button>
         </li>

         

         <UserMenu show={show} setShow={setShow}/>    
      </div>
   )
}

export default SideBarMenu