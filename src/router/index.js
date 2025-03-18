import { createRouter, createWebHistory } from 'vue-router';
import ServiceRequests from '../pages/ServiceRequests.vue';
import Commodities from '../pages/Commodities.vue';
import Vehicles from '../pages/Vehicles.vue';
import Drivers from '../pages/Drivers.vue';

const routes = [
    { path: '/', component: ServiceRequests },
    { path: '/commodities', component: Commodities },
    { path: '/vehicles', component: Vehicles },
    { path: '/drivers', component: Drivers }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
