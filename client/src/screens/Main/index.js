import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import styles from './Main.module.css' 
import translate from '../../i18n/translate'
import { useIntl } from 'react-intl'

const Main = () => {

    const [ name, setName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ repeatPw, setRepeatPw ] = useState('')
    const [ error, setError ] = useState('')
    const intl = useIntl()

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
          <h3 className={styles.description}>{ translate('welcome') }</h3>
        </div>
        <div className={styles.secondpart}>
            {
                error && <p className={styles.error}>{error}</p>
            }
            
          <form 
            onSubmit={handleSubmit}
            className={(error ? 'down' : error !== null ? 'up' : null ) + ' ' + styles.registration_card }       
            >
            <h2 className={styles.registration_text}>{ translate('register-title') }</h2>
            <input 
                onChange={({ target }) => void setName(target.value)}
                name="name" className={styles.input}
                placeholder={intl.formatMessage({ id: 'name-placeholder' })}
            />
            <input 
                onChange={({ target }) => void setLastName(target.value)}
                className={styles.input}  
                placeholder={intl.formatMessage({ id: 'last-name-placeholder' })}
            />
            <input 
                onChange={({ target }) => void setEmail(target.value)}
                className={styles.input}  
                type="email"
                placeholder={intl.formatMessage({ id: 'email-placeholder' })}
            />
            <input 
                onChange={({ target }) => void setPassword(target.value)}
                className={styles.input}  
                placeholder={intl.formatMessage({ id: 'password-placeholder' })}
                type="password"
            />
            <input 
                onChange={({ target }) => void setRepeatPw(target.value)}
                className={styles.input}  
                type="password"
                placeholder={intl.formatMessage({ id: 'repeat-password-placeholder' })}
            />
  
            <button className={styles.register_button} onClick={handleSubmit}>{ translate('register-title') }</button>
             <h5 className={styles.or}>{ translate('or') }</h5>
          <Link 
            className={styles.login_button} 
            to='/login'
          >{
              translate('login-title')
          }
          </Link>
          </form>
         
        </div>
      </div>
    )

}

export default Main
