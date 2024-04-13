<template>
    <b-container fluid>
       <b-row>
        <b-col lg="6" class="my-1">
        <b-form-group
          label="Filtro"
          label-for="filter-input"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Escribe para buscar"
            ></b-form-input>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Buscar</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
       </b-row>
      <div v-if="isLoading">Cargando...</div>
      <div v-else>
        <div v-if="error">Error: {{ error }}</div>
        <div v-else>
          <b-table
            striped hover
            sticky-header
            head-variant="light"
            show-empty
            small
            :filter="filter"
            :items="apiData"
            :apiData="apiData"
            :per-page="perPage"
            :current-page="currentPage"
          ></b-table>
        </div>
      </div>
      <b-row>
        <b-col sm="7" md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row> 
    </b-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        filter: null,
        perPage: 100,
        currentPage: 1,
        isLoading: true,
        error: null,
        apiData: [ { key: 'id', label: 'id' },
          { key: 'ids', label: 'ids' },
          { key: 'mag', label: 'mag', sortable: true },
          { key: 'place', label: 'place', sortable: true },
          { key: 'time', label: 'time', sortable: true },
          { key: 'url', label: 'url', sortable: true },
          { key: 'tsunami', label: 'tsunami', sortable: true },
          { key: 'mag_type', label: 'mag_type', sortable: true },
          { key: 'title', label: 'title', sortable: true },
          { key: 'feature_type', label: 'feature_type', sortable: true },
          { key: 'geometry_longitude', label: 'geometry_longitude', sortable: true },
          { key: 'geometry_latitude', label: 'geometry_latitude', sortable: true }],
        fields: []
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
    },
    computed: {
      rows() {
        return this.apiData.length
      }
    },
    sortOptions() {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
      }
  };
  </script>