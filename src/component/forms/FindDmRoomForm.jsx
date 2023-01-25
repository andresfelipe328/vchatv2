import React from 'react'

const FindDmRoomForm = ({findDmRoom, setFindDmRoom}) => {
   return (
      <input 
         type="text" 
         placeholder='find a dm room'
         className='bg-mainBg w-full'
         value={findDmRoom}
         onChange={(e) => setFindDmRoom(e.target.value)}
      />
   )
}

export default FindDmRoomForm