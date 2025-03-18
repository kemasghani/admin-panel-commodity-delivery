<template>
  <div class="app">
    <Sidebar />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue";
export default {
  components: { Sidebar },
};
</script>

<style scoped>
.app {
  display: flex;
}
.content {
  padding: 20px;
  width: 100%;
}
</style>
