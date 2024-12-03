<template>
  <div class="survey-box">
    <h2 class="survey-title">{{ title }}</h2>
    <p class="survey-description">{{ description }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    description: String,
  },
};
</script>

<style scoped>
.survey-box {
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.04);
  padding: 20px;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
}

.survey-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.survey-description {
  font-size: 14px;
  color: #6e6a7c;
}
</style>
