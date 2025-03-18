<template>
  <div class="mx-auto p-6 bg-white shadow-lg rounded-lg">
    <!-- Title -->
    <h1 class="text-2xl font-semibold text-gray-800 mb-4">Vehicles</h1>

    <!-- Add New Vehicle -->
    <div class="flex gap-3 mb-4">
      <input
        v-model="newVehicle"
        placeholder="Enter vehicle model"
        class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="addVehicle"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Add
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-gray-100">
          <tr class="text-left">
            <th class="p-3 border">Nama Kendaraan</th>
            <th class="p-3 border">Plat Nomor</th>
            <th class="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="vehicle in vehicles"
            :key="vehicle.id"
            class="hover:bg-gray-50"
          >
            <td class="p-3 border">{{ vehicle.model_name }}</td>
            <td class="p-3 border">{{ vehicle.license_plate }}</td>
            <td class="p-3 border">
              <button
                @click="confirmDelete(vehicle.id)"
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
    const vehicles = ref([]);
    const newVehicle = ref("");

    const fetchVehicles = async () => {
      const { data, error } = await supabase.from("vehicle").select("*");

      if (error) {
        console.error("Error fetching vehicles:", error);
        return;
      }

      console.log("Fetched vehicles:", data);
      vehicles.value = data || [];
    };

    const addVehicle = async () => {
      if (!newVehicle.value.trim()) return;

      const { data, error } = await supabase
        .from("vehicle")
        .insert([{ model_name: newVehicle.value }])
        .select();

      if (error) {
        console.error("Error adding vehicle:", error);
        return;
      }

      console.log("Added vehicle:", data);
      newVehicle.value = "";
      fetchVehicles();
    };

    const deleteVehicle = async (id) => {
      const { error } = await supabase.from("vehicle").delete().eq("id", id);

      if (error) {
        console.error("Error deleting vehicle:", error);
        return;
      }

      console.log(`Deleted vehicle with ID: ${id}`);
      fetchVehicles();
    };

    const confirmDelete = (id) => {
      if (confirm("Are you sure you want to delete this vehicle?")) {
        deleteVehicle(id);
      }
    };

    onMounted(fetchVehicles);

    return { vehicles, newVehicle, addVehicle, confirmDelete };
  },
};
</script>
