import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import 'jquery-confirm';
import { createApp } from 'vue';
import TaskApp from './components/TaskApp.vue';

createApp(TaskApp).mount('#app');