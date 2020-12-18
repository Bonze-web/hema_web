import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import UserService from '@/api/service/UserService'

/**
 * 用来刷新令牌的定时器
 */
var refreshTokenTimer = null;

/**
 * 刷新令牌
 * @param {*} refreshToken 
 * @param {*} timeout 
 */
function async_refresh_access_token(refreshToken, timeout) {
  clear_refresh_token_timer();
  return new Promise((resolve, reject) => {
    refreshTokenTimer = setTimeout(() => {
      UserService.refreshToken(refreshToken)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        })
    }, timeout);
  });
}

function clear_refresh_token_timer() {
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer);
    refreshTokenTimer = null;
  }
}

const user = {
  state: {
    token: getToken(),
    // 这里也可以将user放到cookie中,就不用每次刷新从服务器取当前用户了
    user: null
  },

  getters: {

    /**
     * 是否有指定的权限 
     * 
     * @param permId 权限代码
     */
    hasPermission: (state) => (permId) => {
      var perms = state.user ? state.user.permissions : [];
      return perms.some(perm => (perm === permId) || perm.indexOf(permId + ":") === 0);
    },

    /**
     * 是否拥有全部指定的权限
     * 
     * @param perms 权限列表
     */
    hasAllPermissions: (state, getters) => (...perms) => {
      if (!perms) {
        return false;
      }
      for (var perm of perms) {
        if (!getters.hasPermission(perm)) {
          return false;
        }
      }
      return true;
    },

    /**
     * 拥有任意一个权限就返回true
     * 
     * @params perms 权限列表 
     */
    hasOnePermission: (state, getters) => (...perms) => {
      if (!perms) {
        return false;
      }
      for (var perm of perms) {
        if (getters.hasPermission(perm)) {
          return true;
        }
      }
      return false;
    }

  },

  mutations: {
    SET_TOKEN: (state, token) => {
      if (token) {
        setToken(token)
      } else {
        removeToken()
      }
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user;
    }
  },

  actions: {

    /**
     * 登录
     */
    Login({
      dispatch,
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        UserService.login(userInfo.username, userInfo.password)
          .then(resp => {
            commit('SET_TOKEN', resp.accessToken);
            // dispatch("RefreshToken", resp);
            resolve(resp);
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    /**
     * 获取用户信息
     * @param {*} param0 
     */
    GetUserInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        UserService.getLoginUser().then(user => {
          commit('SET_USER', user)
          resolve(user);
        }).catch(error => {
          reject(error)
        })
      })
    },

    /**
     * 登出
     * @param {*} param0 
     */
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        clear_refresh_token_timer();
        UserService.logout()
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_USER', null)
            resolve()
          })
          .catch(() => {
            commit('SET_TOKEN', '')
            commit('SET_USER', null)
            resolve()
          });
      })
    },

    /**
     * 前端登出
     * @param {*} param0 
     */
    FedLogOut({
      commit
    }) {
      clear_refresh_token_timer();
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        resolve()
      })
    },

    /**
     * 刷新令牌
     * @param {*} param0 
     * @param {*} refreshToken 
     * @param int timeout
     */
    RefreshToken({
      dispatch,
      commit
    }, data) {
      console.log("刷新令牌=" + data.refreshToken + ",timeout=" + data.expiresIn);
      async_refresh_access_token(data.refreshToken, parseInt(data.expiresIn) * 1000)
        .then(data => {
          commit('SET_TOKEN', data.accessToken);
          dispatch('RefreshToken', data);
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

}

export default user
