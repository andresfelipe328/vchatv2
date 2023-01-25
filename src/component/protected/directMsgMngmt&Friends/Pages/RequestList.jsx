import { useEffect, useRef } from 'react'
import { useUserContext } from '../../../../context/UserContext'

import gsap from 'gsap'
import {FaTimesCircle, FaCheckCircle, FaExclamationCircle} from 'react-icons/fa'
import noNotification from '../../../../assets/img/no_requests.svg'

const RequestList = () => {

   const {requests, completeRequest, deleteRequest} = useUserContext()

   const requestList = useRef(null)
   useEffect(() => {
      if (requestList)
         gsap.fromTo(requestList.current, 
            {x: -10, opacity: 0}, 
            {duration: 1, x: 0, opacity: 1, delay: .3, ease: "elastic.out(1, 0.75)"}
         )
   }, [])

   const displayDate = (date) => {
      const newDate = date.substring(0, date.indexOf(','))

      return (
         <small className='opacity-70'>{newDate}</small>
      )
   }

   const handleCompleteRequest = async (request, response) => {
      await completeRequest(request, response)
   }

   return (
      <div className='h-full w-full flex flex-col lg:flex-row gap-2 ' ref={requestList}>

         { requests.sent?.length === 0 && requests.received?.length === 0 
            ?
               <div className='h-full w-full flex flex-col items-center justify-center'>
                  <img src={noNotification} alt='no requests' className='w-72 opacity-80'/>
                  <small>Be quiet! The bell is sleeping.</small>
               </div>
            :
               <>
                  <div className='h-full flex flex-col gap-2 lg:w-1/2 overflow-auto shadow-md rounded-md p-4'>
                     <h4 className='uppercase'>Sent:</h4>
                     { requests.sent?.length > 0 
                        ?
                           <ul>
                              {requests?.sent.map((request) => (
                                 <li className='relative group flex items-center justify-between hover:shadow-md hover:bg-mainBg/[.25] transition-all duration-200 ease-in-out p-2 rounded-md' key={request.requestID}>
                                    {  request.requestStatus === 'declined' &&
                                       <button onClick={async () => await deleteRequest(request)} className='absolute -right-2 -top-[.35rem]'>
                                          <FaTimesCircle className='text-lg text-red-700'/>
                                       </button>
                                    }
                                    <div className='flex items-center gap-2'>
                                       <div className='relative w-[3.05rem] h-[3.05rem] rounded-full bg-mainBg flex items-center justify-center'>
                                          <img src={request.requesteeIcon} alt="user Icon" className='w-[2.75rem] h-[2.75rem] rounded-full object-cover'/>
                                       </div>
                                       <div className='flex flex-col gap-1'>
                                          <small>{request.requestee}</small>
                                          {displayDate(request.timestamp)}
                                       </div>
                                    </div>
                                    
                                    { request.requesType !== '02' && 
                                       <small className='p-2 bg-mainBg group-hover:shadow-md transition-all duration-200 ease-in-out rounded-md'>{request.requestStatus}</small>
                                    }

                                 </li>
                              ))}
                           </ul>
                        :
                           <div className='flex flex-col items-center justify-center'>
                              <img src={noNotification} alt='no requests' className='w-60 opacity-80'/>
                              <small>Be quiet! The bell is sleeping.</small>
                           </div>
                     }
                  </div>

                  <div className='h-full flex flex-col gap-2 lg:w-1/2 overflow-auto shadow-md rounded-md p-4'>
                     <h4 className='uppercase'>Received:</h4>
                     { requests.received?.length > 0 
                        ?
                           <ul>
                              {requests?.received.map((request) => (
                                 <li className='relative flex items-center justify-between hover:shadow-md hover:bg-mainBg/[.25] transition-all duration-200 ease-in-out p-2 rounded-md' key={request.requestID}>
                                    <FaExclamationCircle className='absolute -right-2 -top-[.35rem] text-lg text-red-700'/>
                                    <div className='flex items-center gap-2'>
                                       <div className='relative w-[3.05rem] h-[3.05rem] rounded-full border-2 border-mainBg flex items-center justify-center'>
                                          <img src={request.requesterIcon} alt="user Icon" className='w-[2.75rem] h-[2.75rem] rounded-full object-cover'/>
                                       </div>
                                       <div className='flex flex-col gap-1'>
                                          { request.requestType === '01' 
                                             ?
                                                <small>{request.requester}</small>                                       
                                             :
                                                <>
                                                   <small>{request.requester}</small> 
                                                   <small>invitation to {request.roomName} room</small>
                                                </>
                                          }
                                          {displayDate(request.timestamp)}
                                       </div>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                       <button onClick={() => handleCompleteRequest(request, 'approved')} className='group rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
                                          <FaCheckCircle className='text-xl group-hover:text-light_2 transition-all duration-200 ease-in-out'/>
                                       </button>

                                       <button onClick={() => handleCompleteRequest(request, 'declined')} className='group rounded-md hover:shadow-md hover:bg-mainBg transition-all duration-200 ease-in-out p-1'>
                                          <FaTimesCircle className='text-xl group-hover:text-red-700 transition-all duration-200 ease-in-out'/>
                                       </button>
                                    </div>
                                 </li>
                              ))}
                           </ul>
                        :
                           <div className='flex flex-col items-center justify-center'>
                              <img src={noNotification} alt='no requests' className='w-60 opacity-80'/>
                              <small>Be quiet! The bell is sleeping.</small>
                           </div>
                     }
                  </div>
               </>
         }


      </div>
   )
}

export default RequestList