<template >
  <b-container fluid="sm">
    <b-row>
      <b-col><b-button variant="primary" @click="executeFetchTask">Actualizar DB</b-button></b-col>
      <b-col></b-col>
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
      <b-col>1 of 3</b-col>
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
    <!-- Modal -->
    <b-modal  hide-footer v-model="showModal" title="Añadir Comentario">
      <b-form-group label="Comentario">
        <b-form-textarea v-model="comment"></b-form-textarea>
      </b-form-group>
      <b-button variant="primary" @click="addComment">Enviar</b-button>
      <b-button variant="secondary" @click="showModal = false">Cancelar</b-button>
    </b-modal>
  </b-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      filter: '',
      perPage: 100,
      currentPage: 1,
      isLoading: true,
      error: null,
      items: [],
      filterOn: [],
      showModal: false,
      comment:'',
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
      return this.fields.length;
    }
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
  // Crear un objeto con el comentario
  const postData = { body: this.comment };

  // Enviar la solicitud POST con el objeto de datos
  axios.post(`http://localhost:3000/api/earthquakes/${this.selectedEarthquakeId}/comments`, postData)
    .then(response => {
      console.log('Respuesta del servidor:', response.data);
      // Cerrar el modal después de enviar el comentario
      this.showModal = false;
      // Limpiar el campo de comentario
      this.comment = '';
    })
    .catch(error => {
      console.error('Error al enviar el comentario:', error);
      // Manejar el error si la solicitud falla
    });
   }
  }
};
</script>
