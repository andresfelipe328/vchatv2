import { useCallback, useEffect, useRef, useState } from 'react'

import { MDBCollapse } from 'mdb-react-ui-kit'
import RenameMainMiniRoomForm from '../forms/RenameMainMiniRoomForm'

const RenameMainMiniRoom = ({typeEdit, editName, setEditName, show, setShow, miniRoomID, setMiniRoomID}) => {
   const ref = useRef(null)
   const [newName, setNewName] = useState('')

   useEffect(() => {
      setNewName(editName)
   }, [editName])

   const toggleShow = useCallback(() => {
      setShow(!show)
      if (show) {
         setNewName('')
         setEditName('')
         ref.current.blur()
      }
   },[show, setShow, setEditName])

   useEffect(() => {
      const handleClick = (event) => {
         if (show) 
            if (ref.current && !ref.current.contains(event.target))
               toggleShow()
         }

         document.addEventListener('click', handleClick, true);

      return () => {
      document.removeEventListener('click', handleClick, true);
      };
   }, [ref, show, toggleShow])

   return (
      <div ref={ref}>
         <MDBCollapse show={show} className='absolute top-3 left-[.35rem] w-[95%] rounded-md shadow-popup bg-subBg z-30'>
            <div className='p-2 bg-subBg rounded-md flex flex-col gap-2 items-center'>
               <h4>Edit Name:</h4>
               <RenameMainMiniRoomForm
                  newName={newName}
                  editName={editName}
                  show={show}
                  setShow={setShow}
                  setNewName={setNewName}
                  setEditName={setEditName}
                  typeEdit={typeEdit}
                  miniRoomID={miniRoomID}
                  setMiniRoomID={setMiniRoomID}
               />
            </div>
         </MDBCollapse>
      </div>
   )
}

export default RenameMainMiniRoom