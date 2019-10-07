import { userService } from '../_services';
const user = JSON.parse(localStorage.getItem('user'));

const actions = {
    new_model({ dispatch, commit }, {modelname,xml,id}) {
        userService.addmodel(user,modelname,xml,id);
    },
    addselections({ dispatch, commit }, {id ,selected_list, selected_list_name, name}) {
        userService.addselections(id, selected_list, selected_list_name, name);
    },
    user_new_model({ dispatch, commit }, {modelname,id})
    {
        userService.usernewmodel(modelname, id);
    }
};

export const model = {
    namespaced: true,
    actions
};