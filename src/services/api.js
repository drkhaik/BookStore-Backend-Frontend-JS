
import axios from "../utilizes/axiosCustomize";

const handleRegister = (fullName, email, password, phone) => {
    return axios.post("/api/v1/user/register", { fullName, email, password, phone })
}

const handleLogin = (username, password) => {
    return axios.post("/api/v1/auth/login", { username, password, delay: 2000 })
}

const fetchAccount = () => {
    return axios.get("/api/v1/auth/account")
}

const handleLogout = () => {
    return axios.post("/api/v1/auth/logout")
}


export {
    handleRegister,
    handleLogin,
    fetchAccount,
    handleLogout,
}