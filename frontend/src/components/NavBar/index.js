import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'; 
import { logout, selectUser } from '../../features/userSlice'
import { setPost } from '../../features/postSlice'
import socketContext from '../useSocketContext'
import styles from './NavBar.module.css'

const NavBar = () => {

    const { deleteSocket, socket } = useContext(socketContext)

    const dispatch = useDispatch()
    const { profile_photo } = useSelector(selectUser)
    
    const exit = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        dispatch(logout())
        dispatch(setPost())
        socket.disconnect()
        deleteSocket()
        window.location = '/login'
    }

    return (
        <>
        <div className={styles.navContainer}></div>
        <div className={styles.nav_bar}>
            <div className={styles.logo_input}>
                <h5>
                    <svg width='2.5rem' height='2.5rem' xmlns="http://www.w3.org/2000/svg" color='rgb(17, 133, 241)'  viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                </h5>
                <input className={styles.search} placeholder='search on social media' />
            </div>

            <div className={styles.mainIcones}>
                <Tippy content='home'>
                    <Link to='/'>
                        <svg xmlns="http://www.w3.org/2000/svg" color='rgb(201, 199, 199)' width='2rem'  viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                    </Link>
                </Tippy>
                <Tippy content='videos'>
                     <Link to='/videos'>
                        <svg xmlns="http://www.w3.org/2000/svg" color='rgb(201, 199, 199)' width='2rem'  viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                    </Link>
                </Tippy>
            </div>
            <div className={styles.rightIcones}>
                <Tippy content='profile'>
                    <Link to='/account/profile/'>  
                        <h5 className={styles.profile_img}>
                        {
                            profile_photo
                                ? <img style={{ width: '2.3rem', height: '2.3rem' }} src={'http://localhost:3001'+profile_photo}  alt={'profile_img'}/>
                                : <Skeleton width={2.3} height={2.3} circle={true} />
                        }    
                        </h5>
                    </Link>
                </Tippy>
                
                <Tippy content='messages' >
                    <Link to='/account/chats' data-tip='messages' >
                        <svg xmlns="http://www.w3.org/2000/svg" color='rgb(201, 199, 199)' width='2rem' className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>      
                    </Link>
                </Tippy>
                <Tippy content='notifications'>
                    <Link to='/account/notifications'>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        color='rgb(201, 199, 199)'
                        width='2rem'
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        >
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                    </Link>
                </Tippy>
                <Tippy content='logout'>
                    <Link onClick={exit} to='/login'>
                        <svg xmlns="http://www.w3.org/2000/svg" color='rgb(201, 199, 199)' width='2rem' className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </Tippy>
                
            </div>
    </div>
    </>
    )
}

export default NavBar