import { 
    GET_FORMS,
    UPDATE_GROUPS,
    ERROR 
} from '../../types';
import agent from '../../agent'


const onGetForms = (source) => {
    return async (dispatch) => {
        try {
            let response = await agent.HOME.getForms(source)
            if (response && response.status === 200) {
                dispatch({type: GET_FORMS, payload: response.data})
            }
        } catch {}
    };
};

const onGetUpdateForms = () => {
    return async (dispatch) => {
        let response = await agent.HOME.getUpdateForms()
        if (response && response.status === 200) {
            dispatch({ type: UPDATE_GROUPS, payload: response.data.data })
        }
    }
}

const onChangeGroupState = (groupsData) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_GROUPS, payload: groupsData })
    }
}

const onUpdateGroup = (body) => {
    return async (_) => {
        agent.HOME.updateGroup(body, body.id)
    }
} 


/*********
 *       *
 * FORMS *
 *       *
 *********/
const onCreateFormulary = (body, groupIndex, formIndex) => {
    return (dispatch, getState) => {
        let stateData = getState().home.sidebar.update
        if (body.id !== -1) {
            agent.HOME.createForm(body).then(response=> {
                if(response.status === 200) {
                    stateData[groupIndex].form_group[formIndex] = response.data.data
                } else {
                    stateData[groupIndex].form_group[formIndex].id = null
                }
                dispatch({ type: UPDATE_GROUPS, payload: stateData })
            })
        } 
        if (body.id === null) {
            stateData[groupIndex].form_group[formIndex].id = -1
            dispatch({ type: UPDATE_GROUPS, payload: stateData })
        }
    }
}

const onUpdateFormulary = (body, formId) => {
    return (_) => {
        agent.HOME.updateForm(body, formId)
    }
}

const onRemoveFormulary = (formId) => {
    return (_) => {
        agent.HOME.removeForm(formId)
    }
}

/*
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
                    agent.HOME.updateForm(form, form.id)
                }
            })
        })

        dispatch({ type: UPDATE_GROUPS, payload: stateData })        
    }
}*/


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
    onChangeGroupState,
    onUpdateGroup,
    onCreateFormulary,
    onUpdateFormulary,
    onRemoveFormulary,
    onAddNewForm
};