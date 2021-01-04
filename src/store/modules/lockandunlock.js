// 锁定解锁管理
const state = {
    billType: '', // 解锁锁定类型
    multipleSelection: []
}

const mutations = {
    ADD_SELECTION: (state, list) => {
        state.multipleSelection = state.multipleSelection.concat(list)
    },
    DELETE_SELECTION: (state, index) => {
        state.multipleSelection.splice(index, 1)
    }
}

const actions = {
    addSelection({ commit }, list) {
        commit('ADD_SELECTION', list)
    },
    // clearSelection({ commit }, list) {
    //     commit('CLEAR_SELECTION', list)
    // },
    deleteSelection({ commit }, index) {
        commit('DELETE_SELECTION', index)
    }
    // addMove({ commit }, list) {
    //     commit('ADD_MOVE', list)
    // },
    // clearMove({ commit }, list) {
    //     commit('CLEAR_MOVE', list)
    // },
    // deleteMove({ commit }, index) {
    //     commit('DELETE_MOVE', index)
    // }
}

export default {
    state,
    mutations,
    actions
}
