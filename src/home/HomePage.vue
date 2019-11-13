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
        <subcotalogue></subcotalogue>
        <p>
            <router-link to="/login">Logout</router-link>
        </p>
    </div>
</template>

<script>
import { mapState} from 'vuex'
import subcotalogue from './sub_cotalogue.vue'

export default {
    components:{
        subcotalogue,
    },
    computed: {
        ...mapState({
            account: state => state.account
        })
    }
};
</script>

<style scoped>

</style>