<template>
    <div>
      <button @click="executeFetchTask">Ejecutar tarea</button>
    </div>
  </template>
  
  <script>
  // Importa Axios
  import axios from 'axios';
  
  export default {
    methods: {
      // Método para ejecutar la tarea
      executeFetchTask() {
        axios.get('http://localhost:3000/fetch_earthquake_data')
          .then(response => {
            console.log(response.data.message);
            alert('Éxito", "Se ha actualizado la base de datos exitosamente');
          })
          .catch(error => {
           
            console.error('Error al ejecutar la tarea:', error);
            // Por ejemplo, muestra un mensaje de error
            alert('Error al ejecutar la tarea');
          });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos CSS */
  button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  