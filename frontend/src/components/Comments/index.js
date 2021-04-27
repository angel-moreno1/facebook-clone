import { useEffect, useState } from "react"
import axios from "axios"
import Comment from "../Comment"
import styles from './Comments.module.css'

const Comments = (props) => {

    const { id, shouldLoadComments } = props

    const [ comments, setComments ] = useState([])
    const [ loading, setLoading ] = useState(false)
    
    useEffect(() => {
        if(shouldLoadComments) {        
            setLoading(true)
            axios.get(`http://localhost:3001/api/post/${id}`)
                .then(({ data }) => {
                    setComments(data.comments)
                    setLoading(false)
                })
        }
        
    }, [id, shouldLoadComments])


    const makeComment = event => {
        event.preventDefault()
        console.log('should make a comment')
    }

    return (
        <div className={styles.commentContainer}>
            {
                loading
                    ? <h1>Loading</h1>
                    : comments.map(comment => <Comment time={comment.createdAt} key={comment._id} text={comment.text} name={comment.user.name} />) 
            }

            <div className={styles.makeCommment}>
                <svg color='grey' width='3rem' xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
                <form onSubmit={makeComment}> 
                    <input placeholder='write a comment' />
                </form>
            </div>
        </div>
    )
}

export default Comments