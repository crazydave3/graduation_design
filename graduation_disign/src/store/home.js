import { IdentifyFace, SetFace } from "../api";

const state = {
    faceDate: []
};
const mutations = {
    GETFACE(state, faceDate) {
        state.faceDate = faceDate
    },
    SETFACE(state, faceDate) {
        console.log(1);
        state.faceDate = faceDate
    }

};
const actions = {
    async getFace({ commit }, params) {
        console.log(params);
        let result = await SetAndGetFace(params);
        if (result.code == 200) {
            commit("GETFACE", result.data)
        }
    },
    async setFace({ commit }, params) {
        let result = await SetFace(params);
        if (result.code == 200) {
            commit("SETFACE", result.data)
        } else {
            return Promise.reject(new Error('faile'))
        }
    }
};
const getters = {};
export default {
    state,
    mutations,
    actions,
    getters
}