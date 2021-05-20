import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import { loadUserPosts, selectUser, changeDesc, changeInfo, updatedUserPhoto } from '../../features/userSlice'
import Post from '../Post'
import NavBar from '../NavBar'
import CreatePost from '../CreatePost';
import SkeletonPost from '../SkeletonPost';
import moment from 'moment';
import useUpload from '../../hooks/useUpload';
import styles from './UserProfile.module.css'
import { getAllFriends, selectHomeState } from '../../features/homeSlice';
import translate from '../../i18n/translate'
import axios from 'axios';

const UserProfile = () => {

    const [ openEdit, setOpenEdit ] = useState(false)
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const { posts, isLoading, hasError } = useSelector(state => state.user)
    const { friends, isLoadingFriends, hasErrorFriends } = useSelector(selectHomeState)
    const cachedPosts = posts

    useEffect(() => {
        if(posts.length < 1 || cachedPosts.length !== posts.length ){
            dispatch(loadUserPosts({id: user.id, token: user.token}))
        }  
    }, [dispatch, posts.length])

    useEffect(() => {
       document.title = user.name + ' ' +user.lastName + ' | Home' 
    }, [user.lastName, user.name])

    useEffect(() => {
       dispatch(getAllFriends(user.id))
    }, [])

    return (
        <div>
            <NavBar  profile_img={user.profile_photo}/>
            <UserTop />
            <div className={styles.details_container}>
                <div className={styles.colum}>
                    <div className={styles.details}>
                        <h2>{ translate('details') }</h2>
                        <Details openEdit={openEdit} user={user} cancel={() => setOpenEdit(false)}/>
                        {
                            openEdit
                            ? <button onClick={() => setOpenEdit(prev => !prev)} className={styles.button_details}>{  translate('cancel') }</button>
                            : <button onClick={() => setOpenEdit(prev => !prev)} className={styles.button_details}>{ translate('edit-details') }</button>
                        }
                    </div>
                    <div className={styles.friends_container}>
                        <div>
                            <h2>{ translate('friends') }</h2>
                                {
                                   user ? user.friends.length : <Skeleton />
                                }
                        </div>
                        <div className={user.friends.length >= 1 ? styles.friends_list : null}>
                            {
                                 isLoadingFriends
                                 ? <span>Loading friends...</span>
                                 : hasErrorFriends
                                    ? <span>Was an error</span>
                                    : friends.map(
                                        friend => <div>
                                            <Link to={`/account/profile/${friend._id}`}>
                                            <div className={styles.friend_card}>

                                                <img 
                                                    alt='friend_photo' 
                                                    className={styles.friend_img} 
                                                    src={'http://localhost:3001'+friend.profile_photo} 
                                                />
                                            </div>
                                        </Link>
                                        <h6>{friend.name} {friend.lastName}</h6>
                                    </div>
                                 
                                 )
                                 

                            }
                        </div>
                    </div>
                </div>
        
                <div className={styles.posts_container}>
                <CreatePost />
                {
                    isLoading
                        ? <SkeletonPost />
                        : hasError
                            ? <h2>Was an error in server</h2>
                            : posts.length >= 1
                                ? posts.map(post => {
                                    return <Post 
                                    key={post._id}
                                    profile_photo={post.user.profile_photo}
                                    userid={post.user._id}
                                    id={post._id}
                                    lastName={post.user.lastName}
                                    name={post.user.name}
                                    time={post.createdAt}
                                    text={post.text}
                                    comments={post.comments}
                                    likes={post.likes} 
                                    im={post.file ? post.file : null } />
                                })
                                : <h2>Not posts to show</h2>     
                }
                </div>
            </div>
        </div>
    )
}


