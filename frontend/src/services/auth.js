import axios from "axios";

const BASE_URL = "http://localhost:5000"; // prilagodi backend URL

// USER AUTH
export const registerUser = async (data) => {
    console.log("Pozvana registerUser funkcija");
    try {
        const res = await axios.post(`${BASE_URL}/users/register`, data);
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Greška pri registraciji' };
    }
};

export async function loginUser(username, password) {
    return axios.post(`${BASE_URL}/users/login`, { username, password });
}

// ADMIN AUTH
export async function loginAdmin(username, password) {
    return axios.post(`${BASE_URL}/admin/login`, { username, password });
}

// GUEST AUTH
export async function loginGuest() {
    return axios.post(`${BASE_URL}/guest/login`);
}
