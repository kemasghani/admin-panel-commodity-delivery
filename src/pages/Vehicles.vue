<template>
  <div class="mx-auto p-6 bg-white shadow-lg rounded-lg">
    <!-- Title -->
    <h1 class="text-2xl font-semibold text-gray-800 mb-4">Vehicles</h1>

    <!-- Add Vehicle Button -->
    <button
      @click="openModal()"
      class="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    >
      + Add Vehicle
    </button>

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
                @click="openModal(vehicle)"
                class="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(vehicle.id)"
                class="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition ml-2"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Vehicle Modal -->
    <Modal v-if="showModal" @close="closeModal">
      <template #title>{{
        isEditing ? "Edit Vehicle" : "Add New Vehicle"
      }}</template>
      <template #body>
        <input
          v-model="currentVehicle.model_name"
          placeholder="Vehicle Model"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2"
        />
        <input
          v-model="currentVehicle.license_plate"
          placeholder="License Plate"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
          {{ errorMessage }}
        </p>
      </template>
      <template #footer>
        <button
          @click="isEditing ? updateVehicle() : addVehicle()"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          :disabled="isLoading"
        >
          {{ isLoading ? "Saving..." : isEditing ? "Update" : "Submit" }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "../main.js";
import Modal from "../components/Modal.vue";

export default {
  components: { Modal },
  setup() {
    const vehicles = ref([]);
    const showModal = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref("");
    const isEditing = ref(false);
    const currentVehicle = ref({ id: null, model_name: "", license_plate: "" });

    const fetchVehicles = async () => {
      const { data, error } = await supabase.from("vehicle").select("*");
      if (error) console.error("Error fetching vehicles:", error);
      vehicles.value = data || [];
    };

    const addVehicle = async () => {
      if (
        !currentVehicle.value.model_name.trim() ||
        !currentVehicle.value.license_plate.trim()
      ) {
        errorMessage.value =
          "Please enter a valid vehicle name and license plate!";
        return;
      }
      isLoading.value = true;
      await supabase.from("vehicle").insert([currentVehicle.value]);
      closeModal();
      fetchVehicles();
      isLoading.value = false;
    };

    const updateVehicle = async () => {
      if (
        !currentVehicle.value.model_name.trim() ||
        !currentVehicle.value.license_plate.trim()
      ) {
        errorMessage.value =
          "Please enter a valid vehicle name and license plate!";
        return;
      }
      isLoading.value = true;
      await supabase
        .from("vehicle")
        .update(currentVehicle.value)
        .eq("id", currentVehicle.value.id);
      closeModal();
      fetchVehicles();
      isLoading.value = false;
    };

    const deleteVehicle = async (id) => {
      await supabase.from("vehicle").delete().eq("id", id);
      fetchVehicles();
    };

    const confirmDelete = (id) => {
      if (confirm("Are you sure you want to delete this vehicle?")) {
        deleteVehicle(id);
      }
    };

    const openModal = (vehicle = null) => {
      if (vehicle) {
        isEditing.value = true;
        currentVehicle.value = { ...vehicle };
      } else {
        isEditing.value = false;
        currentVehicle.value = { id: null, model_name: "", license_plate: "" };
      }
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      currentVehicle.value = { id: null, model_name: "", license_plate: "" };
      errorMessage.value = "";
    };

    onMounted(fetchVehicles);

    return {
      vehicles,
      showModal,
      isLoading,
      currentVehicle,
      errorMessage,
      isEditing,
      addVehicle,
      updateVehicle,
      confirmDelete,
      openModal,
      closeModal,
    };
  },
};
</script>
