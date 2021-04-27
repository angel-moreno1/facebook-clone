import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import styles from './SkeletonPost.module.css'

const SkeletonPost = () => {
    return (
        <SkeletonTheme color="#f3f3f3" highlightColor="rgb(206, 206, 206)">
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
        </SkeletonTheme>
       
    )
}

export default SkeletonPost