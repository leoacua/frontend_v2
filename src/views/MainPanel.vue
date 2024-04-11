<template>
    <b-container fluid>
    <b-row>
    </b-row>      
      <div v-if="isLoading">Cargando...</div>
      <div v-else>
        <div v-if="error">Error: {{ error }}</div>
        <div v-else>
          <b-table
            :items="apiData"
            :fields="fields"
            stacked="md"
            show-empty
            small
          ></b-table>
        </div>
      </div>
    </b-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        isLoading: true,
        error: null,
        apiData: [],
        fields: [
          // Define los campos de la tabla
          { key: 'ids', label: 'id' },
          { key: 'mag', label: 'mag', sortable: true },
          { key: 'place', label: 'place', sortable: true },
          { key: 'time', label: 'time', sortable: true },
          { key: 'url', label: 'url', sortable: true },
          { key: 'tsunami', label: 'tsunami', sortable: true },
          { key: 'mag_type', label: 'mag_type', sortable: true },
          { key: 'title', label: 'title', sortable: true },
          { key: 'feature_type', label: 'feature_type', sortable: true },
          { key: 'geometry_longitude', label: 'geometry_longitude', sortable: true },
          { key: 'geometry_latitude', label: 'geometry_latitude', sortable: true },
        ]
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