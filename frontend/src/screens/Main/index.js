import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import styles from './Main.module.css' 

const Main = () => {

    const [ name, setName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ repeatPw, setRepeatPw ] = useState('')
    const [ error, setError ] = useState('')

    const history = useHistory()

    useEffect(() => {
        document.title = 'Sign Up'
    }, [])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setError('')
        }, 3000)

        return () => clearTimeout(timeout)
    }, [error])

    const handleSubmit = async event => {
        event.preventDefault()
        if(name && lastName && email && password && repeatPw){
            if(password.trim() === repeatPw.trim()){
                try {
                    await axios.post('http://localhost:3001/api/users/register', {name, lastName, email, password})
                    history.push('/email-verification')
                } catch (error) {
                    setError('that email already exists')
                }      
            }else {
                setError('the password is not the same')
            }    
        }else {
            setError('you need to fill in all the fields')
        }  
    }

    return (
        <div className={styles.container}>
        <div className={styles.firstpart}>
          <h1 className={styles.title}>Social Media</h1>
          <h3 className={styles.description}>Connect with friends and the world around you on Social Media.</h3>
        </div>
        <div className={styles.secondpart}>
            {
                error && <p className={styles.error}>{error}</p>
            }
            
          <form 
            onSubmit={handleSubmit}
            className={(error ? 'down' : error !== null ? 'up' : null ) + ' ' + styles.registration_card }       
            >
            <h2 className={styles.registration_text}>Register</h2>
            <input 
                onChange={({ target }) => void setName(target.value)}
                name="name" className={styles.input}
                placeholder="Name" 
            />
            <input 
                onChange={({ target }) => void setLastName(target.value)}
                className={styles.input}  
                placeholder="Last Name" 
            />
            <input 
                onChange={({ target }) => void setEmail(target.value)}
                className={styles.input}  
                type="email"
                placeholder="Email"
            />
            <input 
                onChange={({ target }) => void setPassword(target.value)}
                className={styles.input}  
                placeholder="password"
                type="password"
            />
            <input 
                onChange={({ target }) => void setRepeatPw(target.value)}
                className={styles.input}  
                type="password"
                placeholder="repeat password"
            />
  
            <input className={styles.register_button} type="submit" value="resgister" />
             <h5 className={styles.or}>Or</h5>
          <Link 
            className={styles.login_button} 
            to='/login'
          >Login
          </Link>
          </form>
         
        </div>
      </div>
    )

}

export default Main
