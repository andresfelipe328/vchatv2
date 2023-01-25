import {useCallback, useEffect, useRef, useState} from 'react'
import { useUserContext } from '../../context/UserContext'
import { MDBBtn } from 'mdb-react-ui-kit';

import FindFriendForm from '../forms/FindFriendForm';

import { FaPlus, FaTimes } from 'react-icons/fa'
import {BsCheckLg} from 'react-icons/bs'
import noResult from '../../assets/img/noResult.svg'
import {USERSTATUS_COLOR} from '../../utils/helpers'
import Collapse from '../../hooks/Collapse';

const CreateDMsgSession = () => {
   const {friends, createDMRoom} = useUserContext()
   const [findFriend, setFindFriend] = useState('')
   const [dmParticipants, setDmParticipants] = useState([])
   const [dmParticipantsCounter, setDmParticipantsCounter] = useState(9)
   const [show, setShow] = useState(false)
   const ref = useRef(null)
   
   const toggleShow = useCallback(() => {
      setShow(!show)
      if (show) {
         ref.current.blur()
         setFindFriend('')
         setDmParticipants([])
         setDmParticipantsCounter(9)
         document.querySelectorAll('#participantCheck').forEach(elem => elem.checked = false)
      }
   },[show])

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

   const handleAddDmRoomParticipant = (e, participant) => {
      if (e.target.checked) {
         setDmParticipants(prev => [...prev, participant])
         setDmParticipantsCounter(dmParticipantsCounter - 1)
         dmParticipantsCounter === 1 && 
            document.querySelectorAll('#participantCheck').forEach(elem => elem.checked === false && (elem.disabled = true))
      }
      else {
         setDmParticipants(dmParticipants.filter(prev => prev.friendUsername !== participant.friendUsername))
         setDmParticipantsCounter(dmParticipantsCounter + 1)
         document.querySelectorAll('#participantCheck').forEach(elem => elem.disabled === true && (elem.disabled = false))
      } 
   }

   const handleDeleteDmParticipant = (participant) => {
      setDmParticipants(dmParticipants.filter(prev => prev.friendUsername !== participant.friendUsername))
      document.getElementsByName(participant.friendUsername)[0].checked = false
      setDmParticipantsCounter(dmParticipantsCounter + 1)
   }

   const friendComponent = (friend) => {
      return (
         <li className='flex items-center justify-between' key={friend.friendUsername}>
            <div className='flex items-center gap-2'>
               <div className='relative w-[2.75rem] h-[2.75rem] rounded-full border-2 border-mainBg flex items-center justify-center'>
                  <img src={friend.friendIcon} alt="user Icon" className='w-[2.45rem] h-[2.45rem] rounded-full object-cover'/>
                  <div className='absolute w-[.9rem] h-[.9rem] border-2 border-mainBg rounded-full bottom-0 -right-[.15rem]' style={{backgroundColor: USERSTATUS_COLOR[friend.status]}}>
                  </div>
               </div>
               <small>{friend.friendUsername}</small>
            </div>

            <label>
               <input id='participantCheck' name={friend.friendUsername} type="checkbox" className='hidden peer' onClick={(e) => handleAddDmRoomParticipant(e, friend)}/>
               <div className='w-5 h-5 flex items-center justify-center rounded-md bg-mainBg peer-checked:bg-light_1/[.85] hover:shadow-md hover:bg-light_1/[.85] transition-all duration-200 ease-in-out cursor-pointer'>
                  <BsCheckLg className='text-xs text-mainBg'/>
               </div>
            </label>
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
            <div className='flex flex-col items-center justify-center mt-2'>
               <img src={noResult} alt="no results" className='w-20'/>
               <small className='text-center'>There's no one under that username.</small>
            </div>
         )
      else 
         return (
            list.map(friend => {
               return friendComponent(friend)
            })
         )
   }

   const handleCreateDmRoom = async () => {
      await createDMRoom(dmParticipants)
      setShow(!show)
      setFindFriend('')
      setDmParticipants([])
      setDmParticipantsCounter(9)
      document.querySelectorAll('#participantCheck').forEach(elem => elem.checked = false)

   }

   return (
      <div className='relative z-10' ref={ref}>
         <MDBBtn className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1' onClick={toggleShow}>
            <FaPlus className='text-light_1 text-xs'/>
         </MDBBtn>

         <Collapse show={show}>
            <h4>Select Friends</h4>
            <small className='opacity-60 font-semibold'>
               { dmParticipantsCounter !== 0 
                  ?
                     `You can add ${dmParticipantsCounter} more friends`
                  :
                     'participant limit reached'
               }
               </small>

            <FindFriendForm 
               findFriend={findFriend}
               setFindFriend={setFindFriend}
            />

            { dmParticipants.length >= 1 &&
               <div className='flex gap-1 flex-wrap p-2 rounded-md bg-light_1/[.65]'>
                  {dmParticipants.map((participant) => (
                     <li key={participant.friendID}>
                        <div className='flex items-center p-1 rounded-md bg-mainBg/[.95]'>
                           <small className='text-xs'>{participant.friendUsername}</small>
                           <button onClick={() => handleDeleteDmParticipant(participant)}>
                              <FaTimes className='text-xs'/>
                           </button>
                        </div>
                     </li>
                  ))}
               </div>
            }
            
            <div className='h-[9.75rem] shadow-inner overflow-auto mt-1 p-1 px-2'>
               <ul className='flex flex-col gap-2'>
                  {displayFriendList()}
               </ul>
            </div>

            <button 
               className='bg-dark_2 text-mainBg shadow-md rounded-md p-2 w-3/5 m-auto disabled:opacity-70 hover:bg-dark_1 transition-all duration-200 ease-out'
               onClick={handleCreateDmRoom}
               disabled={dmParticipants.length > 0 ? false : true}
            >
               <small>Create DMRoom</small>
            </button>
         </Collapse>
      </div>
   )
}

export default CreateDMsgSession