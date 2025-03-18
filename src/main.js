import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createClient } from '@supabase/supabase-js';
import App from './App.vue';
import router from './router/index.js';
import './style.css';

const supabaseUrl = 'https://bjxfdzanibahlxsvkrzs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqeGZkemFuaWJhaGx4c3ZrcnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5ODg3NjEsImV4cCI6MjA0NzU2NDc2MX0.UlcvJuqmh7NHyPwMeZGUxWDUyeGd3rQBYj-mAZuMK6c';
export const supabase = createClient(supabaseUrl, supabaseKey);

createApp(App).use(router).mount('#app');
