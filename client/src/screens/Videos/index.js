import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadVideosPost, selectVideosPostsState } from '../../features/videosSlice'
import NavBar from '../../components/NavBar'
import CreatePost from '../../components/CreatePost'
import Post from '../../components/Post'
import SkeletonPost from '../../components/SkeletonPost'
import styles from './Videos.module.css'
import { selectUser } from '../../features/userSlice'

const Videos = () => {

    const dispatch = useDispatch()
    const { isLoading, hasError, posts } = useSelector(selectVideosPostsState)
    const user = useSelector(selectUser)

    useEffect(() => {
        // if(posts.length === 0){
            dispatch(loadVideosPost(user.token))
        // }
    }, [dispatch])

    return (
        <>
            <NavBar />
            <div className={styles.container}>
                
                <CreatePost />
                {
                    isLoading
                    ? [1, 2].map( key => <SkeletonPost key={key} />)
                    : hasError 
                        ? <h1>Was an error in server while trying to load videos post</h1>
                        : posts.length >= 1
                            ? posts.map(
                                post => <Post 
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
                                    im={post.file ? post.file : null }
                                />
                            )
                            : <h4>not videos yet</h4>
                }
            </div>
        </>
    )

}

export default Videos