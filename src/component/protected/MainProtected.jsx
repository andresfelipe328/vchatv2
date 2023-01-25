import {useRef, useEffect} from 'react'
import {Routes, Route} from 'react-router-dom'

import {gsap} from 'gsap'

import MngmtLayout from './layouts/MngmtLayout'
import FriendsActRequests from './directMsgMngmt&Friends/FriendsActRequests'
import DirectMsgMngmt from './directMsgMngmt&Friends/DirectMsgMngmt'
import ContentLayout from './layouts/ContentLayout'
import MainDmRoomChat from './dmRoomChat/MainDmRoomChat'
import RoomMngmt from './RoomMngmt'
import MainRoomChat from './roomChat/MainRoomChat'

const MainProtected = () => {
   // Animation
   const contentBox = useRef(null)
   useEffect(() => {
      gsap.to(contentBox.current.childNodes, 
         // {x: -15, opacity: 0},
         {duration: 1, x:0, opacity: 1, stagger: .2, delay: .4, ease: "elastic.out(1, 0.75)"}
      )
   }, [])

   return (
      <article className='flex gap-1 w-full h-full' ref={contentBox}>
         <MngmtLayout>
            <Routes>
               <Route path='' element={<DirectMsgMngmt/>}/>
               <Route path='dmRoom/:id' element={<DirectMsgMngmt/>}/>
               <Route path='room/:id/:subID' element={<RoomMngmt/>}/>
            </Routes>
         </MngmtLayout>

         <ContentLayout>
            <Routes>
               <Route path='' element={<FriendsActRequests/>}/>
               <Route path='dmRoom/:id' element={<MainDmRoomChat/>}/>
               <Route path='room/:id/:subID' element={<MainRoomChat/>}/>
            </Routes>
         </ContentLayout>
      </article>
   )
}

export default MainProtected