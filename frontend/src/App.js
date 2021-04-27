import { useContext, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from './features/userSlice'
import socketContext from './components/useSocketContext'
import PrivateRoute from './components/PrivateRouter'
import Main from './screens/Main'
import Home from './screens/Home'
import Verification from './screens/Verification'
import Login from './screens/Login'
import unknown from './screens/Unknown'
import Verified from './screens/Verified'
import Profile from './screens/Profile'
import Chats from './screens/Chat'

const App = () => {
  
  const user = useSelector(selectUser)
  const { socket } = useContext(socketContext)

  useEffect(() => {
    document.title = 'social media'
    if(user) {
      socket.emit('updateUserId', user.id)
    }
  }, [])

  return  (
    <div>
        <Router >
          <Switch >
            <PrivateRoute exact path='/home' component={Home} />
            <PrivateRoute path='/account/profile/:id?' exact component={Profile} />
            <PrivateRoute path='/account/chats' exact component={Chats} />
            <Route path='/' exact component={user ? Home : Main} />
            <Route path='/register' exact component={Main} />
            <Route path='/email-verification' exact component={Verification}/>
            <Route path='/login' exact  component={Login} />    
            <Route path='/account/verified/:token' exact component={Verified} />
            <Route path='*' exact component={unknown}/>
          </Switch>
        </Router>
    </div>
  )
}


export default App