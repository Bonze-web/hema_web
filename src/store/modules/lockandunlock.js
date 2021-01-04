// 锁定解锁管理
const state = {
    billType: '', // 解锁锁定类型
    multipleSelection: []
}

const mutations = {
    ADD_SELECTION: (state, list) => {
        state.multipleSelection = state.multipleSelection.concat(list)
    },
    SET_BILL_TYPE: (state, billType) => {
        state.billType = billType
    },
    DELETE_SELECTION: (state, index) => {
        state.multipleSelection.splice(index, 1)
    }
}

const actions = {
    addSelection({ commit }, list) {
        commit('ADD_SELECTION', list)
    },
    setBillType({ commit }, billType) {
        commit('SET_BILL_TYPE', billType)
    },
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
