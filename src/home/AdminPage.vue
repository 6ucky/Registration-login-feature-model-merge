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
                {{model.modelname}}
                <span v-if="model.deleting"><em> - Deleting...</em></span>
                <span v-if="model.merging"><em> - Merging...</em></span>
                <span v-else-if="model.deleteError" class="text-danger"> - ERROR: {{model.deleteError}}</span>
                <span v-else> 
                    -
                    <a @click="currentmodelname = model.modelname" class="text-danger" data-toggle="modal" data-target="#mergeModal">Merge</a>
                    - 
                    <a @click="deleteModel(model.id)" class="text-danger">Delete</a>
                </span>
            </li>
        </ul>
        <div class="modal fade" id="mergeModal" tabindex="-1" role="dialog" aria-labelledby="mergeModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="mergeModalTitle">Modal title</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">First Name</th>
                                    <th scope="col">Last Name</th>
                                    <th scope="col">R1</th>
                                    <th scope="col">R2</th>
                                    <th scope="col">R3</th>
                                    <th scope="col">R4</th>
                                    <th scope="col">R5</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Selections</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users.items" :key="user.id">
                                    <td>
                                        {{user.firstName}}
                                    </td>
                                    <td>
                                        {{user.lastName}}
                                    </td>
                                    <td>
                                        <i :class="[user.MCS.r1?'fas fa-check':'fas fa-times']"></i>
                                    </td>
                                    <td>
                                        <i :class="[user.MCS.r2?'fas fa-check':'fas fa-times']"></i>
                                    </td>
                                    <td>
                                        <i :class="[user.MCS.r3?'fas fa-check':'fas fa-times']"></i>
                                    </td>
                                    <td>
                                        <i :class="[user.MCS.r4?'fas fa-check':'fas fa-times']"></i>
                                    </td>
                                    <td>
                                        <i :class="[user.MCS.r5?'fas fa-check':'fas fa-times']"></i>
                                    </td>
                                    <td>{{user.status}}</td>
                                    <td>{{user.role}}</td>
                                    <td>
                                        {{getselections(user.model_selections)}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Start merge</button>
                    </div>
                </div>
            </div>
        </div>
        <p>
            <router-link to="/login">Logout</router-link>
        </p>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    data (){
        return{
            currentmodelname:''
        }
    },
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
        ...mapActions('users', {
            getAllUsers: 'getAll',
            deleteUser: 'delete'
        }),
        ...mapActions('models', {
            getAllModels: 'getAll',
            deleteModel: 'delete'
        }),
        getselections(model_selections){
            for(let i = 0; i < model_selections.length; i++)
            {
                if(model_selections[i].name === this.currentmodelname)
                    return model_selections[i].selections_name.toString();
            }
            return '';
        }
    }
};
</script>

<style scoped>
td {
  word-break: break-all;
}
</style>