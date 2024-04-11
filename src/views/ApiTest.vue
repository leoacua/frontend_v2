<template>
    <div>
      <h2>Prueba del API</h2>
      <div v-if="isLoading">Cargando...</div>
      <div v-else>
        <div v-if="error">Error: {{ error }}</div>
        <div v-else>
          <div v-for="(item, index) in apiData" :key="index">
            <p>{{ item }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        isLoading: true,
        error: null,
        apiData: []
      };
    },
    created() {
      axios.get('http://localhost:3000/api/earthquakes')
        .then(response => {
          this.apiData = response.data; // Almacena los datos en apiData
          this.isLoading = false;
        })
        .catch(error => {
          this.error = error.message; // Almacena el mensaje de error en error
          this.isLoading = false;
        });
    }
  };
  </script>
  