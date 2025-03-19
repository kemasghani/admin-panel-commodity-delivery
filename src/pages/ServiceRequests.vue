<template>
  <div class="mx-auto p-6 bg-white shadow-lg rounded-lg">
    <!-- Title -->
    <h1 class="text-2xl font-semibold text-gray-800 mb-4">Service Requests</h1>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-gray-100">
          <tr class="text-left">
            <th class="p-3 border">No</th>
            <th class="p-3 border">Status</th>
            <th class="p-3 border">Price</th>
            <th class="p-3 border">Payment Status</th>
            <th class="p-3 border">Tanggal</th>
            <th class="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(req, index) in state.serviceRequests"
            :key="req.id"
            class="hover:bg-gray-50"
          >
            <td class="p-3 border">{{ index + 1 }}</td>
            <td class="p-3 border">
              <span
                class="px-3 py-1 rounded-lg text-white font-semibold"
                :class="{
                  'bg-green-500': req.status === 'done',
                  'bg-yellow-500': req.status === 'on progress',
                  'bg-red-500': req.status === 'cancelled',
                }"
              >
                {{ req.status }}
              </span>
            </td>
            <td class="p-3 border text-gray-700 font-medium">
              Rp {{ req.price.toLocaleString() }}
            </td>
            <td class="p-3 border">{{ req.paid ? "Paid" : "Unpaid" }}</td>
            <td class="p-3 border">{{ formatDate(req.created_at) }}</td>
            <td class="p-3 border">
              <button
                @click="openModal(req)"
                class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <!-- Detail Modal -->
    <Modal v-if="state.showModal" @close="closeModal">
      <template #title>Service Request Details</template>
      <template #body>
        <div class="space-y-3">
          <p>
            <span class="font-semibold">Status:</span>
            {{ state.selectedRequest.status }}
          </p>
          <p>
            <span class="font-semibold">Price:</span> Rp
            {{ state.selectedRequest.price.toLocaleString() }}
          </p>
          <p>
            <span class="font-semibold">Tanggal:</span>
            {{ formatDate(state.selectedRequest.created_at) }}
          </p>

          <!-- Commodities List -->
          <p><span class="font-semibold">Commodities:</span></p>
          <ul class="list-disc pl-5">
            <li
              v-for="commodity in state.selectedRequest
                .service_request_commodities"
              :key="commodity.id"
            >
              {{ commodity.commodity.name }} -({{ commodity.weight }}
              kg)
            </li>
          </ul>

          <!-- Payment Slip -->
          <p v-if="state.selectedRequest.payment_image">
            <span class="font-semibold">Payment Slip:</span>
          </p>
          <div
            v-if="state.selectedRequest.payment_image"
            class="flex flex-col items-center space-y-2"
          >
            <img
              :src="state.selectedRequest.payment_image"
              alt="Payment Slip"
              class="w-full max-w-md rounded-lg shadow-md"
            />
            <a
              :href="state.selectedRequest.payment_image"
              download
              class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Download
            </a>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";
import { supabase } from "../main.js";
import Modal from "../components/Modal.vue";

export default {
  components: { Modal },
  setup() {
    const state = reactive({
      serviceRequests: [],
      showModal: false,
      selectedRequest: {},
    });

    // Fetch Service Requests with Commodities
    const fetchServiceRequests = async () => {
      const { data, error } = await supabase
        .from("service_requests")
        .select(
          `*,
      service_request_commodities (
        id,
        commodity_id,
        quantity,
        weight,
        commodity:commodity_id (name)
      )`
        )
        .order("created_at", { ascending: false }); // Urutkan dari terbaru

      if (error) {
        console.error("Error fetching service requests:", error);
        return;
      }

      console.log("Fetched service requests with commodities:", data);
      state.serviceRequests = data || [];
    };

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    };

    const openModal = (request) => {
      state.selectedRequest = request;
      state.showModal = true;
    };

    const closeModal = () => {
      state.showModal = false;
      state.selectedRequest = {};
    };

    onMounted(fetchServiceRequests);

    return { state, formatDate, openModal, closeModal };
  },
};
</script>
