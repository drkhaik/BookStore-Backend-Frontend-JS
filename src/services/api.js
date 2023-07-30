
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

const handleGetUserWithPaginate = (query) => {
    return axios.get(`/api/v1/user?${query}`);
}

const handleCreateNewUser = (fullName, email, password, phone) => {
    return axios.post(`/api/v1/user`, { fullName, email, password, phone });
}

const handleBulkCreateUser = (data) => {
    return axios.post(`api/v1/user/bulk-create`, data);
}

const handleUpdateUser = (_id, fullName, phone) => {
    return axios.put(`/api/v1/user`, { _id, fullName, phone });
}

const handleDeleteUser = (_id) => {
    return axios.delete(`/api/v1/user/${_id}`);
}



export {
    handleRegister,
    handleLogin,
    fetchAccount,
    handleLogout,
    handleGetUserWithPaginate,
    handleCreateNewUser,
    handleBulkCreateUser,
    handleUpdateUser,
    handleDeleteUser,
}