import { useEffect, useState } from 'react'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
import { useUserContext } from '../../../context/UserContext'

import CreateDMsgSession from '../../popups/CreateDMsgSession'
import { FaTimes } from 'react-icons/fa'
import {RiGroupFill} from 'react-icons/ri'
import {AiTwotoneSetting} from 'react-icons/ai'
import {BsFillMicFill} from 'react-icons/bs'
import {BiHeadphone} from 'react-icons/bi'
import noResult from '../../../assets/img/noResult.svg'
import { USERSTATUS_COLOR, pickIconColor } from '../../../utils/helpers'

import { doc } from 'firebase/firestore'
import { db } from '../../../config/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import FindDmRoomForm from '../../forms/FindDmRoomForm'

const SETTINGMENU = [
   {
      icon: AiTwotoneSetting
   },
   {
      icon: BsFillMicFill
   },
   {
      icon: BiHeadphone
   }
]

const DirectMsgMngmt = () => {
   const {user, friends, removeDmRoom} = useUserContext()
   const userRef = doc(db, 'users', user.displayName)
   const [data] = useDocumentData(userRef);
   const {id} = useParams()
   const {pathname} = useLocation()
   const navigate = useNavigate()
   const [findDmRoom, setFindDmRoom] = useState('')

   useEffect(() => {
      if (data && pathname.includes('dmRoom')) {
         if (pathname.includes(id) && !data.dmRooms.find(dmRoom => dmRoom.dmRoomID === id)) {
            navigate('/')
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [data])

   const displayDmRoomName = (dmRoomName) => {
      const nameList = dmRoomName.split(', ')
      let newDmRoomName = nameList.filter(name => name !== user.displayName).join(', ')

      return (
         <small className='truncate'>{newDmRoomName}</small>
      )
   }

   const displayDmRoomIcon = (dmRoom) => {
      const nameList = dmRoom.dmRoomName.split(', ')

      if (nameList.length < 3) {
         const participant = nameList.filter(name => name !== user.displayName).join(', ')
         const friend = friends.find(friend => friend.friendUsername === participant)

         if (friend)
            return (
            <div className='relative w-[3.05rem] h-[3.05rem] rounded-full bg-mainBg flex items-center justify-center'>
               <img src={friend.friendIcon} alt="user Icon" className='w-[2.75rem] h-[2.75rem] rounded-full object-cover'/>
               <div className='absolute w-[1rem] h-[1rem] border-2 border-mainBg rounded-full bottom-0 -right-[.15rem]' style={{backgroundColor: USERSTATUS_COLOR[friend.status]}}>
               </div>
            </div>
            )
      }
      return (
         <div className='w-[3.05rem] h-[3.05rem] rounded-full border-2 border-mainBg flex items-center justify-center' style={{backgroundColor: dmRoom.dmRoomIcon}}>
            <RiGroupFill className='text-xl' style={{color: pickIconColor(dmRoom.dmRoomIcon, '#504538', '#fbf2e0')}}/>
         </div>
      )

   }

   const handleDeleteDmRoom = async (e, dmRoom) => {
      e.preventDefault()
      await removeDmRoom(dmRoom)
   }

   const dmRoomComponent = (dmRoom) => {
      return (
         <li key={dmRoom.dmRoomID} className='group relative'>
            <Link 
               to={`/dmRoom/${dmRoom.dmRoomID}`}
               className={`flex items-center gap-2 ${id === dmRoom.dmRoomID ? 'shadow-md bg-mainBg/[.25]' : ''} hover:shadow-md hover:bg-mainBg/[.25] transition-all duration-200 ease-in-out p-1 rounded-md`}
            >
               {displayDmRoomIcon(dmRoom)}
               {displayDmRoomName(dmRoom.dmRoomName)}
               <button 
                  onClick={(e) => handleDeleteDmRoom(e, dmRoom)} 
                  className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-all duration-200 ease-in-out ml-auto z-20'
               >
                  <FaTimes className='text-xs'/>
               </button>
            </Link>
         </li>
      )
   }

   const displayDmRoomList = () => {
      const list = data?.dmRooms.filter((dmRoomSearch) => {
         if (findDmRoom === '')
            return dmRoomSearch
         else if (dmRoomSearch.dmRoomName.toLowerCase().includes(findDmRoom.toLowerCase()))
            return dmRoomSearch
         return null
      })

      if (list.length === 0)
         return (
            <div className='flex flex-col items-center justify-center mt-2'>
               <img src={noResult} alt="no results" className='w-20'/>
               <small className='text-center'>There's no dm room under that name.</small>
            </div>
         )
      else 
         return (
            list.map(dmRoom => {
               return dmRoomComponent(dmRoom)
            })
         )
   }

   return (
      <>
         <div className='p-2 border-b-2 border-mainBg'>
            <FindDmRoomForm 
               findDmRoom={findDmRoom} 
               setFindDmRoom={setFindDmRoom}
            />
         </div>

         <div className='p-2 w-full flex-1 overflow-auto'>
            <ul className='flex flex-col'>
               <div className='flex items-center justify-between mb-2'>
                  <h4 className='uppercase'>DM Rooms</h4>
                  <CreateDMsgSession/>
               </div>

               {data?.dmRooms && displayDmRoomList()}
            </ul>
         </div>

         <div className='flex items-center gap-1 p-2 border-t-2 border-mainBg'>
            <small className='font-semibold opacity-[.85] flex-1'>@{user.displayName}</small>
            {SETTINGMENU.map((item, index) => (
               <button key={index} className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
                  <item.icon className='text-light_1 text-xl'/>
               </button>
            ))}
         </div>
      </>
   )
}

export default DirectMsgMngmt