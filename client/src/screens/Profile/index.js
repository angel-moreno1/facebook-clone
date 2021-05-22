import { useSelector } from "react-redux";
import { selectUser } from '../../features/userSlice'
import UserProfile from '../../components/UserProfile'
import FriendProfile from "../../components/FriendProfile";
import { useEffect } from "react";


const Profile = (props) => {
    
    const { match }  = props 
    const { id } = match.params
    const user = useSelector(selectUser)
    
    const isUserProfile = id === void 0 || id === user.id 

    useEffect(() => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }, [])
 
    return (
        isUserProfile
            ? <UserProfile {...props}/>
            : <FriendProfile {...props}/> 
    )
}

export default Profile
