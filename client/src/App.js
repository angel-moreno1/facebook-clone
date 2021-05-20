import { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from './features/userSlice'
import { addNewMessage, loadLatestChats, selectChats } from './features/chatSlice'
import Main from './screens/Main'
import Home from './screens/Home'
import Verification from './screens/Verification'
import Login from './screens/Login'
import unknown from './screens/Unknown'
import Verified from './screens/Verified'
import Profile from './screens/Profile'
import Chats from './screens/Chat'
import Videos from './screens/Videos'
import socketContext from './components/useSocketContext'
import PrivateRoute from './components/PrivateRouter'
import SinglePost from './components/SinglePost'
import { UserFriends, UserInformation, UserPhotos } from './components/UserProfile'
import { I18Provider, LOCALES } from './i18n'
import { clearNotification, newNotification } from './features/notifySlice'
import Notify from './components/notify'

const App = () => {
  
  const user = useSelector(selectUser)
  const { socket } = useContext(socketContext)
  const dispatch = useDispatch()
  const { currentChat } = useSelector(selectChats)
  const { language } = useSelector(state => state.lenguage)
  const [ showNotify, setShowNotify ] = useState(false)
  const { notifycation } = useSelector(state => state.notify)

  useEffect(() => {
    document.title = 'social media'
    if(user) {
      socket.emit('updateUserId', user.id)
    }
    socket.on('newMessage', ({ msg, chatId, isFile }) => {
      if(socket.id) {
        if(currentChat.messages) {
            dispatch(addNewMessage({msg, chatId, isFile}))
            const localUser = JSON.parse(localStorage.getItem('user'))   
            dispatch(loadLatestChats({id: localUser.id, token: localUser.token})) 
        }
      }
    })
    socket.on('newMessageNotifycation', () => {
      dispatch(newNotification())
    })
    
  }, [])

  useEffect(() => {
    if(notifycation) {
       setShowNotify(true)
      const timeout = setTimeout(() => {
        dispatch(clearNotification())
        setShowNotify(false)
      }, 2000)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [notifycation])

  return  (
    <I18Provider
      locale={language}  
    >
      <div>
        {showNotify && <Notify notifyMsg={notifycation} />}
       
          <Router >
            <Switch >
              <PrivateRoute exact path='/home' component={Home} />
              <PrivateRoute path='/account/profile/:id?' exact component={Profile} />
              <PrivateRoute path='/account/profile/:id?/photos' exact component={() => <UserPhotos />} />
              <PrivateRoute path='/account/profile/:id?/information' exact component={() => <UserInformation />} />
              <PrivateRoute path='/account/profile/:id?/friends' exact component={() => <UserFriends />} />
              <PrivateRoute path='/account/chats' exact component={Chats} />
              <Route path='/' exact component={user ? Home : Main} />
              <Route path='/register' exact component={Main} />
              <Route path='/email-verification' exact component={Verification}/>
              <Route path='/login' exact  component={Login} />    
              <Route path='/account/verified/:token' exact component={Verified} />
              <Route path='/videos' exact component={Videos} />
              <Route path='/:userId/photos/:id' exact component={SinglePost} />
              <Route path='*' exact component={unknown}/>
            </Switch>
          </Router>
      </div>
    </I18Provider>
  )
}


export default App