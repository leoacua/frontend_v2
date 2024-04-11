import Vue from 'vue';
import VueRouter from 'vue-router';
import HelloWorld from '../components/HelloWorld.vue';
import fetchEarthquakeData from '../views/fetch_earthquake_data.vue';
import ApiTest from '../views/ApiTest.vue'
import MainPanel from '../views/MainPanel.vue';

// Importa VueRouter y úsalo con Vue
Vue.use(VueRouter);

// Define tus rutas
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloWorld
  },
  {
    path: '/ApiTest',
    name: 'ApiTest',
    component: ApiTest
  },
  {
    path: '/MainPanel',
    name: 'MainPanel',
    component: MainPanel
  },
  {
    path: '/fetch_earthquake_data',
    name: 'fetch_earthquake_data',
    component: fetchEarthquakeData
  }
];

// Crea una instancia de VueRouter con tus rutas
const router = new VueRouter({
  mode: 'history', // Modo de historial HTML5
  routes // Pasa las rutas que definiste
});

// Exporta el enrutador para usarlo en tu aplicación Vue
export default router;

 