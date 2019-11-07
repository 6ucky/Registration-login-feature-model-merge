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
                                    <th scope="col">Disselections</th>
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
                                    <td>
                                        {{getdisselections(user.model_selections)}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="startmerge()">Start merge</button>
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
import axios from "axios";
import { mapState, mapActions } from 'vuex'

export default {
    data (){
        return{
            currentmodelname:'',
            conflict_results:[]
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
            if(model_selections !== undefined)
            {
                for(let i = 0; i < model_selections.length; i++)
                {
                    if(model_selections[i].name === this.currentmodelname)
                        return model_selections[i].selections_name;
                }
            }
            return '';
        },
        getdisselections(model_selections){
            if(model_selections !== undefined)
            {
                for(let i = 0; i < model_selections.length; i++)
                {
                    if(model_selections[i].name === this.currentmodelname)
                        return model_selections[i].disselections_name;
                }
            }
            return '';
        },
        startmerge(){
            this.conflict_results = [];
            let select_list = [];
            let unselect_list = [];
            for(let i = 0; i < this.users.items.length; i++)
            {
                for(let j = 0; j < this.users.items[i].model_selections.length; j++)
                {
                    if(this.users.items[i].model_selections[j].name === this.currentmodelname)
                    {
                        for(let k = 0; k < this.users.items[i].model_selections[j].selections_name.length; k++)
                        {
                            if(!select_list.includes(this.users.items[i].model_selections[j].selections_name[k]))
                                select_list.push(this.users.items[i].model_selections[j].selections_name[k]);
                        }
                        for(let k = 0; k < this.users.items[i].model_selections[j].disselections_name.length; k++)
                        {
                            if(!unselect_list.includes(this.users.items[i].model_selections[j].disselections_name[k]))
                                unselect_list.push(this.users.items[i].model_selections[j].disselections_name[k]);
                        }
                    }
                }
            }
            let data = [];
            let xmlobject = {};
            for(let i = 0; i < this.models.items.length; i++)
            {
                if(this.models.items[i].modelname === this.currentmodelname)
                {
                    data = this.models.items[i].data;
                    xmlobject = this.models.items[i].xml;
                }
            }
            for(let i = 0; i < data.length; i++)
            {
                if(data[i].data.type === 'alt')
                {
                    if(this.getxorconflicts(data,data[i].data.nodeId,select_list) !== null)
                        this.conflict_results.push(this.getxorconflicts(data,data[i].data.nodeId,select_list));
                }
            }
            let rel_lists = ['rel_abstract_root','rel_abstract_abstract','rel_concrete_root','rel_concrete_abstract','rel_concrete_concrete'];
			for(let x = 0; x < rel_lists.length; x++)
			{
				if(xmlobject.mxGraphModel.root[rel_lists[x]] !== undefined)
				{
					if(Array.isArray(xmlobject.mxGraphModel.root[rel_lists[x]]))
					{
						for(let i = 0; i < xmlobject.mxGraphModel.root[rel_lists[x]].length; i++)
						{
							if(xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@parent'] === 'feature')
							{
								if(xmlobject.mxGraphModel.root[rel_lists[x]][i]['@relType'] === 'requires')
								{
                                    let source = '';
                                    let target = '';
									for(let k = 0; k < data.length; k++)
									{
                                        if(xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@source'] === data[k].data.nodeId)
										{
											source = data[k].data.nodeName;	
										}
										if(xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@target'] === data[k].data.nodeId)
										{
											target = data[k].data.nodeName;	
										}
                                    }
                                    if(select_list.includes(source) && unselect_list.includes(target))
                                    {
                                        let requires = [];
                                        requires.push(source);
                                        requires.push("! "+target);
                                        this.conflict_results.push(requires);
                                    }
                                }	
								else if(xmlobject.mxGraphModel.root[rel_lists[x]][i]['@relType'] === 'excludes')
								{
                                    let source = '';
                                    let target = '';
									for(let k = 0; k < data.length; k++)
									{
                                        if(xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@source'] === data[k].data.nodeId)
										{
											source = data[k].data.nodeName;	
										}
										if(xmlobject.mxGraphModel.root[rel_lists[x]][i].mxCell['@target'] === data[k].data.nodeId)
										{
											target = data[k].data.nodeName;	
										}
                                    }
                                    if(select_list.includes(source) && select_list.includes(target))
                                    {
                                        let requires = [];
                                        requires.push(source);
                                        requires.push(target);
                                        this.conflict_results.push(requires);
                                    }
								}
							}
						}
					}
				    else
					{
						if(xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@parent'] === 'feature')
						{
							if(xmlobject.mxGraphModel.root[rel_lists[x]]['@relType'] === 'requires')
							{
                                let source = '';
                                let target = '';
								for(let k = 0; k < data.length; k++)
								{
                                    if(xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@source'] === data[k].data.nodeId)
									{
										source = data[k].data.nodeName;	
									}
									if(xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@target'] === data[k].data.nodeId)
									{
										target = data[k].data.nodeName;	
									}
                                }
                                if(select_list.includes(source) && unselect_list.includes(target))
                                {
                                    let requires = [];
                                    requires.push(source);
                                    requires.push("! "+target);
                                    this.conflict_results.push(requires);
                                }
							}	
							else if(xmlobject.mxGraphModel.root[rel_lists[x]]['@relType'] === 'excludes')
							{
                                let source = '';
                                let target = '';
								for(let k = 0; k < data.length; k++)
								{
                                    if(xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@source'] === data[k].data.nodeId)
									{
										source = data[k].data.nodeName;	
									}
									if(xmlobject.mxGraphModel.root[rel_lists[x]].mxCell['@target'] === data[k].data.nodeId)
									{
										target = data[k].data.nodeName;	
									}
                                }
                                if(select_list.includes(source) && select_list.includes(target))
                                {
                                    let requires = [];
                                    requires.push(source);
                                    requires.push(target);
                                    this.conflict_results.push(requires);
                                }
							}
						}
					}
                }
            }
            if(this.conflict_results.length === 0)
                alert('No conflicts');
            else
                alert(JSON.stringify(this.conflict_results));
        },

        getxorconflicts(data, parentid, select_list)
        {
            let xorresults = [];
            for(let i = 0; i < data.length; i++)
            {
                if(data[i].data.parentId === parentid && select_list.includes(data[i].data.nodeName))
                    xorresults.push(data[i].data.nodeName);
            }
            if(xorresults.length < 2)
                return null;
            return xorresults;
        }
    }
};
</script>

<style scoped>
td {
  word-break: break-all;
}
</style>