const UserTop = props => {

    
//     PUT http://localhost:3001/api/users/608e5a5dc68ff8234cd15fb1 HTTP/1.1
// Content-Type: application/json

// {
//     "profile_photo": "/uploads/1619805550792.jfif"
// }

    const user = useSelector(selectUser)
    const { isLoadingUpdated } = useSelector(state => state.user)
    const [ form, file, onInputChange, setFile ] = useUpload('profile_photo')
    const [ changeDescription, setChangeDescription ] = useState(false)
    const dispatch = useDispatch()

    const cancel = () => void setChangeDescription(false)

    useEffect(() => {
        if(file) {
            axios.put(`http://localhost:3001/api/users/608e5a5dc68ff8234cd15fb1`, form, { headers: { Authorization: `Bearer ${user.token}` } })
                .then(
                    ({ data }) => {
                        const updatedUser = {...JSON.parse(localStorage.getItem('user')), profile_photo: data}
                        localStorage.setItem('user', JSON.stringify(updatedUser))
                        dispatch(updatedUserPhoto(data))
                    }
                )
        }
    }, [file, form])
        
    

    return (
        <div className={styles.first}>
        <div className={styles.middle}>
            <input  type='file' id='cover'/>
            <label htmlFor='cover' className={styles.cover}>
                {
                    user.cover_photo
                        ? <img src={'http://localhost:3001'+user.cover_photo} alt='cover_photo' />
                        : <Skeleton width='100%' height='100%' />
                }
            </label>
            <div className={styles.container_info}>
                <div className={styles.name_desc_container}>
                    <div className={styles.name_desc}>
                    <input  type='file' id='profile_photo' onChange={onInputChange}/>
                    <label htmlFor='profile_photo' className={styles.photo}>
                        {
                            user.profile_photo
                                ? <img 
                                    style={{  width: '10rem', height: '10rem', border: '3px solid white', borderRadius: '50%' }}
                                    src={'http://localhost:3001'+user.profile_photo}
                                    alt='profile'
                                />
                                : <Skeleton width='100%' height='100%' circle={true} />             
                        }
                    </label>
                        <h2 className={styles.name}>
                            {
                                user.name
                                    ? user.name + ' ' + user.lastName
                                    : <Skeleton width={170} />
                            }
                            
                        </h2>
                        <div className={styles.desc}>
                            {
                                isLoadingUpdated 
                                ? <Skeleton width={170} />
                                : user.description 
                                    ? (
                                        <div className={styles.desc}>
                                            { changeDescription ? null : <span style={{ textAlign: 'center' }}>{user.description}</span> }
                                            {
                                                changeDescription 
                                                ? <ChangeDescription cancel={cancel} />
                                                : <button onClick={() => setChangeDescription(true)}>{ translate('add-description') }</button>
            
                                            }
                                        </div>
                                    )
                                    : changeDescription
                                        ? <ChangeDescription cancel={cancel} />
                                        : <button onClick={() => setChangeDescription(true)}>{ translate('add-description') }</button>
                            }
                        </div>
                        
                    </div>
                </div>
                <div className={styles.options_information}>
                    
                    <div className={styles.options_first}>
                        <Link to={`/account/profile/${user.id}`}>{ translate('post') }</Link>
                        <Link to={`/account/profile/${user.id}/information`}>{translate('information')}</Link>
                        <Link to={`/account/profile/${user.id}/friends`}>{translate('friends')}</Link>
                        <Link to={`/account/profile/${user.id}/photos`}>{translate('photos')}</Link>
                    </div>
                    <div className={styles.options_second}>
                        <button>{translate('search')}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export const UserInformation = () => {
    return (
        <>
        <NavBar />
        <UserTop />
        info here : )
        </>
    )
}

export const UserFriends = () => {
    return (
        <>
            <NavBar />
            <UserTop />
            friends informaiton here
        </>
    )
}

export const UserPhotos = () => {
    return (
        <>
            <NavBar />
            <UserTop />
            photos here
        </>
    )
}

const Details = props => {

    const { openEdit,  user, cancel } = props
    
    const [ studiedAt, setStudiedAt  ] = useState('')
    const [ liveIn, setLiveIn ] = useState('')
    const [ from, setFrom ] = useState('')
    const dispatch = useDispatch()

    const handleStudiedAtInput =  ({ target }) => void setStudiedAt(target.value)
    const handleliveInInput =  ({ target }) => void setLiveIn(target.value)
    const handlefromInput =  ({ target }) => void setFrom(target.value)
    const changeInformation = () => {
        if(studiedAt || liveIn || from) {
            setFrom('')
            setStudiedAt('')
            setLiveIn('')
            cancel()
            const data = {}
            if(studiedAt) {
                data.studiedAt = studiedAt 
            }
            if(liveIn) {
                data.liveIn = liveIn 
            }
            if(from) {
                data.from = from
            }
            if(!Object.keys(data).length < 1) {
                dispatch(changeInfo({userId: user.id, info: data, token: user.token}))
            }
        }
       
    }

    if(!openEdit) {
        return (
            <div>
                {
                    user.studiedAt
                    ? (
                        <div className={styles.detail}>
                            <svg xmlns="http://www.w3.org/2000/svg" width='1.2rem' color='grey' viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                            <p>{ translate('studied-at') } <strong>{user.studiedAt}</strong></p>
                        </div>
                    )
                    : null
                }
                {
                    user.liveIn
                    ? (
                        <div className={styles.detail}>
                            <svg xmlns="http://www.w3.org/2000/svg" width='1.2rem' color='grey' viewBox="0 0 20 20" fill="currentColor">
                                 <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <p>{ translate('lives-in') } <strong>{user.liveIn}</strong></p>
                        </div>
                    )
                    : null
                }
                {
                     user.from
                     ? (
                         <div className={styles.detail}>
                            <svg xmlns="http://www.w3.org/2000/svg" width='1.2rem' color='grey' viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                             <p>{ translate('from') } <strong>{user.from}</strong></p>
                         </div>
                     )
                     : null
                }
                <div className={styles.detail}>
                    <svg xmlns="http://www.w3.org/2000/svg" width='1.2rem' color='grey' viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <p>{ translate('joined') } <strong>{ moment(user.createdAt).calendar() }</strong></p>
                </div>
            </div>
        )
    }


    return (
        <>
        <div className={styles.detail}>
            <svg xmlns="http://www.w3.org/2000/svg" width='1.2rem' color='grey' viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            <p>{ translate('studied-at') } <input value={studiedAt} onChange={handleStudiedAtInput} name='studiedAt' className={styles.btn} placeholder='e.g. Harvard University' /></p>
        </div>

        <div className={styles.detail}>
            <svg xmlns="http://www.w3.org/2000/svg" width='1.2rem' color='grey' viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <p>{ translate('lives-in') }  <input value={liveIn} onChange={handleliveInInput} name='liveIn' className={styles.btn} placeholder='e.g. norway' /></p>
        </div>

        <div className={styles.detail}>
            <svg xmlns="http://www.w3.org/2000/svg" width='1.2rem' color='grey' viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <p>{ translate('from') } <input value={from} onChange={handlefromInput} name='from' className={styles.btn} placeholder='e.g. Canadá' /></p>
        </div>
        <div className={styles.detail}>
            <svg xmlns="http://www.w3.org/2000/svg" width='1.2rem' color='grey' viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <p>{ translate('joined') } <strong>{ moment(user.createdAt).calendar() }</strong></p>
        </div>
        <button onClick={changeInformation} className={styles.btnChange}>{ translate('change-information') }</button>
    </>
    )
}

const ChangeDescription = (props) => {

    const { cancel } = props

    const [ description, setDescription ] = useState('')
    const user = useSelector(selectUser)
    const dispatch = useDispatch()

    const changeDescription = event => {
        event.preventDefault()
        if(description) {
            dispatch(changeDesc({userId: user.id, description, token: user.token}))
            cancel()
        }
    }

    return (
        <>
        <form onSubmit={changeDescription}>
            <input 
                value={description} 
                onChange={({ target }) => setDescription(target.value)} 
                className={styles.changeDescription} 
                placeholder='sort description about you' 
            />
        </form>
       
        <div style={{ display: 'flex' }}>
            <button onClick={cancel}>{ translate('cancel') }</button>
            <button onClick={changeDescription} >{ translate('updated') }</button>
        </div>
        </>
    )
}

export default UserProfile
