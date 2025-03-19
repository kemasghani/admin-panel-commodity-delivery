<template>
  <div class="mx-auto p-6 bg-white shadow-lg rounded-lg">
    <!-- Title -->
    <h1 class="text-2xl font-semibold text-gray-800 mb-4">Commodities</h1>
    <!-- Add Commodity Button -->
    <button
      @click="openModal"
      class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    >
      + Add Commodity
    </button>
    <!-- Commodity List -->
    <ul class="space-y-2 mt-4">
      <li
        v-for="commodity in commodities"
        :key="commodity.id"
        class="flex items-center justify-between p-3 bg-gray-100 rounded-md"
      >
        <input
          v-model="commodity.name"
          class="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <div class="flex gap-2">
          <button
            @click="updateCommodity(commodity)"
            class="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition"
          >
            Update
          </button>
          <button
            @click="deleteCommodity(commodity.id)"
            class="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
    <!-- Add Commodity Modal -->
    <Modal v-if="showModal" @close="closeModal">
      <template #title>Add New Commodity</template>
      <template #body>
        <input
          v-model="newCommodity"
          placeholder="Commodity Name"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </template>
      <template #footer>
        <button
          @click="addCommodity"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
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
    const newCommodity = ref("");
    const showModal = ref(false);

    const fetchCommodities = async () => {
      const { data } = await supabase.from("commodity").select("*");
      commodities.value = data || [];
    };

    const addCommodity = async () => {
      if (!newCommodity.value.trim()) return;
      await supabase.from("commodity").insert([{ name: newCommodity.value }]);
      newCommodity.value = "";
      closeModal();
      fetchCommodities();
    };

    const updateCommodity = async (commodity) => {
      await supabase
        .from("commodity")
        .update({ name: commodity.name })
        .eq("id", commodity.id);
      fetchCommodities();
    };

    const deleteCommodity = async (id) => {
      await supabase.from("commodity").delete().eq("id", id);
      fetchCommodities();
    };

    const openModal = () => {
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      newCommodity.value = "";
    };

    onMounted(fetchCommodities);

    return {
      commodities,
      newCommodity,
      showModal,
      addCommodity,
      updateCommodity,
      deleteCommodity,
      openModal,
      closeModal,
    };
  },
};
</script>
