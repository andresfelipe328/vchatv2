import { createContext, useContext, useEffect, useState } from "react"

import {auth, db, storage} from '../config/firebase'
import {onAuthStateChanged, createUserWithEmailAndPassword, 
   signInWithEmailAndPassword, signOut, updateProfile
   } from 'firebase/auth'
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { v4 as uuidv4 } from 'uuid';

const UserContext = createContext()

export const UserContextProvider = ({children}) => {
   const [userAuth, setUserAuth] = useState(false)
   const [user, setUser] = useState({})
   const [userStatus, setUserStatus] = useState('')
   const [requests, setRequests] = useState([])
   const [friends, setFriends] = useState([])
   const [loading, setLoading] = useState(true)

   
   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
         /*
            Creates useState user, userAuth, and listens to changes in user's status and requests.
            If user not authenticated, set userAuth to false and finish by unsubscribing.
         */
        
         if (currUser) {
            setUser({
               uid: currUser.uid,
               email: currUser.email,
               displayName: currUser.displayName,
               photoURL: currUser.photoURL
            })
            setUserAuth(true)

            if (currUser.displayName && currUser.photoURL) {
               try {
                  onSnapshot(doc(db,'users', currUser.displayName), async (docData) => {
                     setUserStatus(docData.data().status)
                     setRequests(docData.data().friendRequests)
                   })

                  onSnapshot(doc(db, `users/${currUser.displayName}/friends`, 'friendRoom'), async (docData) => {
                     setFriends(docData.data().friends)
                  })
               } catch(err) {
                  console.log('Listener: ', err)
               }
            }
         } 
         else {
            setUserAuth(false)
         }
         setLoading(false)
      })

      return () => unsubscribe()
   }, [])




   // Authentication ==================================================================================================
   const signup = (email, password) => {
      return createUserWithEmailAndPassword(auth, email, password)
   }

   const login = (email, password) => {
      return signInWithEmailAndPassword(auth, email, password)
   }

   const logout = async () => {
      setUser(null)
      await signOut(auth)
   }

   const checkUsername = async (username) => {
      try {
         const docRef = doc(db, 'users', username)
         const docSnap = await getDoc(docRef)

         if (docSnap.exists()) 
            return {
               status: false,
               message: 'Username is already taken'
            }
         else {
            await setDoc(doc(db, 'users', username), {
               userID: auth.currentUser.uid,
               status: 'active',
               dmRooms: [],
               friendRequests: {
                  received: [],
                  sent: []
               }
            })

            await setDoc(doc(db, `users/${username}/friends`, 'friendRoom'), {
               userID: auth.currentUser.uid,
               friendIDs: [],
               friends: []
            })

            await updateProfile(auth.currentUser, {
               displayName: username
            })
            return {
               status: true,
               message: 'username approved'
            }
         }
      } catch(e) {
         console.log('CheckUsername: ', e.code)
      }
   }

   const updateAccImg = async (accImg, username) => {
      const fileName = `users/${auth.currentUser.uid}/${auth.currentUser.uid}_profileIcon`
      const storageRef = ref(storage, fileName)

      try {
         await uploadBytes(storageRef, accImg).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref)
            .then( async (imageUrl) => {
               await updateProfile(auth.currentUser, {
                  photoURL: imageUrl
               })
               const docRef = doc(db, "users", username)
               await updateDoc(docRef, {
                  userIcon: imageUrl
               }); 
          })
         })
      } catch(e) {
         console.log('UpdateAccImg: ', e.code)
      }
   }

   const finishSignup = async (username, accImg) => {
      try {
         const res = await checkUsername(username)

         if (res.status) {
            await updateAccImg(accImg, username)
         }
         setUser({...user, displayName: auth.currentUser.displayName, photoURL: auth.currentUser.photoURL})
         return res

      } catch (e) {
         console.log('finishSignup: ', e.code)
      }
   }
   // End of Authentication ===========================================================================================




   // Change Status ===================================================================================================
   const changeStatus = async (newStatus) => {
      if (userAuth) {   
         const docRef = doc(db, 'users', auth.currentUser.displayName)
         const docSnap = await getDoc(docRef)

         if (docSnap.exists()) {
            try {
               updateDoc(docRef, {
                  status: newStatus
               })
               if (friends.length > 0)
                  await updateFriendStatus(newStatus)
            } catch(err) {
               console.log('ChangeStatus: ', err)
            }
         }
      }
   }

   const updateFriendStatus = async (newStatus) => {
      for (let i=0; i < friends.length; ++i) {
         const friendDocRef = doc(db, `users/${friends[i].friendUsername}/friends`, 'friendRoom')
         const friendDocSnap = await getDoc(friendDocRef)

         if (friendDocSnap.exists()) {
            const friendList = friendDocSnap.data().friends
            const index = friendList.findIndex(elem => elem.friendUsername === auth.currentUser.displayName)
            friendList[index].status = newStatus

            try {
               await updateDoc(friendDocRef, {
               friends: friendList
               });
            } catch (e) {
               console.log('updateFriendStatus: ', e.message)
            }
         }
      } 
   }
   // End of Change Status ============================================================================================




   // Requests ========================================================================================================
   /*
      Types of requests:
         01: Friend Request
         02: Room Request
   */
   const sendRequest = async (usernames, requestType, room=null) => {
      let res
      switch(requestType) {
         default:
            res = await sendFriendRequest(usernames, requestType)
            break
         case '02':
            res = await sendRoomRequest(usernames, room)
            break
      }

      return res
   }

   const completeRequest = async (request, response) => {
      const requestType = request.requestType

      switch(requestType) {
         default:
            await completeFriendRequest(request, response)
            break
         case '02':
            await completeRoomRequest(request, response)
            break
      }
   }

   // Send Friend Request ===========================================================================================
   const sendFriendRequest = async (username, requestType) => {
      const requesteeRef = doc(db, 'users', username)
      const requesteeSnap = await getDoc(requesteeRef)
      const requesterFriendRoomRef = doc(db, `users/${user.displayName}/friends`, 'friendRoom')
      const requesterFriendRoomSnap = await getDoc(requesterFriendRoomRef)
      const requesterFriends = requesterFriendRoomSnap.data().friends
      const id = uuidv4()

      if (requesteeSnap.exists() && !requesterFriends.find(friend => friend.friendUsername === username)) {
         const requests = requesteeSnap.data().friendRequests
         const newRequest = {
            requestID: id,
            requesterID: auth.currentUser.uid,
            requester: user.displayName,
            requesterIcon: user.photoURL,
            requesteeID: requesteeSnap.data().userID,
            requestee: username,
            requesteeIcon: requesteeSnap.data().userIcon,
            requestType: requestType,
            ...(requestType !== '02' && {requestStatus: 'pending'}),
            timestamp: new Date().toLocaleString()
         }
         
         try {
            requests.received.push(newRequest)
            await updateDoc(requesteeRef, {
               friendRequests: requests
            })

            await updateRequester(newRequest, requesterFriendRoomRef)
            return {
               status: true,
               message: 'request sent'
            }
         } catch (err) {
            console.log('SendFriendRequest: ', err)
         }
      }
      else 
         return {
            status: false,
            message: !requesteeSnap.exists() ? 'invalid username' : 'already a friend'
         }
   }

   const updateRequester = async (request, friendRoomRef) => {
      const requesterRef = doc(db, 'users', user.displayName)
      const requesterSnap = await getDoc(requesterRef)

      // if requeter exists, update request list by pushing new request in the sent list.
      if (requesterSnap.exists()) {
         const requests = requesterSnap.data().friendRequests

         try {
            requests.sent.push(request)
            await updateDoc(requesterRef, {
               friendRequests: requests
            })

            await updateDoc(friendRoomRef, {
               friendIDs: arrayUnion(request.requesteeID)
            })
         } catch (err) {
            console.log('UpdateRequester: ', err)
         }
      }
   }

      // Handling Friend Request ==================================================================================
      const completeFriendRequest = async (request, response) => {
         const requesteeRef = doc(db, 'users', auth.currentUser.displayName)
         const requesterRef = doc(db, 'users', request.requester)
         const requesteeSnap = await getDoc(requesteeRef)
         const requesterSnap = await getDoc(requesterRef)
   
         if (requesteeSnap.exists() && requesterSnap.exists()) {
            // 1st: update request's status on requester's side
            await handleRequester(request, response, requesterRef, requesterSnap)
            if (response === 'approved') {
               const requestee = {
                  friendID: request.requesteeID,
                  friendUsername: request.requestee,
                  friendIcon: requesteeSnap.data().userIcon,
                  status: requesteeSnap.data().status,
               }
               const requester = {
                  friendID: request.requesterID,
                  friendUsername: request.requester,
                  friendIcon: requesterSnap.data().userIcon,
                  status: requesterSnap.data().status,
               }
               // 2nd: add friend to my friendRoom
               await addToFriendRoom(request.requestee, requester, request.requesterID,)
               // 3rd: add myself to requester's friendRoom
               await addToFriendRoom(request.requester, requestee, request.requesteeID)
               // 4th: delete requester's request when approved
               await deleteRequest(request, requesterRef, requesterSnap)
            }
            // 5th: delete my received request
            await deleteFriendRequest(requesteeRef, requesteeSnap, request)
         }
      }
   
      const handleRequester = async (request, response, docRef, docSnap) => {
         const requests = docSnap.data().friendRequests
         const sentRequests = requests.sent
         const updSentRequest = sentRequests.find(prevRequest => prevRequest.requestID === request.requestID)
         updSentRequest.requestStatus = response
   
         try {
            await updateDoc(docRef, {
               friendRequests: requests
            })
         } catch(err) {
            console.log('HandleRequester: ', err)
         }
      }
   
      const addToFriendRoom = async (accOwner, friend, friendID) => {
         const docRef = doc(db, `users/${accOwner}/friends`, 'friendRoom')
   
         try {
            await updateDoc(docRef, {
               friendIDs: arrayUnion(friendID),
               friends: arrayUnion(friend)
            })
         } catch(err) {
            console.log('AddToFriendRoom: ', err)
         }
      }
   
      const deleteFriendRequest = async (docRef, docSnap, request) => {
         const requests = docSnap.data().friendRequests
         const receivedRequests = requests.received.filter(prevRequest => prevRequest.requestID !== request.requestID)
         requests.received = receivedRequests
   
         try {
            await updateDoc(docRef, {
               friendRequests: requests
            })
         } catch(err) {
            console.log('DeleteFriendRequest: ', err)
         }
      }
      // End of Handling Friend Request ===========================================================================

   // End of Send Friend Request ====================================================================================

   
   // Handling DMRoom Request =======================================================================================
   const createDMRoom = async (friends) => {
      const requesterRef = doc(db, 'users', user.displayName)
      const requesterSnap = await getDoc(requesterRef)
      const dmRoomIcon = `#${Math.floor(Math.random()*16777215).toString(16)}`
      const dmRoomID = uuidv4()
      let DMRoomName = [user.displayName]

      for (let i = 0; i < friends.length; ++i)
         DMRoomName.push(friends[i].friendUsername)

      if (requesterSnap.exists()) {
         const newDMRoom = {
            dmRoomID: dmRoomID,
            dmRoomName: DMRoomName.join(', '),
            dmRoomIcon: dmRoomIcon
         }

         try {
            await updateDoc(requesterRef, {
               dmRooms: arrayUnion(newDMRoom)
            })

            await createParticipantsDMRoom(friends, newDMRoom)
         } catch(err) {
            console.log('CreateDMRoom: ', err)
         }
      }
   }

   const createParticipantsDMRoom = async (friends, newDMRoom) => {
      let participantIDs = [auth.currentUser.uid]
      let participants = [{
         participantID: auth.currentUser.uid,
         participantIcon: user.photoURL,
         participantUsername: user.displayName
      }]
      
      for (let i = 0; i < friends.length; ++i) {
         const docRef = doc(db, 'users', friends[i].friendUsername)
         const docSnap = await getDoc(docRef)
         
         participants.push({
            participantUsername: friends[i].friendUsername,
            participantIcon: friends[i].friendIcon,
            participantID: friends[i].friendID,
         })
         participantIDs.push(friends[i].friendID)

         if (docSnap.exists()) {
            try {
               await updateDoc(docRef, {
                  dmRooms: arrayUnion(newDMRoom)
               })
   
               
            } catch(err) {
               console.log('CreateDMRoom: ', err)
            }
         }
      }
      
      await setDoc(doc(db, 'dmRooms', newDMRoom.dmRoomID), {
         dmRoomID: newDMRoom.dmRoomID,
         dmRoomName: newDMRoom.dmRoomName,
         dmRoomIcon: newDMRoom.dmRoomIcon,
         participantIDs: participantIDs,
         participants: participants,
         userID: auth.currentUser.uid
      })
   }
   // End of Handling DMRoom Request ================================================================================
   
   
   // Send Room Request =============================================================================================
   const sendRoomRequest = async (friends, room) => {
      const id = uuidv4()
      
      await updateRoomParticipants(friends, room) 
      for (let i = 0; i < friends.length; ++i) {
         const newRequest = {
            requestID: id,
            requesterID: auth.currentUser.uid,
            requester: user.displayName,
            requesterIcon: user.photoURL,
            roomID: room.roomID,
            miniRoomID: room.miniRoomID,
            roomName: room.roomName,
            roomIcon: room.roomIcon,
            requestType: '02',
            timestamp: new Date().toLocaleString()
         }
         const docRef = doc(db, 'users', friends[i].friendUsername)
         const docSnap = await getDoc(docRef)

         if (docSnap.exists()) {
            const requests = docSnap.data().friendRequests
            requests.received.push(newRequest)
            try {
               await updateDoc(docRef, {
                  friendRequests: requests
               })
            } catch(err) {
               console.log('SendRoomRequest: ', err)
            }
         }
      }

      return {
         status: true,
         message: 'success'
      }
   }
   
   const updateRoomParticipants = async (friends, room) => {
      const roomRef = doc(db, 'rooms', room.roomID)
      const roomSnap = await getDoc(roomRef)

      if (roomSnap.exists()) {
         const participantIDs = roomSnap.data().participantIDs
         const participants = roomSnap.data().participants
         try {
            for (let i = 0; i < friends.length; ++i) {
               participantIDs.push(friends[i].friendID)
               participants.push({
                  participantID: friends[i].friendID,
                  participantUsername: friends[i].friendUsername,
                  participantIcon: friends[i].friendIcon,
                  status: 'pending'
               })               
            }

            await updateDoc(roomRef, {
               participantIDs: participantIDs,
               participants: participants
            })
         } catch(err) { 
            console.log('UpdateRoomParticipants: ', err)
         }
      }
   }

      // Handling RoomRequest =====================================================================================
      const completeRoomRequest = async (request, response) => {
         const roomRef = doc(db, 'rooms', request.roomID)
         if (response === 'declined') {
            try {
               await updateDoc(roomRef, {
                  participantIDs: arrayRemove(auth.currentUser.uid),
                  participants: arrayRemove({
                     participantID: auth.currentUser.uid,
                     participantUsername: user.displayName,
                     participantIcon: user.photoURL,
                     status: 'pending'
                  })
               })
            } catch(err) {
               console.log('CompleteRoomRequest: ', err) 
            }
            await updateDoc
         }
         else {
            const docRef = doc(db, 'users', user.displayName)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
               const requests = docSnap.data().friendRequests
               requests.received = requests.received.filter(prev => prev.requestID !== request.requestID)
               try {
                  await updateDoc(docRef, {
                     friendRequests: requests,
                     rooms: arrayUnion({
                        miniRoomID: request.miniRoomID,
                        roomID: request.roomID,
                        roomIcon: request.roomIcon 
                     })
                  })
               } catch(err) { 
                  console.log('CompleteRoomRequest: ', err)
               }
            }

            const roomSnap = await getDoc(roomRef)
            const participants = roomSnap.data().participants
            const participant = participants.find(ptc => ptc.participantID === auth.currentUser.uid)
            delete participant.status

            await updateDoc(roomRef, {
               participants: participants
            })
         }
         
      }
      // End of Handling RoomRequest ==============================================================================

   // End of Send Room Request ======================================================================================


   const deleteRequest = async (request, userDocRef = null, userDocSnap = null) => {
      const docRef = !userDocRef ? doc(db, 'users', request.requester) : userDocRef
      const docSnap = !userDocSnap ? await getDoc(docRef) : userDocSnap

      if (docSnap.exists()) {
         const requests = docSnap.data().friendRequests
         const sentRequests = requests.sent.filter(prevRequest => prevRequest.requestID !== request.requestID)
         requests.sent = sentRequests

         try {
            await updateDoc(docRef, {
               friendRequests: requests
            })
         } catch(err) {
            console.log('DeleteRequest: ', err)
         }
      }
   }

   // End of Requests =================================================================================================




   // Create Room =====================================================================================================
   const createRoom = async (roomName, roomIcon) => {
      const id = uuidv4()
      const textRoomID = uuidv4()
      const room = {
         roomID: id,
         roomName: roomName,
         miniRoomID: textRoomID,
         roomIcon: await storeRoomIcon(id, roomIcon)
      }
      const userRef = doc(db, 'users', user.displayName)

      try {
         await updateDoc(userRef, {
            rooms: arrayUnion(room)
         })
         await createRoomDoc(room, textRoomID)
      } catch(err) {
         console.log('CreateRoom: ', err)
      }
   }

   const storeRoomIcon = async (id, roomIcon) => {
      const fileName = `rooms/${id}/${roomIcon.name}`
      const storageRef = ref(storage, fileName)

      try {
         return await uploadBytes(storageRef, roomIcon).then(async (snapshot) => {
            return await getDownloadURL(snapshot.ref)
            .then( async (imageUrl) => {
               return imageUrl
          })
         })
      } catch(err) {
         console.log('StoreRoomIcon: ', err)
      }
   }

   const createRoomDoc = async (room, textRoomID) => {
      const voiceRoomID = uuidv4()
      try {
         await setDoc(doc(db, 'rooms', room.roomID), {
            roomID: room.roomID,
            roomName: room.roomName,
            roomIcon: room.roomIcon,
            userID: auth.currentUser.uid,
            mainMiniRoom: textRoomID,
            mainRooms: [
               {
                  mainRoomName: 'Text Main Room',
                  miniRooms: [
                     {
                        miniRoomID: textRoomID,
                        miniRoomName: 'general',
                        miniRoomType: 'text'
                     }
                  ],
               },
               {
                  mainRoomName: 'Voice Main Room',
                  miniRooms: [
                     {
                        miniRoomID: voiceRoomID,
                        miniRoomName: 'general',
                        miniRoomType: 'voice'
                     }
                  ]
               }
            ],
            participantIDs: arrayUnion(auth.currentUser.uid),
            participants: arrayUnion({
               participantUsername: user.displayName,
               participantIcon: user.photoURL,
               participantID: auth.currentUser.uid,
            })
         })

         await setDoc(doc(db, `rooms/${room.roomID}/miniRooms`, textRoomID) , {
            miniRoomID: textRoomID,
            miniRoomName: 'general',
            miniRoomType: 'text'
         })

         await setDoc(doc(db, `rooms/${room.roomID}/miniRooms`, voiceRoomID) , {
            miniRoomID: voiceRoomID,
            miniRoomName: 'general',
            miniRoomType: 'voice'
         })
      } catch(err) {
         console.log('CreateRoomDoc: ', err)
      }
   }
   // End of Create Room ==============================================================================================
   



   // Delete Room =====================================================================================================
   const deleteRoom = async (room) => {
      // delete it in participants room list
      for (let i = 0; i < room.participants.length; ++i) {
         deletePtcRoom(room.participants[i].participantUsername, room.roomID)
      } 
      // delete doc
      await deleteDoc(doc(db, 'rooms', room.roomID))
      // delete all miniRoomFiles
      for (let i = 0; i < room.mainRooms.length; ++i) {
         for (let j = 0; j < room.mainRooms[i].miniRooms.length; ++j) {
            await deleteMiniRoomFiles(room.roomID, room.mainRooms[i].miniRooms[j].miniRoomID)
         }
      }
   }
   const deletePtcRoom = async (participant, roomID) => {
      try {
         const userRef = doc(db, 'users', participant)
         const userSnap = await getDoc(userRef)

         if (userSnap.exists()) {
            const rooms = userSnap.data().rooms.filter(room => room.roomID !== roomID)

            await updateDoc(userRef, {
               rooms: rooms
            })
         }
      } catch(err) {
         console.log('DeletePtcRoom: ', err)
      }
   }
   // End of Delete Room ==============================================================================================




   // Create Mini Room ================================================================================================
   const createMiniRoom = async (id, mainRoomName, name, type) => {
      const roomRef = doc(db, 'rooms', id)
      const roomSnap = await getDoc(roomRef)

      const miniRoomID = uuidv4()
      if (roomSnap.exists()) {
         try {
            const mainRooms = roomSnap.data().mainRooms
            const mainRoom = mainRooms.find(prev => prev.mainRoomName === mainRoomName)
            mainRoom.miniRooms.push({
               miniRoomID: miniRoomID,
               miniRoomName: name,
               miniRoomType: type
            })
   
            await updateDoc(roomRef, {
               mainRooms: mainRooms
            })

            await createMiniRoomDoc(id, name, type, miniRoomID)
         } catch(err) {
            console.log('CreateMiniRoom: ', err)
         }
      }
   }

   const createMiniRoomDoc = async (id, name, type, miniRoomID) => {
      try {
         await setDoc(doc(db, `rooms/${id}/miniRooms`, miniRoomID), {
            miniRoomID: miniRoomID,
            miniRoomName: name,
            miniRoomType: type
         })
      } catch(err) {
         console.log('CreateMiniRoomDoc: ', err)
      }
   }
   // End of Create Mini Room =========================================================================================




   // Edit Main/Mini Room Name ========================================================================================
   const editMainMiniName = async (type, prevName, newName, roomID, miniRoomID=null) => {
      const roomRef = doc(db, 'rooms', roomID)
      const roomSnap = await getDoc(roomRef)

      if (roomSnap.exists()) {
         try {
            let mainRooms = roomSnap.data().mainRooms
            if (type === 'main') {
               const mainRoom = mainRooms.find(prev => prev.mainRoomName === prevName)
               if (mainRoom.miniRooms.length === 0 && newName === '')
                  mainRooms = mainRooms.filter(prev => prev.mainRoomName !== prevName) 
               else
                  mainRoom.mainRoomName = newName
            }
            else if (type === 'mini') {
               let miniRoom
               for (let i = 0; i < mainRooms.length; ++i) {
                  miniRoom = mainRooms[i].miniRooms.find(prev => prev.miniRoomID === miniRoomID)
                  if (miniRoom)
                     break
               }

               miniRoom.miniRoomName = newName

               const miniRoomRef = doc(db, `rooms/${roomID}/miniRooms`, miniRoomID)

               await updateDoc(miniRoomRef, {
                  miniRoomName: newName
               })
            }

            await updateDoc(roomRef, {
               mainRooms: mainRooms
            })
         } catch(err) {
            console.log('EditMainMiniRoom: ', err)
         }
      }
   } 
   // End of Edit Main/Mini Room Name =================================================================================




   // Create Main Room ================================================================================================
   const createMainRoom = async (mainRoomName, roomID) => {
      const docRef = doc(db, 'rooms', roomID)
      const newMainRoom = {
         mainRoomName: mainRoomName,
         miniRooms: []
      }

      try {
         await updateDoc(docRef, {
            mainRooms: arrayUnion(newMainRoom)
         })
      } catch(err) {
         console.log('CreateMainRoom: ', err)
      }
   }
   // End of Create Main Room =========================================================================================
   



   // Delete Mini Room ================================================================================================
   const deleteMiniRoom = async (roomID, mainRoomName, miniRoomID) => {
      // update list
      const roomRef = doc(db, 'rooms', roomID)
      const roomSnap = await getDoc(roomRef)

      if (roomSnap.exists()) {
         try {
            const mainRooms = roomSnap.data().mainRooms
            let mainRoom = mainRooms.find(prev => prev.mainRoomName === mainRoomName)
            let newMainMiniRoom

            mainRoom.miniRooms = mainRoom.miniRooms.filter(prev => prev.miniRoomID !== miniRoomID)

            if (miniRoomID === roomSnap.data().mainMiniRoom) {
               for (let i = 0; i < mainRooms.length; ++i) {
                  newMainMiniRoom = mainRooms[i].miniRooms.find(prev => prev.miniRoomType === 'text')
                  if (newMainMiniRoom)
                     break
               }
               await updateMainMiniRoomPtcs(roomSnap, newMainMiniRoom)
            }
            
            await deleteMiniRoomFiles(roomID, miniRoomID)
            await updateDoc(roomRef, {
               mainRooms: mainRooms,
               ...(newMainMiniRoom && {mainMiniRoom: newMainMiniRoom.miniRoomID})
            })
            await deleteDoc(doc(db, `rooms/${roomID}/miniRooms`, miniRoomID))

         } catch(err) {
            console.log('DeleteMiniRoom: ', err)
         }
      }
   }

   const deleteMiniRoomFiles = async (roomID, miniRoomID) => {
      const room = `rooms/${roomID}/miniRooms/${miniRoomID}/messageFiles`
      const storageRef = ref(storage, room)
  
      listAll(storageRef)
      .then((res) => {
        res.prefixes.forEach((folderRef) => {
          listAll(folderRef)
          .then((res) => {
            res.items.forEach((subItemRef) => {
              deleteObject(subItemRef)
            });
          }).catch((error) => {
            console.log('deleteRoomFiles-in-subFolders: ', error.message)
          });
        });
        res.items.forEach((itemRef) => {
          deleteObject(itemRef)
        });
      }).catch((error) => {
        console.log('DeleteMiniRoomFiles: ', error.message)
      });
  
   }

   const updateMainMiniRoomPtcs = async (roomSnap, newMainMiniRoom) => {
      const participants = roomSnap.data().participants
      for (let i = 0; i < participants.length; ++i) {
         const docRef = doc(db, 'users', participants[i].participantUsername)
         const docSnap = await getDoc(docRef)

         if (docSnap.exists()) {
            const rooms = docSnap.data().rooms
            const room = rooms.find(prev => prev.roomID === roomSnap.data().roomID)
            room.miniRoomID = newMainMiniRoom.miniRoomID

            try {
               await updateDoc(docRef, {
                  rooms: rooms
               })
            } catch(err) {
               console.log('UpdateMainMiniRoomPtcs: ', err)
            }
         }
      }
   }
   // End of Edit Main/Mini Room Name =================================================================================




   // AddToDmRoom =====================================================================================================
   const addToDmRoom = async (friends, dmRoom) => {
      let dmRoomName = dmRoom.dmRoomName.split(', ')
      let participantIDs = dmRoom.participantIDs
      let participants = dmRoom.participants
      let newDmRoom = dmRoom
      
      for (let i = 0; i < friends.length; ++i) {
         dmRoomName.push(friends[i].friendUsername)
         participantIDs.push(friends[i].friendID)
         participants.push({
            participantUsername: friends[i].friendUsername,
            participantIcon: friends[i].friendIcon,
            participantID: friends[i].friendID,
         })
      }
      
      newDmRoom.dmRoomName = dmRoomName.join(', ')
      newDmRoom.participantIDs = participantIDs
      newDmRoom.participants = participants

      for (let i = 0; i < newDmRoom.participants.length; ++i) {
         const docRef = doc(db, 'users', newDmRoom.participants[i].participantUsername)
         const docSnap = await getDoc(docRef)

         if (docSnap.exists()) {
            const dmRoomList = docSnap.data().dmRooms
            const index = dmRoomList.findIndex(dmRoom => dmRoom.dmRoomID === newDmRoom.dmRoomID)
            dmRoomList[index] = {
               dmRoomID: newDmRoom.dmRoomID,
               dmRoomIcon: newDmRoom.dmRoomIcon,
               dmRoomName: newDmRoom.dmRoomName
            }
            try {
               await updateDoc(docRef, {
                  dmRooms: dmRoomList
               })
            } catch(err) {
               console.log('AddToDmRoom: ', err)
            }
         }
      }
      
      const docRef = doc(db, 'dmRooms', newDmRoom.dmRoomID)
      try {
         await updateDoc(docRef, {
            dmRoomName: newDmRoom.dmRoomName,
            participantIDs: newDmRoom.participantIDs,
            participants: newDmRoom.participants,
         })
      } catch(err) {
         console.log('AddToDmRoom: ', err)
      }
   }
   // End of Add To DMRoom ============================================================================================




   // Send Message ====================================================================================================
   const sendMessage = async (type, id, message, subID=null) => {
      const docRef = type === '01' 
         ?
            doc(db, `dmRooms/${id}/messages`, message.messageID)
         :
            doc(db, `rooms/${id}/miniRooms/${subID}/messages`, message.messageID)

      let msgFileUrl = null
      if (message.messageFile)
         msgFileUrl = await storeMsgFile(type, id, message, subID)

      try {
         await setDoc(docRef, {
            msgID: message.messageID,
            author: message.messageAuthor,
            authorIcon: message.authorIcon,
            fileName: message.messageFileName,
            file: msgFileUrl,
            msg: message.msg,
            pinned: message.pinned,
            replyTo: message.replyTo,
            timestamp: message.timestamp
         })
      } catch(err) {
         console.log('SendMessage: ', err)
      }
   }

   const storeMsgFile = async (type, id, message, subID=null) => {
      const fileName = type === '01' 
         ?
            `dmRooms/${id}/messageFiles/${message.messageFile.name}`
         :
            `rooms/${id}/miniRooms/${subID}/messageFiles/${message.messageFile.name}`
      const storageRef = ref(storage, fileName)

      try {
         return await uploadBytes(storageRef, message.messageFile).then(async (snapshot) => {
            return await getDownloadURL(snapshot.ref)
            .then( async (imageUrl) => {
               return imageUrl
          })
         })
      } catch(e) {
         console.log('UpdateAccImg: ', e.code)
      }
   }

   // End of Send Message =============================================================================================




   // Pin Message =====================================================================================================
   const pinMsg = async (type, id, msgID, status, subID=null) => {
      const docRef = type === '01'
         ?
            doc(db, `dmRooms/${id}/messages`, msgID)
         :
            doc(db, `rooms/${id}/miniRooms/${subID}/messages`, msgID)

      await updateDoc(docRef, {
         pinned: status
      })
   }
   // End of Pin Message ==============================================================================================
   
   
   
   
   // Delete Message ==================================================================================================
   const deleteMsg = async (type, id, message, subID=null) => {
      const docRef = type === '01'
         ?
            doc(db, `dmRooms/${id}/messages`, message.msgID)
         :
            doc(db, `rooms/${id}/miniRooms/${subID}/messages`, message.msgID)

      try {
         await deleteDoc(docRef)

         if (message.file)
            await deleteMsgFile(type, id, message, subID)
      } catch(err) {
         console.log('DeleteMsg: ', err)
      }
   }

   const deleteMsgFile = async (type, id, msg, subID) => {
      const fileRef = type === '01'
         ?
            ref(storage, `dmRooms/${id}/messageFiles/${msg.fileName}`)
         :
            ref(storage, `rooms/${id}/miniRooms/${subID}/messageFiles/${msg.fileName}`)
      
      try {
         await deleteObject(fileRef)
      } catch(err) {
         console.log('DeleteMsgFile:' , err)
      }

   }
   // End of Delete Message ===========================================================================================

   
   
   
   // Delete DmRoom ===================================================================================================
   const removeDmRoom = async (dmRoom) => {
      const userRef = doc(db, 'users', user.displayName)
      
      try {
         await updateDoc(userRef, {
            dmRooms: arrayRemove(dmRoom)
         })
      } catch(err) {
         console.log('DeleteDmRoom: ', err)
      }
      
      const docRef = doc(db, 'dmRooms', dmRoom.dmRoomID)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
         try {
            let newDmRoomName = docSnap.data().dmRoomName.split(', ').filter(name => name !== user.displayName)

            if (newDmRoomName.length === 1) {
               await removeDmRoomPtcs(dmRoom.dmRoomID, newDmRoomName)
               await deleteDmRoom(docRef)
            }
            else {
               newDmRoomName = newDmRoomName.join(', ')
               const newPtcs = docSnap.data().participants.filter(p => p.participantUsername !== user.displayName) 
               const newPtcsIDs = docSnap.data().participantIDs.filter(p => p !== auth.currentUser.uid)
   
               await updateDoc(docRef, {
                  dmRoomName: newDmRoomName,
                  participantIDs: newPtcsIDs,
                  participants: newPtcs
               })
   
               await updatePtcsDmRooms(newPtcs, dmRoom)
            }
         } catch(err) {
            console.log('DeleteDmRom-updDmRoom: ', err)
         }
      }
   }

   
   const removeDmRoomPtcs = async (dmRoomID, participants) => {
      for (let i = 0; i < participants.length; ++i) {
         try {
            const docRef = doc(db, 'users', participants[i])
            const docSnap = await getDoc(docRef)
   
            if (docSnap.exists()) {
               const dmRoomList = docSnap.data().dmRooms.filter(prev => prev.dmRoomID !== dmRoomID)

               await updateDoc(docRef, {
                  dmRooms: dmRoomList
               })
            }
         } catch(err) {
            console.log('RemoveDmRoomPtcs: ', err)
         }
      }
   }

   const deleteDmRoom = async (docRef) => {
      try {
         await deleteDoc(docRef)
      } catch(err) {
         console.log('DeleteDmRoom: ', err)
      }
   }

   
   const updatePtcsDmRooms = async (newPtcs, dmRoom) => {
      for (let i = 0; i < newPtcs.length; ++i) {
         try {
            const docRef = doc(db, 'users', newPtcs[i].participantUsername)
            const docSnap = await getDoc(docRef)
   
            if (docSnap.exists()) {
               const tmpDmRoom = docSnap.data().dmRooms.find(prev => prev.dmRoomID === dmRoom.dmRoomID)
               let newDmRoomName = tmpDmRoom.dmRoomName.split(', ').filter(name => name !== user.displayName)
               newDmRoomName = newDmRoomName.join(', ')
               const dmRooms = docSnap.data().dmRooms
               const index = dmRooms.findIndex(prev => prev.dmRoomID === dmRoom.dmRoomID)

               dmRooms[index].dmRoomName = newDmRoomName
               await updateDoc(docRef, {
                  dmRooms: dmRooms
               })
            }
         } catch(err) {
            console.log('UpdatePtcsDmRooms: ', err)
         }
      }
   }
   // End of Delete DmRoom ============================================================================================




   // Delete Friend ===================================================================================================
   const deleteFriend = async (friend) => {
      const docRef = doc(db, `users/${user.displayName}/friends`, 'friendRoom')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists())
         try {
            await updateDoc(docRef, {
               friendIDs: arrayRemove(friend.friendID),
               friends: arrayRemove(friend)
            })
         } catch(err) {
            console.log('DeleteFriend: ', err)
         }
   }
   // End of Delete Friend ============================================================================================

   
   return (
      <UserContext.Provider value={{userAuth, user, userStatus, requests, friends, signup, login, logout, finishSignup,
         sendRequest, completeRequest, deleteRequest, changeStatus, deleteFriend, createDMRoom, addToDmRoom, createMainRoom,
         sendMessage, pinMsg, deleteMsg, removeDmRoom, createRoom, createMiniRoom, editMainMiniName, deleteMiniRoom,
         deleteRoom}}>
         {loading ? null : children}
      </UserContext.Provider>
   )
}

export const useUserContext = () => useContext(UserContext)