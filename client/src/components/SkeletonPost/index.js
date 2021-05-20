import Skeleton from 'react-loading-skeleton'
import styles from './SkeletonPost.module.css'

const SkeletonPost = () => {
    return (
        <div className={styles.container}>
            <div className={styles.metadata_container}>
                <div className={styles.metadata}>
                    <div className={styles.circle}>
                        <Skeleton circle={true} width={45} height={45}/>
                    </div>
                    <div className={styles.name_hour}>
                        <Skeleton width={150} />
                        <Skeleton width={75} />
                    </div>
                </div>
                <div>
                    <Skeleton width={100} />
                </div>
            </div>      
        </div>     
    )
}

export default SkeletonPost