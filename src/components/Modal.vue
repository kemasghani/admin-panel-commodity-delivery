<template>
  <transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-40 backdrop-blur-lg p-4"
      @click.self="closeModal"
    >
      <div class="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full relative">
        <!-- Close Button -->
        <button
          @click="closeModal"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition duration-200"
        >
          ✕
        </button>

        <!-- Modal Header -->
        <h2 class="text-xl font-bold text-gray-800 mb-4">
          <slot name="title"></slot>
        </h2>

        <!-- Modal Body -->
        <div class="space-y-4 text-gray-700 overflow-y-auto max-h-[500px]">
          <slot name="body"></slot>
        </div>

        <!-- Footer Actions -->
        <div class="mt-6 flex justify-end gap-2">
          <slot name="footer">
            <!-- Default Footer -->
            <button
              @click="closeModal"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
            >
              Close
            </button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  emits: ["close"],
  mounted() {
    document.body.classList.add("overflow-hidden"); // Prevent scrolling when modal is open
    window.addEventListener("keydown", this.handleEscape);
  },
  beforeUnmount() {
    document.body.classList.remove("overflow-hidden"); // Restore scrolling
    window.removeEventListener("keydown", this.handleEscape);
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    handleEscape(event) {
      if (event.key === "Escape") {
        this.closeModal();
      }
    },
  },
};
</script>
