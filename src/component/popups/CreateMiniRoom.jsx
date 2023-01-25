import { useCallback, useEffect, useRef, useState } from 'react'

import { FaPlus } from 'react-icons/fa'

import { MDBBtn, MDBCollapse } from 'mdb-react-ui-kit'
import CreateMiniRoomForm from '../forms/CreateMiniRoomForm'

const CreateMiniRoom = ({mainRoomName}) => {
   const [show, setShow] = useState(false)
   const [name, setName] = useState('')
   const [type, setType] = useState('')
   const ref = useRef(null)
   
   const toggleShow = useCallback(() => {
      setShow(!show)
      if (show) {
         ref.current.blur()
         setName('')
         setType('')
         document.querySelectorAll('#typeCheck').forEach(elem => elem.checked = false)
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

   return (
      <div ref={ref}>
         <MDBBtn onClick={toggleShow} className='p-1 rounded-md hover:bg-mainBg hover hover:shadow-sm transition-all duration-200 ease-in-out'>
            <FaPlus className='text-light_1 text-xs'/>
         </MDBBtn>

         <MDBCollapse show={show} className='absolute top-6 left-[.02rem] w-max rounded-md shadow-popup z-30'>
            <div className='p-4 bg-subBg rounded-md'>
               <h4>Create Mini Room</h4>
               
               <CreateMiniRoomForm
                  mainRoomName={mainRoomName}
                  name={name}
                  setName={setName}
                  type={type}
                  setType={setType}
                  setShow={setShow}
               />
            </div>
         </MDBCollapse>
      </div>
   )
}

export default CreateMiniRoom