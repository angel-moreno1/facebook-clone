import { useEffect, useState } from 'react'
import Confetti from 'react-dom-confetti'
import { Link } from 'react-router-dom'
import styles from './Verification.module.css'

const config = {
    angle: "98",
    spread: 360,
    startVelocity: 40,
    elementCount: "88",
    dragFriction: "0.05",
    duration: 3000,
    stagger: "7",
    width: "14px",
    height: "21px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

export default function Verification() {
    const [ confetti, setConfetti ] = useState(false)

    useEffect(() => {
        setConfetti(true)
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.outer}>
                <h2 className={styles.title}>we just send a link to verify your account to your email.</h2>
                <h4 className={styles.subtitle}>please check your email</h4>
                <div className={styles.confetti} >
                  <Confetti active={confetti} config={config} />  
                </div>
                <Link to='/login'> Go to login </Link>
            </div>
        </div>
    )
}
