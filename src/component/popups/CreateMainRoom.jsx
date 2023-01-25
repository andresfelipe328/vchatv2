import {useEffect, useRef, useCallback} from 'react'

import { MDBCollapse } from 'mdb-react-ui-kit'
import CreateMainRoomForm from '../forms/CreateMainRoomForm'

export const CreateMainRoom = ({show, setShow}) => {
   const ref = useRef(null)  
   
   const toggleShow = useCallback(() => {
      setShow(!show)
      if (show)
         ref.current.blur()
   },[show, setShow])

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
         <MDBCollapse show={show} className='absolute top-1 left-2 w-max rounded-md bg-subBg shadow-popup z-30'>
            <div className='p-4 bg-subBg rounded-md flex flex-col gap-1'>
               <h4>Create Main Room:</h4>
            </div>
            <CreateMainRoomForm show={show} setShow={setShow}/>
         </MDBCollapse>
      </div>
   )
}
