import React, { useState } from 'react'

const EditMsgFileForm = ({msgFile, setMsgFile, setEdit}) => {
   const [fileName, setFileName] = useState('')

   const handleRenameFile = (e) => {
      e.preventDefault()
      if (fileName.length > 0)
         setMsgFile(
            new File([msgFile], fileName, {
               type: msgFile.type,
               lastModified: msgFile.lastModified,
            })
         ) 
   }

   return (
      <form className='m-auto flex flex-col gap-1' onSubmit={handleRenameFile}>
         <input 
            type="text" 
            placeholder={msgFile.name}
            className='w-max m-auto'
            onChange={(e) => setFileName(e.target.value)}
         />
         <small className='text-xs font-bold text-red-700'>keep file extension in the name to avoid issues</small>
      </form>
   )
}

export default EditMsgFileForm