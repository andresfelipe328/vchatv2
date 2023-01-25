import { Link, useLocation, useNavigate } from 'react-router-dom';

import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../../../config/firebase';
import { useUserContext } from '../../../context/UserContext';
import { useEffect } from 'react';

const RoomMgmt = () => {
   const loc = useLocation()
   const {user} = useUserContext()
   const userRef = doc(db, 'users', user?.displayName)
   const [data] = useDocumentData(userRef);
   const navigate = useNavigate()

   useEffect(() => {
      if (data && loc.pathname.includes('room')) {
         const roomID = loc.pathname.split('/')[2]
         
         if (!data.rooms.find(room => room.roomID === roomID)) {
            navigate('/')
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [loc, data])
   
   return (
      <div className='-translate-y-4 opacity-0 overflow-auto flex-1 w-full shadow-inner'>
         <ul className='flex my-2 flex-col items-center gap-2'>
         {data?.rooms && 
            data.rooms.map((room) => (
               <li key={room.roomID}>
                  <Link to={`/room/${room.roomID}/${room.miniRoomID}`} key={room.roomID} className={`group relative w-full flex items-center justify-center ${loc.pathname.includes(room.roomID) ? 'curr-room' : ''} curr-indicator`}>
                     <div className={`mx-2 bg-mainBg sidebar-icon group-hover:translate-x-1 ${loc.pathname.includes(room.roomID) ? 'curr-roomIcon rounded-2xl' : ''}`}>
                        <img src={room.roomIcon} alt="room Icon" className={`w-[3.05rem] h-[3.05rem] ${loc.pathname.includes(room.roomID) ? 'rounded-2xl' : ''} sidebar-icon object-cover`}/>
                     </div>
                  </Link>
               </li>
            ))
         }
         </ul>
      </div>
   )
}

export default RoomMgmt