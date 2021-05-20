import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'; 
import { logout, selectUser } from '../../features/userSlice'
import { setPost } from '../../features/postSlice'
import { searchUsers } from '../../features/navBarSlice'
import styles from './NavBar.module.css'
import translate from '../../i18n/translate'
import { changeLenguage, selectLenguage } from '../../features/lenguageSlice'

const NavBar = () => {

    const [ query, setQuery ] = useState('')
    const { profile_photo, name } = useSelector(selectUser)
    const { results, isLoading } = useSelector(state => state.navBar)
    const dispatch = useDispatch()
    const { language } = useSelector(selectLenguage)
    
    const exit = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        dispatch(logout())
        dispatch(setPost())
    }

    const searchUser = event => {
        event.preventDefault()
        if(query) {
            dispatch(searchUsers(query))
        }
    }

    const handleChangeLenguage = () => {
        dispatch(changeLenguage())
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
                <form onSubmit={searchUser}>
                    <input onChange={({ target }) => setQuery(target.value)} className={styles.search} placeholder='search on social media' />
                </form>
                    {
                        isLoading
                        ? <NotResults loading={isLoading} query={query}/>
                        : results.length >= 1
                            ? <div className={styles.user_list} >
                                {
                                    results.map(
                                        user => <SearchListUsers key={user._id} {...user}/>
                                    )
                                }
                            </div>
                            : null
                    }              
            </div>

            <div className={styles.mainIcones}>
                <Tippy content={translate('home')}>
                    <Link to='/'>
                        <div  className={styles.circle_button}>
                             <svg xmlns="http://www.w3.org/2000/svg" color='rgb(119, 119, 119)' width='1.5rem'  viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </div>
                    </Link>
                </Tippy>
                <button className={styles.change_language_button} onClick={handleChangeLenguage}>
                    {language === 'es-mx' ? 'change to english' : 'cambiar a español' }
                </button>
                <Tippy content={translate('videos')}>
                     <Link to='/videos'>
                        <div  className={styles.circle_button}> 
                            <svg xmlns="http://www.w3.org/2000/svg" color='rgb(119, 119, 119)' width='1.5rem' viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                        </div>
                    </Link>
                </Tippy>
            </div>
            <div className={styles.rightIcones}>
                <Tippy content={translate('profile')}>
                    <Link to='/account/profile/' className={styles.profile_button_link}>  
                        <div className={styles.profile_button}>
                            {
                                profile_photo
                                    ? (
                                        <>
                                        <img style={{ width: '1.5rem', height: '1.5rem' }} src={'http://localhost:3001'+profile_photo}  alt={'profile_img'}/>
                                        <span>{name}</span>
                                        </>
                                    )
                                    : <Skeleton width={2.3} height={2.3} circle={true} />
                            } 
                        </div>
                    </Link>
                </Tippy>
                
                <Tippy content={translate('messages')} >
                    <Link to='/account/chats' data-tip='messages' >
                        <div className={styles.circle_button}>
                        <svg xmlns="http://www.w3.org/2000/svg" width='1.5rem' color='rgb(119, 119, 119)' viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
</svg>      
                        </div>
                    </Link>
                </Tippy>
                <Tippy content='notifications'>
                    <Link to='/account/notifications'>
                        <div  className={styles.circle_button}>
                            <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            color='rgb(119, 119, 119)'
                            width='1.5rem'
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            >
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                        </div>
                    </Link>
                </Tippy>
                <Tippy content={translate('logout')}>
                    <Link onClick={exit} to='/login'>
                        <div  className={styles.circle_button}>
                            <svg xmlns="http://www.w3.org/2000/svg" color='rgb(119, 119, 119)' width='1.5rem' className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </Link>
                </Tippy>
                
            </div>
    </div>
    </>
    )
}


const SearchListUsers = props => {

    const { name, lastName, profile_photo, _id } = props

    return (
        <Link className={styles.user_list_name} to={`/account/profile/${_id}`}>
            <div className={styles.user_list_card}>
                <img className={styles.user_list_img} src={'http://localhost:3001'+profile_photo} alt={name}/>
                <p>{name}{' '}{lastName}</p>
            </div>  
        </Link>
    )
}


const NotResults = props => {

    const { loading, query } = props

    return (
        <div className={styles.user_list_card}>
            <p>{ loading ? 'searching users...' : `Not Results for: ${query}` }</p>
        </div>  
    )
}


export default NavBar