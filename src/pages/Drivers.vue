<template>
  <div class="mx-auto p-6 bg-white shadow-lg rounded-lg">
    <!-- Title -->
    <h1 class="text-2xl font-semibold text-gray-800 mb-4">Drivers</h1>

    <!-- Add Driver Button -->
    <button
      @click="openModal()"
      class="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    >
      + Add Driver
    </button>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-gray-100">
          <tr class="text-left">
            <th class="p-3 border">Name</th>
            <th class="p-3 border">Wallet Balance</th>
            <th class="p-3 border">Vehicle</th>
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
              {{ getVehicleName(driver.vehicle_id) || "No Vehicle" }}
            </td>
            <td class="p-3 border">
              <button
                @click="openModal(driver)"
                class="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(driver.id)"
                class="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition ml-2"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Driver Modal -->
    <Modal v-if="showModal" @close="closeModal">
      <template #title>{{
        isEditing ? "Edit Driver" : "Add New Driver"
      }}</template>
      <template #body>
        <input
          v-model="currentDriver.name"
          placeholder="Driver Name"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2"
        />
        <input
          v-model="currentDriver.wallet_balance"
          type="number"
          placeholder="Wallet Balance"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2"
        />
        <select
          v-model="currentDriver.vehicle_id"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select a Vehicle</option>
          <option
            v-for="vehicle in vehicles"
            :key="vehicle.id"
            :value="vehicle.id"
          >
            {{ vehicle.model_name }}
          </option>
        </select>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
          {{ errorMessage }}
        </p>
      </template>
      <template #footer>
        <button
          @click="isEditing ? updateDriver() : addDriver()"
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
    const drivers = ref([]);
    const vehicles = ref([]);
    const showModal = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref("");
    const isEditing = ref(false);
    const currentDriver = ref({
      id: null,
      name: "",
      wallet_balance: 0,
      vehicle_id: "",
    });

    const fetchDrivers = async () => {
      const { data, error } = await supabase.from("drivers").select("*");
      if (error) console.error("Error fetching drivers:", error);
      drivers.value = data || [];
    };

    const fetchVehicles = async () => {
      const { data, error } = await supabase.from("vehicle").select("*");
      if (error) console.error("Error fetching vehicles:", error);
      vehicles.value = data || [];
    };

    const addDriver = async () => {
      if (
        !currentDriver.value.name.trim() ||
        currentDriver.value.wallet_balance < 0
      ) {
        errorMessage.value = "Please enter a valid name and balance!";
        return;
      }
      isLoading.value = true;
      await supabase.from("drivers").insert([
        {
          name: currentDriver.value.name,
          wallet_balance: currentDriver.value.wallet_balance,
          vehicle_id: currentDriver.value.vehicle_id || null,
        },
      ]);
      closeModal();
      fetchDrivers();
      isLoading.value = false;
    };

    const updateDriver = async () => {
      if (
        !currentDriver.value.name.trim() ||
        currentDriver.value.wallet_balance < 0
      ) {
        errorMessage.value = "Please enter a valid name and balance!";
        return;
      }
      isLoading.value = true;
      await supabase
        .from("drivers")
        .update({
          name: currentDriver.value.name,
          wallet_balance: currentDriver.value.wallet_balance,
          vehicle_id: currentDriver.value.vehicle_id || null,
        })
        .eq("id", currentDriver.value.id);
      closeModal();
      fetchDrivers();
      isLoading.value = false;
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

    const getVehicleName = (vehicle_id) => {
      const vehicle = vehicles.value.find((v) => v.id === vehicle_id);
      return vehicle ? vehicle.model_name : "No Vehicle";
    };

    const openModal = (driver = null) => {
      if (driver) {
        isEditing.value = true;
        currentDriver.value = { ...driver };
      } else {
        isEditing.value = false;
        currentDriver.value = {
          id: null,
          name: "",
          wallet_balance: 0,
          vehicle_id: "",
        };
      }
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      currentDriver.value = {
        id: null,
        name: "",
        wallet_balance: 0,
        vehicle_id: "",
      };
      errorMessage.value = "";
    };

    onMounted(() => {
      fetchDrivers();
      fetchVehicles();
    });

    return {
      drivers,
      vehicles,
      showModal,
      isLoading,
      currentDriver,
      errorMessage,
      isEditing,
      addDriver,
      updateDriver,
      confirmDelete,
      openModal,
      closeModal,
      getVehicleName,
    };
  },
};
</script>
