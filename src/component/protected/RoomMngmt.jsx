import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import gsap from 'gsap'
import { useUserContext } from '../../context/UserContext'

import { doc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'

import CreateMiniRoom from '../popups/CreateMiniRoom'
import MainRoomSettings from '../popups/MainRoomSettings'
import { AiFillEdit } from 'react-icons/ai'
import { FaTrash } from 'react-icons/fa'
import {BsFillChatLeftTextFill} from 'react-icons/bs'
import {HiSpeakerphone} from 'react-icons/hi'

import RenameMainMiniRoom from '../popups/RenameMainMiniRoom'
import RoomMenu from '../popups/RoomMenu'
import { CreateMainRoom } from '../popups/CreateMainRoom'

const RoomMngmt = () => {
   const {id, subID} = useParams()
   const [typeEdit, setTypeEdit] = useState(null)
   const [editName, setEditName] = useState('')
   const [showNewMR, setShowNewMR] = useState(false)
   const [miniRoomID, setMiniRoomID] = useState('')
   const [showEdit, setShowEdit] = useState(false)
   const {user, deleteMiniRoom} = useUserContext()
   const navigate = useNavigate()
   
   const roomRef = doc(db, 'rooms', id)
   const [data] = useDocumentData(roomRef)

   const contentRef = useRef(null)
   useEffect(() => {
      gsap.fromTo(contentRef.current, 
         {x: -10, opacity: 0}, 
         {duration: 1, x: 0, opacity: 1, delay: .15, ease: "elastic.out(1, 0.75)"}
      )
   }, [id])

   useEffect(() => {
      if (data) {
         let currMiniRoom 
         for (let i = 0; i < data.mainRooms.length; ++i) {
            currMiniRoom = data.mainRooms[i].miniRooms.find(prev => prev.miniRoomID === subID)
            if (currMiniRoom)
               break
         }

         if (!currMiniRoom) {
            let newMiniRoom
            for (let i = 0; i < data.mainRooms.length; ++i) {
               newMiniRoom = data.mainRooms[i].miniRooms.find(prev => prev.miniRoomType === 'text')
               if (newMiniRoom)
                  break
            }
            navigate(`/room/${id}/${newMiniRoom.miniRoomID}`)
         }
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [data, subID, id])

   const handleEditMiniRoomName = (e, miniRoom) => {
      e.preventDefault()
      setEditName(miniRoom.miniRoomName)
      setMiniRoomID(miniRoom.miniRoomID)
      setTypeEdit('mini')
      setShowEdit(!showEdit)
   }

   const handleDeleteMiniRoom = async (e, mainRoom, miniRoom) => {
      e.preventDefault()
      await deleteMiniRoom(id, mainRoom.mainRoomName, miniRoom.miniRoomID)
   }

   return (
      <div className='flex flex-col h-full' ref={contentRef}>
         <div className='relative shadow-sm flex items-center justify-between p-2'>
            <h3>{data && data.roomName}</h3>
            <RoomMenu
               data={data}
               showNewMR={showNewMR}
               setShowNewMR={setShowNewMR}
            />
         </div>
         <div className='relative flex flex-col w-full flex-1 overflow-auto p-2'>
            <RenameMainMiniRoom 
               typeEdit={typeEdit} 
               editName={editName} 
               setEditName={setEditName} 
               show={showEdit} 
               setShow={setShowEdit} 
               miniRoomID={miniRoomID} 
               setMiniRoomID={setMiniRoomID}
            />
            <CreateMainRoom
               show={showNewMR}
               setShow={setShowNewMR}
            />
            {data && data.mainRooms.map((mainRoom) => (
               <ul key={mainRoom.mainRoomName} className='relative flex flex-col gap-1'>
                  {mainRoom.mainRoomName.length > 0 &&
                     <div className='flex items-center justify-between'>
                        <h4 className='font-semibold'>{mainRoom.mainRoomName}</h4>
                        { user.uid === data?.userID && 
                           <div className='flex items-center'>
                              <MainRoomSettings 
                                 name={mainRoom.mainRoomName} 
                                 setTypeEdit={setTypeEdit} 
                                 setShowEdit={setShowEdit} 
                                 setEditName={setEditName}
                              />
                              <CreateMiniRoom 
                                 mainRoomName={mainRoom.mainRoomName}
                              />
                           </div>
                        }
                     </div>
                  }
                  <ul className={`flex flex-col ${mainRoom.mainRoomName.length > 0 ? 'ml-4' : ''}`}>
                     {mainRoom.miniRooms.map((miniRoom) => (
                        <Link to={`/room/${id}/${miniRoom.miniRoomID}`} key={miniRoom.miniRoomID} className={`group/p p-1 flex items-center gap-2 rounded-md ${subID === miniRoom.miniRoomID ? 'shadow-md bg-mainBg/[.25]' : ''} hover:bg-mainBg/[.25] hover:shadow-md transition-all duration-200 ease-in-out`}>
                           {miniRoom.miniRoomType === 'text'
                              ?
                                 <BsFillChatLeftTextFill className='text-xs text-light_1/[.65]'/>
                              :
                                 <HiSpeakerphone className='text-xs text-light_1/[.65]'/>
                           }
                           <small className='font-medium text-light_1'>{miniRoom.miniRoomName}</small>

                           {user.uid === data?.userID &&
                              <div className='ml-auto opacity-0 group-hover/p:opacity-100 transition-all duration-200 ease-in-out'>
                                 <button onClick={(e) => handleEditMiniRoomName(e, miniRoom)} className='p-1 rounded-md hover:bg-mainBg hover hover:shadow-sm transition-all duration-200 ease-in-out'>
                                    <AiFillEdit className='text-xs text-light_1/[.85]'/>
                                 </button>
                                 <button onClick={(e) => handleDeleteMiniRoom(e, mainRoom, miniRoom)} className='group/c p-1 rounded-md hover:bg-red-700 hover hover:shadow-sm transition-all duration-200 ease-in-out'>
                                    <FaTrash className='text-xs text-red-700 group-hover/c:text-mainBg transition-all duration-200 ease-in-out'/>
                                 </button>
                              </div>
                           }


                        </Link>
                     ))}
                  </ul>
               </ul>
            ))}
         </div>
      </div>
   )
}

export default RoomMngmt