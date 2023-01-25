import { useEffect, useRef} from 'react'
import { useUserContext } from '../../../../context/UserContext'

import FriendMoreMenu from '../../../popups/FriendMoreMenu'
import {USERSTATUS_COLOR} from '../../../../utils/helpers'

import gsap from 'gsap'
import alone from '../../../../assets/img/alone.svg'
import noResult from '../../../../assets/img/noResult.svg'
import {MdInsertComment} from 'react-icons/md'

const FriendList = ({page, findFriend}) => {
   const {friends, createDMRoom} = useUserContext()

   const frientList = useRef(null)
   useEffect(() => {
      if (frientList && page !== 'requests')
         gsap.fromTo(frientList.current, 
            {x: -10, opacity: 0}, 
            {duration: 1, x: 0, opacity: 1, delay: .3, ease: "elastic.out(1, 0.75)"}
         )
   }, [page])

   const friendComponent = (friend) => {
      return (
         <li className='group flex items-center justify-between mx-4 focus-within:shadow-md focus-within:bg-mainBg/[.25] hover:shadow-md hover:bg-mainBg/[.25] transition-all duration-200 ease-in-out p-2 rounded-md' key={friend.friendUsername}>
            <div className='flex items-center gap-2'>
               <div className='relative w-[3.05rem] h-[3.05rem] rounded-full bg-mainBg flex items-center justify-center'>
                  <img src={friend.friendIcon} alt="user Icon" className='w-[2.75rem] h-[2.75rem] rounded-full object-cover'/>
                  <div className='absolute w-[1rem] h-[1rem] border-2 border-mainBg rounded-full bottom-0 -right-[.15rem]' style={{backgroundColor: USERSTATUS_COLOR[friend.status]}}>
                  </div>
               </div>
               <div className='flex flex-col gap-1'>
                  <small>{friend.friendUsername}</small>
               </div>
            </div>

            <div className='flex items-center gap-2'>
               <button onClick={async () => await createDMRoom([friend])} className='group rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
                  <MdInsertComment className='text-2xl'/>
               </button>
               <FriendMoreMenu friend={friend}/>
            </div>
         </li>
      )
   }

   const displayFriendList = () => {
      const list = friends.filter((friendSearch) => {
         if (findFriend === '')
            return friendSearch
         else if (friendSearch.friendUsername.toLowerCase().includes(findFriend.toLowerCase()))
            return friendSearch
         return null
      })

      if (list.length === 0)
         return (
            <div className='flex flex-col items-center justify-center h-full'>
               <img src={noResult} alt="no results" className='w-48'/>
               <small>There's no one under that username.</small>
            </div>
         )
      else 
         return (
            list.map(friend => {
               if (page === 'online')
                  if (friend.status === 'active')
                     return friendComponent(friend)
                  else
                     return null
               else
                  return friendComponent(friend)
            })
         )
   }

   return (
      <div className='flex flex-1 w-full' ref={frientList}>
         { friends.length === 0 || (page === 'online' && !friends.find(friend => friend.status === 'active'))
            ?
               <div className='flex flex-col w-full items-center justify-center'>
                  <img src={alone} alt='no requests' className='w-80 opacity-80'/>
                  <small>It looks like no one is here.</small>
               </div>
            :
               <ul className='w-full' id='friends'>
                  {displayFriendList()}
               </ul>
         }

      </div>
   )
}

export default FriendList