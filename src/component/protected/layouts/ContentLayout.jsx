import React from 'react'

const ContentLayout = ({children}) => {
   return (
      <div className='-translate-x-4 opacity-0 flex-1 flex-col h-full bg-subBg rounded-md shadow-lg z-[8]'>
         {children}
      </div>
   )
}

export default ContentLayout