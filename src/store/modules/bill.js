const state = {
    multipleSelection: [],
    moveSelection: []
}

const mutations = {
    ADD_SELECTION: (state, list) => {
        state.multipleSelection = list
    },
    CLEAR_SELECTION: (state, list) => {
        state.multipleSelection = []
    },
    DELETE_SELECTION: (state, index) => {
        state.multipleSelection.splice(index, 1)
    },
    ADD_MOVE: (state, list) => {
        state.moveSelection = list
    },
    CLEAR_MOVE: (state, list) => {
        state.moveSelection = []
    },
    DELETE_MOVE: (state, index) => {
        state.moveSelection.splice(index, 1)
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
    },
    addMove({ commit }, list) {
        commit('ADD_MOVE', list)
    },
    clearMove({ commit }, list) {
        commit('CLEAR_MOVE', list)
    },
    deleteMove({ commit }, index) {
        commit('DELETE_MOVE', index)
    }
}

export default {
    state,
    mutations,
    actions
}
