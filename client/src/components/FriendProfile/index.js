import { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton'
import { selectUser } from '../../features/userSlice';
import Post from '../Post'
import NavBar from '../NavBar'
import styles from './FriendProfile.module.css'
import { loadCurrentChat, setCurrentConversationId } from '../../features/chatSlice';
import { addAsAFriend, LoadFriendInformation, LoadFriendPosts } from '../../features/friendSlice';
import axios from 'axios';
import { clearState, createOrRedirectToChat } from '../../features/sendMessageSlice';
import moment from 'moment';
import { getAllFriends, selectHomeState, clearFriends } from '../../features/homeSlice';

const FriendProfile = props => {

    const { match: { params } } = props

    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const { friendInformation, posts } = useSelector(state => state.friend)
    const { createdChat, isLoading, hasError } = useSelector(state => state.messages)
    const history = useHistory()
    const { friends, isLoadingFriends, hasErrorFriends } = useSelector(selectHomeState)

    const handleAddFriend = () => {
        axios.put('http://localhost:3001/api/users/friend/add', {friendId: friendInformation._id}, { headers: { Authorization: `Bearer ${user.token}` } })
            .then((r) => {
                dispatch(addAsAFriend(user.id))
            })
            .catch(() => console.log('was an error'))
    }

    const handleSendMessageRedirect = () => {
        dispatch(createOrRedirectToChat({ friendId: friendInformation._id, token: user.token }))
    }

    useEffect(() => {
        if(Object.keys(createdChat).length > 1) {
            dispatch(loadCurrentChat({id: createdChat._id, token: user.token}))
            dispatch(setCurrentConversationId(createdChat._id))
            history.push('/account/chats')
        }
        return () => dispatch(clearState())
    }, [createdChat])

    useEffect(() => {
        dispatch(LoadFriendInformation({friendId: props.match.params.id, token: user.token}))
        dispatch(LoadFriendPosts({friendId: props.match.params.id, token: user.token}))
     }, [params.id])

    useEffect(() => {
       document.title = friendInformation.name + ' ' + friendInformation.lastName + ' | Home' 
    }, [friendInformation.lastName, friendInformation.name])

    useEffect(() => {
        dispatch(getAllFriends(friendInformation._id))

        return () => dispatch(clearFriends())
     }, [friendInformation])
 
    return (
        <div>
            <NavBar />
            <div className={styles.first}>
                <div className={styles.middle}>
                    <input  type='file' id='cover'/>
                    <label htmlFor='cover' className={styles.cover}>
                        {
                            friendInformation.cover_photo
                            ? <img src={'http://localhost:3001'+friendInformation.cover_photo} alt='cover_photo' />
                            : <Skeleton width='100%' height='100%' />
                        }
                    </label>
                    <div className={styles.container_info}>
                        <div className={styles.name_desc_container}>
                            <div className={styles.name_desc}>
                            <div className={styles.photo}>
                                {
                                    friendInformation.profile_photo
                                    ? <img 
                                        style={{  width: '10rem', height: '10rem', border: '3px solid white', borderRadius: '50%' }}
                                        src={'http://localhost:3001'+friendInformation.profile_photo}
                                         alt='profile'
                                        />
                                    : <Skeleton width='100%' height='100%' circle={true} />             
                                }
                            </div>
                                <h2 className={styles.name}>
                                    {
                                        friendInformation.name   
                                        ? friendInformation.name +' '+ friendInformation.lastName
                                        : <Skeleton  width={170}/>
                                    }
                                </h2>
                                
                               {  
                                friendInformation.description 
                                ?  friendInformation.description 
                                : null  
                               }
                            </div>
                        </div>
                        <div className={styles.options_information}>
                            
                            <div className={styles.options_first}>
                                {
                                    friendInformation._id 
                                    ? (
                                        <>
                                            <Link to={`/account/profile/${friendInformation._id}`}>Post</Link>
                                            <Link to={`/account/profile/${friendInformation._id}/information`}>Information</Link>
                                            <Link to={`/account/profile/${friendInformation._id}/friends`}>Friends</Link>
                                            <Link to={`/account/profile/${friendInformation._id}/photos`}>Photos</Link>
                                        </>
                                    )
                                    : null
                                }
                                
                            </div>
                            <div className={styles.options_second}>
                                {   
                                    Object.keys(friendInformation).find(field => field === 'friends')
                                    ?
                                    friendInformation.friends.find(friend => friend === user.id)
                                        ? <button 
                                            style={{ backgroundColor: 'rgb(17, 133, 241)', color: 'white' }} 
                                            onClick={handleSendMessageRedirect}>
                                            {
                                                isLoading
                                                ? 'Loading chat...'
                                                : hasError
                                                    ? 'Was an error :('
                                                    : 'send message'
                                            }
                                        </button>
                                        : <button onClick={handleAddFriend}>add as a friend</button>
                                    : null
                                }
                                <button>searchs</button>
                                <button>report</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.details_container}>
                <div className={styles.colum}>
                    <div className={styles.details}>
                        <h3>Details</h3>        
                        <div>
                            {
                                friendInformation.studiedAt
                                ? (
                                    <div className={styles.detail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width='1.2rem' color='grey' viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                        </svg>
                                        <p>Studied At <strong>{friendInformation.studiedAt}</strong></p>
                                    </div>
                                )
                                : null
                            }
                            {
                                friendInformation.liveIn
                                ? (
                                    <div className={styles.detail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width='1.2rem' color='grey' viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
                                        <p>lives in <strong>{friendInformation.liveIn}</strong></p>
                                    </div>
                                )
                                : null
                            }
                            {
                                friendInformation.from
                                ? (
                                    <div className={styles.detail}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width='1.2rem' color='grey' viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <p>from <strong>{friendInformation.from}</strong></p>
                                    </div>
                                )
                                : null
                            }
                            <div className={styles.detail}>
                                <svg xmlns="http://www.w3.org/2000/svg" width='1.2rem' color='grey' viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <p>joined <strong>{ moment(friendInformation.createdAt).calendar() }</strong></p>
                            </div>
                        </div>

                    </div>
                    <div className={styles.friends_container}>
                        <div>
                            <h2>Friends</h2>
                                {
                                   friends ? friends.length >= 1 ? friends.length : 0  : <Skeleton />
                                }
                        </div>
                        <div className={friends.length >= 1 ? styles.friends_list : null}>
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
                {
                      Object.keys(friendInformation).find(field => field === 'friends')
                        ? friendInformation.friends.find(friend => friend === user.id)
                            ? <h1>Should be a create post for a friend</h1>
                            : null
                        : null
                }
                {
                    
                    posts.length < 1  
                        ? <h5>Not post to show</h5>
                        : posts.map(post => <Post 
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
                        )
                }
                </div>
            </div>
        </div>
    )
}

export default FriendProfile
