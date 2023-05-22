<template>
  <div id="app">
    <NavbarHeader />
    <ProgressBar />
    <b-container class="text-center search-container">
      <RouterView />
    </b-container>
  </div>
</template>

<style scoped>
.search-container {
  margin-top: 0.5rem;
}
</style>
