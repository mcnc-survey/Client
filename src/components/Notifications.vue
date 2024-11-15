<template>
  <div class="notifications" v-if="isNotificationsOpen">
    <h3>Notifications</h3>
    <ul>
      <li>New Survey Created!</li>
      <li>Survey Deadline Approaching</li>
      <li>Survey Results Available</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    isNotificationsOpen: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
.notifications {
  width: 15%;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.notifications h3 {
  margin-top: 0;
}

.notifications ul {
  list-style-type: none;
  padding-left: 0;
}

.notifications li {
  margin-bottom: 10px;
  padding: 5px;
  background-color: #f1f1f1;
  border-radius: 4px;
}

.notifications li:hover {
  background-color: #e1e1e1;
}
</style>
