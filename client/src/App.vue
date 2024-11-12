<template>
  <div id="app">
    <nav>
      <router-link to="/">Login</router-link>
      <router-link to="/survey-management">Survey Management</router-link>
      <router-link to="/survey-edit">Survey Edit</router-link>
      <router-link to="/survey-stats">Survey Stats</router-link>
      <router-link to="/survey-create">Survey Create</router-link>
      <router-link to="/survey-completion">Survey Completion</router-link>
      <router-link to="/calendar">Calendar</router-link>
      <router-link to="/deleted-items">Deleted Items</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style>
nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
