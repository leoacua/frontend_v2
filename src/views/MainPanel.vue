<template>
  <b-container fluid="sm">
    <b-row>
      <b-col><b-button variant="primary" @click="executeFetchTask">Actualizar DB</b-button></b-col>
      <b-col>
        <b-form-group
          label="Ordenar por"
          label-for="sort-by-select"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
          v-slot="{ ariaDescribedby }"
        >
          <b-input-group size="sm">
            <b-form-select
              id="sort-by-select"
              v-model="sortBy"
              :options="sortOptions"
              :aria-describedby="ariaDescribedby"
              class="w-75"
            >
              <template #first>
                <option value="">-- selecione --</option>
              </template>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col class="my-1">
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
              placeholder="Buscar"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Borrar</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-select v-model="selectedMagType" :options="magTypeOptions" @change="applyMagTypeFilter"></b-form-select>
      </b-col>
    </b-row>
    <div v-if="isLoading">Cargando...</div>
    <div v-else>
      <div v-if="error">Error: {{ error }}</div>
      <div v-else>
        <b-table
          no-border-collapse
          sticky-header
          head-variant="light"
          hover
          show-empty
          bordered
          outlined
          striped
          small
          :filter="filter"
          :filterIncludedFields="filterOn"
          :fields="fields"
          :items="items"
          :per-page="perPage"
          :current-page="currentPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
        >
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template #cell(actions)="row">
            <b-button @click="showModal = true; selectedEarthquakeId = row.item.id">Comentar</b-button>
          </template>
        </b-table>
      </div>
    </div>
    <!-- Modal -->
    <b-modal hide-footer v-model="showModal" title="Añadir Comentario">
      <b-form-group label="Comentario">
        <b-form-textarea v-model="comment"></b-form-textarea>
      </b-form-group>
      <b-button variant="primary" @click="addComment">Enviar</b-button>
      <b-button variant="secondary" @click="showModal = false">Cancelar</b-button>
    </b-modal>
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
      items: [],
      filterOn: [],
      filterMagType: '',
      showModal: false,
      comment:'',
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      selectedMagType: '', // Nuevo
      fields: [
        { key: 'actions', label: 'Acciones' },
        { key: 'id', label: 'ID' },
        { key: 'ids', label: 'IDs' },
        { key: 'mag', label: 'Magnitud' },
        { key: 'place', label: 'Lugar' },
        { key: 'time', label: 'Tiempo' },
        { key: 'url', label: 'URL' },
        { key: 'tsunami', label: 'Tsunami' },
        { key: 'mag_type', label: 'Tipo de Magnitud' },
        { key: 'title', label: 'Título' },
        { key: 'feature_type', label: 'Tipo de Característica' },
        { key: 'geometry_longitude', label: 'Longitud de la Geometría' },
        { key: 'geometry_latitude', label: 'Latitud de la Geometría' },
        { key: 'comments[0].body', label: 'Comentarios' }
      ],
    };
  },
  created() {
    axios.get('http://localhost:3000/api/earthquakes_with_comments')
      .then(response => {
        this.items = response.data;
        this.totalRows = this.items.length;
        this.isLoading = false;
      })
      .catch(error => {
        this.error = error.message;
        this.isLoading = false;
      });
  },
  computed: {
    rows() {
      return this.items.length;
    },
    sortOptions() {
      // Create an options list from our fields
      const excludedColumns = ['actions','id','ids','mag','place','time','url','tsunami',
                               'title','feature_type','geometry_longitude','geometry_latitude'];
      const includedColumns = ['comments[0].body'];                         
                               
      return this.fields
        .filter(f => includedColumns.includes(f.key))
        .filter(f => !excludedColumns.includes(f.key)) // Exclude actions column
        .map(f => ({ text: f.label, value: f.key }));
    },
    magTypeOptions() {
      // Obtain a list of unique values for the Mag Type filter
      const uniqueMagTypes = [...new Set(this.items.map(item => item.mag_type))];
      // Convert the unique values into options for the dropdown filter
      return uniqueMagTypes.map(magType => ({ value: magType, text: magType }));
    },
  },
  methods: {
    executeFetchTask() {
      axios.get('http://localhost:3000/fetch_earthquake_data')
        .then(response => {
          console.log(response.data.message);
          alert('Éxito", "Se ha actualizado la base de datos exitosamente');
        })
        .catch(error => {
          console.error('Error al ejecutar la tarea:', error);
          alert('Error al ejecutar la tarea');
        });
    },
    addComment() {
      // Create an object with the comment
      const postData = { body: this.comment };

      // Send the POST request with the data object
      axios.post(`http://localhost:3000/api/earthquakes/${this.selectedEarthquakeId}/comments`, postData)
        .then(response => {
          console.log('Server Response:', response.data);
          // Close the modal after sending the comment
          this.showModal = false;
          // Clear the comment field
          this.comment = '';
        })
        .catch(error => {
          console.error('Error sending the comment:', error);
          // Handle the error if the request fails
        });
    },
    applyMagTypeFilter() {
      if (this.selectedMagType) {
        // Filtrar los elementos para incluir solo los que tienen el tipo de magnitud seleccionado
        this.items = this.items.filter(item => item.mag_type === this.selectedMagType);
      } else {
        // Si no se ha seleccionado ningún tipo de magnitud, mostrar todos los elementos
        this.fetchData();
      }
    },
  }
};
</script>

<style>
.row{
  margin: 29px
}

</style>
