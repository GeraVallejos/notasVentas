
import {useSelector} from "react-redux"
import HomePage from "../pages/HomePage"

const GroupsRouter = ({children, group}) => {

    const grupo = useSelector(state => state.auth.user?.groups || [] )

    const acceso = grupo.some((g) => g.includes(group))   

    return acceso ? children : <HomePage />;

}

export default GroupsRouter