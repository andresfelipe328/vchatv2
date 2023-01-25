import React, { useCallback, useEffect, useRef, useState } from 'react'

import addfriendIcon from '../../assets/img/addfriend.svg'
import { MDBCollapse, MDBBtn } from 'mdb-react-ui-kit';

import AddFriendForm from '../forms/AddFriendForm'

const AddFriend = () => {
   const [show, setShow] = useState(false)
   const [username, setUsername] = useState('')
   const ref = useRef(null)
   
   const toggleShow = useCallback(() => {
      setShow(!show)
      if (show)
         ref.current.blur()
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

   return (
      <div className='relative z-10' ref={ref}>
         <MDBBtn className='w-8 rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1' onClick={toggleShow}>
            <img src={addfriendIcon} alt="add Friend"/>
         </MDBBtn>

         <MDBCollapse show={show} className='absolute top-9 right-0 w-max rounded-md shadow-popup'>
            <div className='p-4 bg-subBg rounded-md'>
               <h4>Add a Friend</h4>
               <small className='opacity-60 font-semibold'>Usernames are case sensitive</small>
               
               <AddFriendForm toggleShow={toggleShow} username={username} setUsername={setUsername}/>
            </div>
         </MDBCollapse>
      </div>
   )
}

export default AddFriend