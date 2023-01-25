import { useState, useEffect, useRef } from 'react'

import {gsap} from 'gsap'
import { useUserContext } from '../../../context/UserContext'
import { HiUserGroup } from 'react-icons/hi'
import {FaExclamationCircle} from 'react-icons/fa'

import FriendList from './Pages/FriendList'
import RequestList from './Pages/RequestList'
import AddFriend from '../../popups/AddFriend'
import FindFriendForm from '../../forms/FindFriendForm'

const MENU = [
   {
      page: 'online'
   },
   {
      page: 'all'
   },
   {
      page: 'requests'
   },
]

const FriendsActRequests = () => {
   const [page, setPage] = useState('online')
   const [findFriend, setFindFriend] = useState('')
   const [disable, setDisable] = useState(false)
   const {requests} = useUserContext()

   const pageTitle = useRef(null)
   useEffect(() => {
      gsap.fromTo(pageTitle.current, 
         {x: -10, opacity: 0}, 
         {duration: 1, x: 0, opacity: 1, ease: "elastic.out(1, 0.75)"}
      )
   }, [page])

   const handleChangePage = (page) => {
      setPage(page)
      setDisable(true)
      setTimeout(() => {
         setDisable(false)
      }, 1200)
   }

   return (
      <div className='flex h-full flex-col gap-3 p-2'>
         <div className='flex'>
            <ul className='flex flex-1 items-center gap-2'>
               <div className='border-r-2 border-light_1/[.65] pr-3'>
                  <HiUserGroup className='text-xl text-light_1'/>
               </div>
               {MENU.map((elem, i) => (
                  <li key={i} className='group'>
                     <button 
                        onClick={() => handleChangePage(elem.page)} 
                        className='relative flex text-sm items-center gap-1 w-full group-hover:bg-mainBg/[.65] rounded-md p-1 transition-all duration-150 ease-out'
                        disabled={disable}
                     >
                        {(elem.page === 'requests' && requests.received?.length > 0) && 
                           <FaExclamationCircle className='absolute -right-2 -top-[.15rem] text-lg text-red-700 animate-bounce'/>
                        }
                        {elem.page}                     
                     </button>
                  </li>
               ))}
            </ul>
            
            <AddFriend/>
         </div>

         <div className='flex flex-1 flex-col gap-1'>
            {  page !== 'requests' &&
               <div className='p-2 w-full lg:w-1/2 m-auto'>
                  <FindFriendForm 
                     findFriend={findFriend}
                     setFindFriend={setFindFriend}
                  />
               </div>
            }
            <h3 ref={pageTitle} className='uppercase border-b border-light_1/[.35]'>{page}</h3>
            {page !== 'requests' ? <FriendList page={page} findFriend={findFriend}/> : <RequestList/>}
         </div>
      </div>
   )
}

export default FriendsActRequests