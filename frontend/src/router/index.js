// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Register from "../pages/Register.vue"
import Login from "../pages/Login.vue"
import Upload from "../pages/UploadPdf.vue"
import Dashboard from "../components/Dashboard.vue";
import Flashcards from "../pages/Flashcards.vue";
import Quiz from "../pages/Quiz.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/uploadpdf',
        name: 'Upload',
        component: Upload
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/flashcards',
        name: 'Flashcards',
        component: Flashcards
    },
    {
        path: '/quiz',
        name: 'Quiz',
        component: Quiz
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
