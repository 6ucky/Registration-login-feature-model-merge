import { userService } from '../_services';
const user = JSON.parse(localStorage.getItem('user'));

const actions = {
    new_model({ dispatch, commit }, {modelname,xml,id}) {
        userService.addmodel(user,modelname,xml,id);
    },
    addselections({ dispatch, commit }, {id ,selected_list, name}) {
        userService.addselections(id, selected_list, name);
    }
};

export const model = {
    actions
};