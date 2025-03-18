<template>
  <div class="mx-auto p-6 bg-white shadow-lg rounded-lg">
    <!-- Title -->
    <h1 class="text-2xl font-semibold text-gray-800 mb-4">Drivers</h1>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-gray-100">
          <tr class="text-left">
            <th class="p-3 border">Name</th>
            <th class="p-3 border">Wallet Balance</th>
            <th class="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="driver in drivers"
            :key="driver.id"
            class="hover:bg-gray-50"
          >
            <td class="p-3 border">{{ driver.name }}</td>
            <td class="p-3 border text-gray-700 font-medium">
              Rp {{ driver.wallet_balance.toLocaleString() }}
            </td>
            <td class="p-3 border">
              <button
                @click="confirmDelete(driver.id)"
                class="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "../main.js"; // Ensure correct path

export default {
  setup() {
    const drivers = ref([]); // ✅ Use ref([]) for an array

    const fetchDrivers = async () => {
      const { data } = await supabase.from("drivers").select("*");
      drivers.value = data || [];
    };

    const deleteDriver = async (id) => {
      await supabase.from("drivers").delete().eq("id", id);
      fetchDrivers();
    };

    const confirmDelete = (id) => {
      if (confirm("Are you sure you want to delete this driver?")) {
        deleteDriver(id);
      }
    };

    onMounted(fetchDrivers);

    return { drivers, confirmDelete }; // ✅ No need to wrap in an object
  },
};
</script>
