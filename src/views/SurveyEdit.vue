<template>
  <div>

    <h1>Edit Page</h1>
    <p>This is the Edit Page!</p>
    <p>편집할 설문조사의 ID: {{ $route.params.id }}</p>

  </div>
</template>

<script>
export default {
  name: 'SurveyEdit'
}
</script>
