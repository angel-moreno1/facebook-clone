import { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import { loadInitialPost, addPost, selectPost} from '../../features/postSlice'
import Post from '../../components/Post'
import NavBar from '../../components/NavBar'
import CreatePost from '../../components/CreatePost'
import SkeletonPost from '../../components/SkeletonPost'
import socketContext from '../../components/useSocketContext'
import styles from './Home.module.css'

const Home = () => {

    const user =  useSelector(selectUser)
    const { isLoading, hasError, posts } = useSelector(selectPost)
    const dispatch = useDispatch()

    const { socket } = useContext(socketContext)

    useEffect(() => {
        document.title = 'Home'

        if(posts.length === 0){
            dispatch(loadInitialPost())
        }
    }, [posts.length, dispatch])

    useEffect(() => {
        if(Object.keys(socket).length > 1) {
            socket.on('newPost', post => {
                dispatch(addPost(post))
            })
        }
    }, [socket])

    
    return (
        <div className={styles.container}>
        <NavBar  profile_img={user.profile_photo}/>
        <div className={styles.container_main}>
            <div className={styles.left_container}></div>
            <aside className={styles.left}>
                {
                    [user.name, 'Covid Information', 'Friends', 'groups'].map((sec, i) => {
                        return (
                            <button key={i}>{sec}</button>
                        )
                    })
                }
            </aside>
            <main className={styles.middle}>
                <CreatePost/>
                {
                     isLoading
                     ? [1, 2].map((key) => <SkeletonPost key={key} />)
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
                             : <h2 style={{ textAlign: 'center' }}>Not posts yet</h2>
                }
            </main>
            <aside className={styles.right}>
                 <h3>Contacts</h3>
                 <div>
                     reactions
                     <svg xmlns="http://www.w3.org/2000/svg" width='0.9rem' style={{ color: 'rgb(47, 137, 255)' }} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width='0.9rem' style={{ color: 'rgb(255, 206, 47)' }}  viewBox="0 0 20 20" fill="currentColor">
                        <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width='0.9rem' style={{ color: 'rgb(255, 47, 47)' }} className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width='0.9rem' style={{ color: 'rgb(255, 141, 47)' }} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width='0.9rem' style={{ color: 'rgb(47, 255, 75)' }}  viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                    </svg>
                 </div>
            </aside>
        </div>
        </div>
    )
}

export default Home
