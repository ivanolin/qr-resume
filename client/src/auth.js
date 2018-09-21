export const setToken = (token) => {
    return localStorage.setItem('qresume',token);
}

export const getToken = () => {
    return localStorage.getItem('qresume');
}