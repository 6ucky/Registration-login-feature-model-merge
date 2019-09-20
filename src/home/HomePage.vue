<template>
    <div>
        <h1>Hi {{account.user.firstName}}!</h1>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th scope="col">R1</th>
                    <th scope="col">R2</th>
                    <th scope="col">R3</th>
                    <th scope="col">R4</th>
                    <th scope="col">R5</th>
                    <th scope="col">Status</th>
                    <th scope="col">Role</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <i :class="[account.user.r1?'fas fa-check':'fas fa-times']"></i>
                    </td>
                    <td>
                        <i :class="[account.user.r2?'fas fa-check':'fas fa-times']"></i>
                    </td>
                    <td>
                        <i :class="[account.user.r3?'fas fa-check':'fas fa-times']"></i>
                    </td>
                    <td>
                        <i :class="[account.user.r4?'fas fa-check':'fas fa-times']"></i>
                    </td>
                    <td>
                        <i :class="[account.user.r5?'fas fa-check':'fas fa-times']"></i>
                    </td>
                    <td>{{account.user.status}}</td>
                    <td>{{account.user.role}}</td>
                </tr>
            </tbody>
        </table>
        <div>
            <label >Please Upload your Feature Model </label>
            <input type="file" @change="processFile($event)">
        </div>
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

<style scoped>

</style>