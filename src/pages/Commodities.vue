<template>
  <div class="mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-2xl font-semibold text-gray-800 mb-4">Commodities</h1>

    <button
      @click="openModal()"
      class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    >
      + Add Commodity
    </button>

    <div class="overflow-x-auto mt-4">
      <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-gray-100">
          <tr class="text-left">
            <th class="p-3 border">Name</th>
            <th class="p-3 border">Price per Kg</th>
            <th class="p-3 border">Description</th>
            <th class="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="commodity in commodities"
            :key="commodity.id"
            class="hover:bg-gray-50"
          >
            <td class="p-3 border">{{ commodity.name }}</td>
            <td class="p-3 border">{{ commodity.price_per_kg }}</td>
            <td class="p-3 border">{{ commodity.description }}</td>
            <td class="p-3 border">
              <button
                @click="openModal(commodity)"
                class="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                @click="deleteCommodity(commodity.id)"
                class="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition ml-2"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="showModal" @close="closeModal">
      <template #title>{{
        isEditing ? "Edit Commodity" : "Add New Commodity"
      }}</template>
      <template #body>
        <input
          v-model="currentCommodity.name"
          placeholder="Commodity Name"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2"
        />
        <input
          v-model.number="currentCommodity.price_per_kg"
          type="number"
          step="0.01"
          placeholder="Price per Kg"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2"
        />
        <input
          v-model="currentCommodity.description"
          placeholder="Description"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </template>
      <template #footer>
        <button
          @click="isEditing ? updateCommodity() : addCommodity()"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {{ isEditing ? "Update" : "Submit" }}
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
    const commodities = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const currentCommodity = ref({
      id: null,
      name: "",
      price_per_kg: 0,
      description: "",
    });

    const fetchCommodities = async () => {
      const { data } = await supabase.from("commodity").select("*");
      commodities.value = data || [];
    };

    const addCommodity = async () => {
      await supabase.from("commodity").insert([{ ...currentCommodity.value }]);
      closeModal();
      fetchCommodities();
    };

    const updateCommodity = async () => {
      await supabase
        .from("commodity")
        .update({
          name: currentCommodity.value.name,
          price_per_kg: currentCommodity.value.price_per_kg,
          description: currentCommodity.value.description,
        })
        .eq("id", currentCommodity.value.id);
      closeModal();
      fetchCommodities();
    };

    const deleteCommodity = async (id) => {
      await supabase.from("commodity").delete().eq("id", id);
      fetchCommodities();
    };

    const openModal = (commodity = null) => {
      isEditing.value = !!commodity;
      currentCommodity.value = commodity
        ? { ...commodity }
        : { id: null, name: "", price_per_kg: 0, description: "" };
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      isEditing.value = false;
      currentCommodity.value = {
        id: null,
        name: "",
        price_per_kg: 0,
        description: "",
      };
    };

    onMounted(fetchCommodities);

    return {
      commodities,
      showModal,
      isEditing,
      currentCommodity,
      addCommodity,
      updateCommodity,
      deleteCommodity,
      openModal,
      closeModal,
    };
  },
};
</script>
