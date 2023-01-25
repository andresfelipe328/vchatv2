import { useState } from 'react';
import {Route, Routes, Navigate} from 'react-router-dom'
import { useUserContext } from './context/UserContext';

import Sidebar from './component/global/sidebar/Sidebar';
import MainProtected from './component/protected/MainProtected';
import MainUnprotected from './component/unprotected/MainUnprotected';
import CreateRoom from './component/popups/CreateRoom';

const App = () => {
  const {userAuth, user} = useUserContext()
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  return (
    <main className='relative flex items-center justify-center gap-1 h-screen min-h-[660px] w-full p-2'>
      <Sidebar
        showCreateRoom={showCreateRoom}
        setShowCreateRoom={setShowCreateRoom}
      />

      <CreateRoom
        show={showCreateRoom}
        setShow={setShowCreateRoom}
      />

      <Routes>
        {userAuth && user?.displayName && user?.photoURL ?
            <Route 
              path='*' 
              element={(user?.displayName && user?.photoURL) ? <MainProtected/> : <Navigate to='/create-account'/>}
            />
          :
            <Route 
              path='*' 
              element={<MainUnprotected/>}
            />
        }
      </Routes>
    </main>
  );
}

export default App;
