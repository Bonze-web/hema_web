const state = {
    multipleSelection: []
}

const mutations = {
    ADD_SELECTION: (state, list) => {
        state.multipleSelection = state.multipleSelection.concat(list)
    },
    CLEAR_SELECTION: (state, list) => {
        state.multipleSelection = []
    },
    DELETE_SELECTION: (state, index) => {
        state.multipleSelection.splice(index, 1)
    }
}

const actions = {
    addSelection({ commit }, list) {
        commit('ADD_SELECTION', list)
    },
    clearSelection({ commit }, list) {
        commit('CLEAR_SELECTION', list)
    },
    deleteSelection({ commit }, index) {
        commit('DELETE_SELECTION', index)
    }
}

export default {
    state,
    mutations,
    actions
}
