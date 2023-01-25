import {useEffect, useRef} from 'react'
import {gsap} from 'gsap'

const Collapse = ({show, children, style}) => {
   const ref = useRef(null)
   
   useEffect(() => {
      if (show)
         gsap.to(ref.current,
            { 
               duration: .25, 
               y: 0, 
               opacity: 1,
               pointerEvents: 'all',
               ease: "power2.out"}
         )
      else
         gsap.to(ref.current,
            {duration: .25, 
               y:-5, 
               opacity: 0,
               pointerEvents: 'none',
               ease: "power2.out"}
         )
   }, [show])

   return (
      <div className='absolute -translate-y-10 opacity-0 pointer-events-none flex top-8 right-0 flex-col gap-1 p-2 bg-subBg rounded-md w-[16rem] shadow-popup h-max' ref={ref} style={style}>
      {children}
      </div>
   )
}

export default Collapse