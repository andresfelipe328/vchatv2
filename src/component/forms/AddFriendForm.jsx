import { useEffect, useState } from 'react'
import { useUserContext } from '../../context/UserContext'

const AddFriendForm = ({toggleShow, username, setUsername}) => {
   const [err, setErr] = useState('')
   const {sendRequest} = useUserContext()

   useEffect(() => {
      setErr('')
   }, [username])

   const handleAddFriend = async (e) => {
      e.preventDefault()
      const res = await sendRequest(username, '01')
      if (res.status) {
         toggleShow()
         setUsername('')
      }
      else {
         setErr(res.message)
      }
   }

   return (
      <form className='flex flex-col gap-2 mt-2' onSubmit={handleAddFriend} autoComplete='off'>
         <input 
            type="text" 
            placeholder='username' 
            className='bg-mainBg'
            onChange={(e) => setUsername(e.target.value)}
            value={username}
         />
         { err
            ?
               <small className='bg-red-700 rounded-md p-1 text-center w-full text-mainBg'>{err}</small>
            :
               <button 
                  className='bg-dark_2 text-mainBg shadow-md rounded-md p-2 w-3/5 m-auto disabled:opacity-70 hover:bg-dark_1 transition-all duration-200 ease-out'
                  disabled={username.length > 0 ? false : true}   
               >
                  <small>Add Friend</small>
               </button>
         }
      </form>
   )
}

export default AddFriendForm