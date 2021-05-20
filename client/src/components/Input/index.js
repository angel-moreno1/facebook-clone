import { useState } from "react"
import Picker from 'emoji-picker-react';
import styles from './Input.module.css'
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { useIntl } from "react-intl";

const Input = props => {

    const { action, respondToName } = props
    const [openPicker, setOpenPicker] = useState(false);
    const [ message, setMessage ] = useState('')
    const { profile_photo } = useSelector(selectUser)
    const intl = useIntl()

    const onEmojiClick = (event, emojiObject) => {
        setMessage(message + emojiObject.emoji);
    };

    const handleMessageInput = ({ target }) => {
        setMessage(target.value)
    }
    
    const onSubmit = event => {
        event.preventDefault()
        action(setMessage, message)
    }

    return(
        <div className={styles.container}>
            <img className={styles.image} src={'http://localhost:3001'+profile_photo} alt='user_profile' />
            <form className={styles.form} onSubmit={onSubmit}>
                {
                    respondToName
                    ? <div className={styles.respond}>
                        <span className={styles.respond_name}>@{respondToName.split(' ')[0]}</span>
                        <input className={styles.input_respond} value={message}  onChange={handleMessageInput}   placeholder={intl.formatMessage({ id: 'write-comment' })}  />
                        {/* 
                        <input 
                        className={styles.input} 
                        value={message}  
                        onChange={handleMessageInput} 
                        placeholder={intl.formatMessage({ id: 'write-comment' })} 
                        /> */}
                     </div>
                    :  <input 
                        className={styles.input} 
                        value={message}  
                        onChange={handleMessageInput} 
                        placeholder={intl.formatMessage({ id: 'write-comment' })} 
                    />
                }
               
               
            </form>
            <div className={styles.picker} >
                {openPicker ? <Picker onEmojiClick={onEmojiClick} /> : null}
            </div>
            <svg className={styles.emoji}  onClick={() => setOpenPicker(prev => !prev)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
            </svg>
            <button onClick={() => action(setMessage, message)} className={styles.send}>enviar</button>
        </div>
    )
}


export default Input