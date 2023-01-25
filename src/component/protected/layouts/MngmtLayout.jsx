import React from 'react'

const MngmtLayout = ({children}) => {
  return (
      <div className='-translate-x-4 opacity-0 w-[270px] flex flex-col h-full bg-subBg rounded-md shadow-lg z-[9]'>
         {children}
      </div>
  )
}

export default MngmtLayout