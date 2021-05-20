import Skeleton from 'react-loading-skeleton'
import styles from './FriendInformation.module.css'

const FriendInformation = props => {

    const { friend } = props

    return (
        <>
          <div>
                <div className={styles.photo_right}>
                    { 
                        friend 
                        ? <img width='100%' height='100%' src={'http://localhost:3001'+friend.profile_photo} alt='user_profile' /> 
                        : <Skeleton width='100%' height='100%' circle={true} /> 
                    }
                </div>
                <h2>
                    { 
                        friend 
                        ? friend.name + ' ' + friend.lastName 
                        : <Skeleton width={150} /> 
                    }
                </h2>
            </div>
            <div></div>
        </>
    )
}

export default FriendInformation