<template>
  <div class="h-screen w-[30%] bg-white shadow-md flex flex-col">
    <!-- Logo / Brand -->
    <div class="flex items-center justify-center h-16 border-b">
      <h1 class="text-lg font-semibold text-gray-800">Admin Panel</h1>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 mt-4">
      <ul class="space-y-1 px-4">
        <li v-for="(item, index) in menuItems" :key="index">
          <router-link
            :to="item.path"
            class="flex items-center px-4 py-3 rounded-md transition-all hover:bg-gray-100 text-gray-700"
            active-class="bg-gray-200 font-medium"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3 text-gray-500" />
            <span>{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  HomeIcon,
  ArchiveBoxIcon,
  TruckIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";

const menuItems = ref([
  { name: "Service Requests", path: "/", icon: HomeIcon },
  { name: "Commodities", path: "/commodities", icon: ArchiveBoxIcon },
  { name: "Vehicles", path: "/vehicles", icon: TruckIcon },
  { name: "Drivers", path: "/drivers", icon: UsersIcon },
]);
</script>

<style scoped></style>
