import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { selectUser, userLogin } from '../../features/userSlice'
import socketContext from '../../components/useSocketContext'
import styles from './Login.module.css'
import translate from '../../i18n/translate'

const Login = () => {

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const dispatch = useDispatch()
    const history = useHistory()
    const { socket } = useContext(socketContext)
    const user = useSelector(selectUser)

    useEffect(() => {
        document.title = 'Log In'
    }, [])

    useEffect(() => {
        if(user) {
            localStorage.setItem('token', user.token)
            localStorage.setItem('user', JSON.stringify(user))
            history.push('/home')
            socket.emit('updateUserId', user.id)
        }
    }, [user, history, socket])

    const handleUser = event => {
        event.preventDefault()
        dispatch(userLogin({ email, password }))
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{ translate('login-title') }</h1>
            <div className={styles.inputs_container}>
                <input 
                    className={styles.input} 
                    placeholder="email" 
                    type='email' 
                    onChange={({ target }) => setEmail(target.value)}
                />
                <input 
                    className={styles.input} 
                    placeholder="password" 
                    type='password'
                    onChange={({ target }) => setPassword(target.value)}
                />
                <button onClick={handleUser} className={styles.log_button}>{translate('login-title') }</button>
                <h3>or</h3>  
                <Link className={styles.register_button} to='/register'>{ translate('register-title')  }</Link>
            </div>
        </div>
    )
}

export default Login
