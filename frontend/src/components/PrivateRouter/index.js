import { Redirect, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'

const PrivateRoute = ({ component: Component, ...rest }) => {

    const user = useSelector(selectUser)
  
    return <Route {...rest} 
    render={
        (props) => user 
            ? <Component {...props}/>
            : <Redirect to='/register' />
    } />;
};

export default PrivateRoute