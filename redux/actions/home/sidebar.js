import { 
    GET_FORMS,
    UPDATE_GROUPS,
    ERROR 
} from 'redux/types';
import agent from 'redux/agent'


const onGetForms = () => {
    return async (dispatch) => {
        let response = await agent.HOME.getForms()
        dispatch({type: (response.status === 200) ? GET_FORMS : ERROR, payload: response.data});
    };
};

const onGetUpdateForms = () => {
    return async (dispatch) => {
        let response = await agent.HOME.getUpdateForms()
        dispatch({ type: UPDATE_GROUPS, payload: response.data.data })
    }
}

const onCreateOrUpdateGroup = (body, index) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.sidebar.update
        agent.HOME.updateGroup(body, body.id)
        stateData[index] = body
        dispatch({ type: UPDATE_GROUPS, payload: stateData })
    }
} 

const onReorderGroup = (movedGroup, movedIndex, targetGroup, targetIndex) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.sidebar.update

        stateData[targetIndex] = movedGroup
        stateData[movedIndex] = targetGroup
        
        //recount order
        stateData.map((group, index) => {
            group.order = index
            if ([movedGroup.id, targetGroup.id].includes(group.id)) {
                agent.HOME.updateGroup(group, group.id)
            }
        });

        dispatch({ type: UPDATE_GROUPS, payload: stateData })
    }
}

const onCreateOrUpdateForm = (body, groupIndex, index) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.sidebar.update

        if (body.id === null){
            let response = await agent.HOME.createForm(body, body.group)
            body = response.data.data
        } else {
            agent.HOME.updateForm(body, body.group, body.id)
        }

        stateData[groupIndex].form_group[index] = body


        dispatch({ type: UPDATE_GROUPS, payload: stateData })
    }
}

const onRemoveForm = (body, groupIndex, index) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.sidebar.update

        if (body.id !== null){ 
            agent.HOME.removeForm(body.group, body.id)
        }

        stateData[groupIndex].form_group.splice(index, 1)

        dispatch({ type: UPDATE_GROUPS, payload: stateData })
    }
}


const onReorderForm = (movedForm, movedIndex, groupMovedIndex, targetForm, targetIndex, groupTargetIndex) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.sidebar.update
        
        // make a copy of the data, in default it`s just a reference
        const movedFormGroup = JSON.parse(JSON.stringify(form.group))
        const targetFormGroup = JSON.parse(JSON.stringify(form.group))

        movedForm.group = stateData[groupTargetIndex].id
        targetForm.group = stateData[groupMovedIndex].id

        stateData[groupTargetIndex].form_group[targetIndex] = movedForm;
        stateData[groupMovedIndex].form_group[movedIndex] = targetForm;

        // recount order
        // The groupTargetIndex object now holds the movedForm, so we need to pass the original movedFormGroup on this iteration.
        // Same on groupMovedIndex.
        [[groupTargetIndex, movedFormGroup], [groupMovedIndex, targetFormGroup]].forEach(([groupIndex, originalGroupId])=>{
            stateData[groupIndex].form_group.map((form, index) => {
                form.order = index
                if ([movedForm.id, targetForm.id].includes(form.id)) {
                    agent.HOME.updateForm(form, originalGroupId, form.id)
                }
            })
        })

        dispatch({ type: UPDATE_GROUPS, payload: stateData })        
    }
}


const onAddNewForm = (body, groupIndex) => {
    return async (dispatch, getState) => {
        let stateData = getState().home.sidebar.update

        stateData[groupIndex].form_group.splice(0, 0, body)

        // recount order
        stateData[groupIndex].form_group.map((form, index) => {
            form.order = index
        })

        dispatch({ type: UPDATE_GROUPS, payload: stateData })
    }
}

export default {
    onGetForms,
    onGetUpdateForms,
    onCreateOrUpdateGroup,
    onReorderGroup,
    onCreateOrUpdateForm,
    onRemoveForm,
    onReorderForm,
    onAddNewForm
};