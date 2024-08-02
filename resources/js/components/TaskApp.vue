<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <div class="input-group mb-3">
                    <input v-model="newTask" @keyup.enter="addTask" type="text" class="form-control" placeholder="Enter task" />
                    <button class="btn btn-primary" @click="addTask" :disabled="loading">
                        Add Task
                    </button>
                </div>
                <button class="btn btn-secondary mb-3" v-if="activeTasks.length > 0">
                   Task List
                </button>
                <!-- Display active tasks or all tasks based on the view state -->
                <ul class="list-group mb-4">
                    <li v-for="task in activeTasks" :key="task.id" class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <input type="checkbox" :checked="task.is_completed" @change="toggleTask(task.id, task.is_completed)" class="form-check-input me-2" />
                            <span>{{ task.task }}</span>
                        </div>
                        <button v-if="!task.is_completed" class="btn btn-danger btn-sm" @click="confirmDelete(task.id)">Delete</button>
                    </li>
                </ul>
                <button class="btn btn-secondary mb-3" @click="toggleView">
                    {{ showAll ? 'Active Tasks' : 'Show All Tasks' }}
                </button>
                <!-- Display all tasks if showAll is true -->
                <ul v-if="showAll" class="list-group">
                    <h4>Completed Tasks</h4>
                    <li v-for="task in tasks" :key="task.id" class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <input type="checkbox" :checked="task.is_completed" @change="toggleTask(task.id, task.is_completed)" class="form-check-input me-2" />
                            <span>{{ task.task }}</span>
                        </div>
                        <div>
                            <span class="badge" :class="{ 'bg-success': task.is_completed, 'bg-warning': !task.is_completed }">
                                {{ task.is_completed ? 'Completed' : 'Not Completed' }}
                            </span>
                        </div>
                        <button class="btn btn-danger btn-sm" @click="confirmDelete(task.id)">Delete</button>
                    </li>
                </ul>
                <!-- Modal -->
                <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="deleteModalLabel">Delete Task</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                Are you sure you want to delete this task?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-danger" @click="deleteTask">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Full-screen loader -->
        <div v-if="loading" class="full-screen-loader">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
import { Modal } from 'bootstrap';

export default {
    data() {
        return {
            newTask: '',
            tasks: [],
            taskToDelete: null,
            deleteModal: null,
            showAll: false, // Flag to toggle between showing all tasks or only active tasks
            loading: false // Flag to track loading state
        };
    },
    computed: {
        // Filter tasks to show only those that are not completed
        activeTasks() {
            return this.tasks.filter(task => !task.is_completed);
        }
    },
    methods: {
        fetchTasks() {
            this.loading = true;
            axios.get('/tasks').then(response => {
                this.tasks = response.data;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        addTask() {
            if (this.newTask && !this.tasks.some(task => task.task === this.newTask)) {
                this.loading = true;
                axios.post('/tasks', { task: this.newTask }).then(response => {
                    this.tasks.push(response.data);
                    this.newTask = '';
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                });
            }
        },
        toggleTask(id, isCompleted) {
            this.loading = true;
            axios.put(`/tasks/${id}`, { is_completed: !isCompleted }).then(response => {
                const task = this.tasks.find(t => t.id === id);
                task.is_completed = !isCompleted;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        toggleView() {
            // Toggle between showing all tasks or only active tasks
            this.showAll = !this.showAll;
        },
        confirmDelete(id) {
            this.taskToDelete = id;
            this.deleteModal.show();
        },
        deleteTask() {
            axios.delete(`/tasks/${this.taskToDelete}`).then(response => {
                this.tasks = this.tasks.filter(t => t.id !== this.taskToDelete);
                this.taskToDelete = null;
                this.deleteModal.hide();
            });
        }
    },
    mounted() {
        this.fetchTasks();
        this.deleteModal = new Modal(document.getElementById('deleteModal'));
    }
}

</script>

<style scoped>
 ul {
    list-style-type: none;
}

.full-screen-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050; /* Make sure it's above other elements */
}

input[type="checkbox"] {
    cursor: pointer;
}
</style>
