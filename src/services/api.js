
import axios from "../utilizes/axiosCustomize";

// =============== USER / AUTHENTICATE =================

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


// ============= ADMIN/USER ================

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

// ============= ADMIN/BOOK ================

const handleGetBookWithPaginate = (query) => {
    return axios.get(`/api/v1/book?${query}`);
}

const handleGetBookCategory = () => {
    return axios.get(`/api/v1/database/category`);
}

const handleUploadBookImg = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book"
        },
    });
}

const handleCreateBook = (data) => {
    return axios.post(`/api/v1/book`, data);
}

const handleUpdateBook = (data, id) => {
    return axios.put(`/api/v1/book/${id}`, data);
}

const handleDeleteBook = (_id) => {
    return axios.delete(`/api/v1/book/${_id}`);
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

    handleGetBookWithPaginate,
    handleGetBookCategory,
    handleUploadBookImg,
    handleCreateBook,
    handleUpdateBook,
    handleDeleteBook,
}