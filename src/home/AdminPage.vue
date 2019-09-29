<template>
    <div>
        <h3>Users from secure api end point:</h3>
        <em v-if="users.loading">Loading users...</em>
        <span v-if="users.error" class="text-danger">ERROR: {{users.error}}</span>
        <ul v-if="users.items">
            <li v-for="user in users.items" :key="user.id">
                {{user.firstName + ' ' + user.lastName}}
                <span v-if="user.deleting"><em> - Deleting...</em></span>
                <span v-else-if="user.deleteError" class="text-danger"> - ERROR: {{user.deleteError}}</span>
                <span v-else> - <a @click="deleteUser(user.id)" class="text-danger">Delete</a></span>
            </li>
        </ul>
        <h3>Models from secure api end point:</h3>
        <em v-if="models.loading">Loading models...</em>
        <span v-if="models.error" class="text-danger">ERROR: {{models.error}}</span>
        <ul v-if="models.items">
            <li v-for="model in models.items" :key="model.id">
                {{model.firstName + ' ' + model.lastName}}
                <span v-if="model.deleting"><em> - Deleting...</em></span>
                <span v-else-if="model.deleteError" class="text-danger"> - ERROR: {{model.deleteError}}</span>
                <span v-else> - <a @click="deleteModel(model.id)" class="text-danger">Delete</a></span>
            </li>
        </ul>
        <p>
            <router-link to="/login">Logout</router-link>
        </p>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState({
            users: state => state.users.all,
            models: state => state.models.all
        })
    },
    created () {
        this.getAllUsers();
        this.getAllModels();
    },
    methods: {
        ...mapActions(['users', {
            getAllUsers: 'getAll',
            deleteUser: 'delete'
        }]),
        ...mapActions('models', {
            getAllModels: 'getAll',
            deleteModel: 'delete'
        })
    }
};
</script>