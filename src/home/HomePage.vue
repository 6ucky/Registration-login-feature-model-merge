<template>
    <div>
        <h1>Hi {{account.user.firstName}}!</h1>
        <p>r1: {{account.user.r1}}</p>
        <p>r2: {{account.user.r2}}</p>
        <p>r3: {{account.user.r3}}</p>
        <p>r4: {{account.user.r4}}</p>
        <p>r5: {{account.user.r5}}</p>
        <p>Status: {{account.user.status}}</p>
        <p>Role: {{account.user.role}}</p>
        <div>
            <label >Please Upload your Feature Model </label>
            <input type="file" @change="processFile($event)">
        </div>
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
        <subcotalogue></subcotalogue>
        <p>
            <router-link to="/login">Logout</router-link>
        </p>
    </div>
</template>

<script>
import Bus from '../_helpers/bus.js'
import xml2json from '../_helpers/xml2json.js'
import { mapState, mapActions } from 'vuex'
import subcotalogue from './sub_cotalogue.vue'

export default {
    components:{
        subcotalogue,
    },
    computed: {
        ...mapState({
            account: state => state.account,
            users: state => state.users.all
        })
    },
    created () {
        this.getAllUsers();
        console.log(this.account.user);
    },
    methods: {
        ...mapActions('users', {
            getAllUsers: 'getAll',
            deleteUser: 'delete'
        }),
        processFile(event) {
            this.initlevel = 0;
            var xmlDoc = '';
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.onload = function(event) {
                //console.log(event.target.result);
                xmlDoc = (new DOMParser()).parseFromString(event.target.result,"text/xml");
                var xmlobject = JSON.parse(xml2json(xmlDoc,''));
                Bus.$emit('getxml',xmlobject);
            };
            reader.readAsText(file);
        }
    }
};
</script>