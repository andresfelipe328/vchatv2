import { FaTimes } from 'react-icons/fa';
import Collapse from '../../hooks/Collapse';
import CreateRoomForm from '../forms/CreateRoomForm';

const STYLE = {
   'alignItems': 'center',
   'justifyContent': 'center',
   'backgroundColor': 'rgb(80 69 56 / .45)',
   'top': 0,
   'right': 0,
   'width': '100%',
   'height': '100%',
   'zIndex': 30,
}

const CreateRoom = ({show, setShow}) => {

   const toggleShow = () => setShow(!show)

   return (
      <Collapse show={show} style={STYLE}>
         <div className='relative bg-mainBg w-max rounded-md shadow-md p-4'>
            <button className='absolute top-2 right-2' onClick={toggleShow}>
               <FaTimes className='text-light_1 hover:text-red-700 transition-all duration-200 ease-in-out'/>
            </button>
            <h1 className='mt-2'>Create Room</h1>

            <CreateRoomForm show={show} setShow={setShow}/>
         </div>
      </Collapse>
   )
}

export default CreateRoom