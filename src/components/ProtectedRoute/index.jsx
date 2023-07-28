import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotPermitted from "./NotPermitted";


const PermitBasedOnRole = (props) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const user = useSelector(state => state.authentication.user)
    const userRole = user.role;
    if (isAdminRoute && userRole === 'ADMIN') {
        return (<> {props.children} </>)
    } else {
        return (<> <NotPermitted /> </>)
    }
}

const ProtectedRoute = (props) => {
    const isAuthenticated = useSelector(state => state.authentication.isAuthenticated)

    return (
        <>
            {isAuthenticated === true ?
                <>
                    <PermitBasedOnRole>
                        {props.children}
                    </PermitBasedOnRole>
                </>
                :
                <Navigate to="/login" replace />
            }

        </>
    )
}

export default ProtectedRoute;