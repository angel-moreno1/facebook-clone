import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import axios from "axios"
import { selectUser } from '../../features/userSlice'
import Comment, { CommentSkeleton } from "../Comment"
import styles from './Comments.module.css'
import Input from '../Input'

const Comments = props => {

    const { id, shouldLoadComments } = props
    const [ comments, setComments ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const user = useSelector(selectUser)

    useEffect(() => {
        if(shouldLoadComments) {        
            setLoading(true)
            axios.get(`http://localhost:3001/api/post/${id}`, { headers: { Authorization: `Bearer ${user.token}` } })
                .then(({ data }) => {
                    setComments(data.comments)
                    setLoading(false)
                })
        }
        
    }, [id, shouldLoadComments])

    const makeComment = (setText, text) => {
        setText('')
        axios.put(`http://localhost:3001/api/post/${id}/comment`, { text }, { headers: { Authorization: `Bearer ${user.token}` } })
            .then(
                ({ data }) => setComments(prev => [...prev, data])
            )
    }

    return (

        <div className={styles.commentContainer}>
            <div className={styles.comments}>
                {
                    loading
                    ? [1].map(key => <CommentSkeleton key={key} />)
                    : comments.map(
                        comment => <Comment 
                            key={comment._id} 
                            {...comment}
                        />) 
                }   
            </div>
            <Input action={makeComment}  />
        </div>
    )
}

export default Comments