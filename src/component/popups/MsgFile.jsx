import { useEffect, useState } from 'react'

import {AiFillEdit} from 'react-icons/ai'
import { FaTrash } from 'react-icons/fa'
import file from '../../assets/img/file.svg'

import Collapse from '../../hooks/Collapse'
import EditMsgFileForm from '../forms/EditMsgFileForm'

const STYLE = {
   'position': 'static',
   'display': 'flex',
   'alignItems': 'center',
   'justifyContents': 'center',
   'width': '100%',
   'borderRadius': '.32rem .32rem 0rem 0rem',
   'backgroundColor': 'rgb(80 69 56 / .25)',
   'boxShadow': 'none'
}

const MsgFile = ({msgFile, setMsgFile}) => {
   const [show, setShow] = useState(false)
   const [edit, setEdit] = useState(false)
   
   useEffect(() => {
      if (msgFile) document.getElementById('msg-input').focus()
      setShow(msgFile && true)
   }, [msgFile])

   const toggleShow = () => {
      setShow(!show)
      setMsgFile(null)
   }

   if (msgFile)
      return (
         <div className='px-2'>
            <Collapse show={show} style={STYLE}>
               <>
                  <div className='relative flex flex-col gap-1 w-auto'>
                     {msgFile.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/) 
                        ?
                           <img src={URL.createObjectURL(msgFile)} alt="msg File" />
                        :
                           <img src={file} alt="file" className='h-40'/>
                     }

                     <div className='absolute -right-4 bottom-10 bg-subBg rounded-md p-1 shadow-md flex flex-col'>
                        <button onClick={() => setEdit(!edit)} className='rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
                           <AiFillEdit className='text-light_1 text-lg'/>
                        </button>
                        <button onClick={toggleShow} className='group/dlt flex items-center gap-3 w-full hover:bg-red-700 rounded-md p-1 transition-all duration-150 ease-out'>
                           <FaTrash className='group-hover/dlt:text-mainBg text-red-700'/>
                        </button>
                     </div>
                  </div>
                  {edit 
                     ?
                        <EditMsgFileForm msgFile={msgFile} setMsgFile={setMsgFile} setEdit={setEdit}/>
                     :
                        <small className='font-bold text-light_1 m-auto'>{msgFile.name}</small>
                  }
               </>
            </Collapse>
         </div>
      )
}

export default MsgFile