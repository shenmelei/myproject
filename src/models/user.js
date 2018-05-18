import { Modal } from 'antd';
import { queryCurrent, queryPermission, logout, healthCheck } from '../services/user';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
    permission: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response && response.success) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });

        return response.data;
      }

      return false;
    },
    *fetchPermission(_, { call, put }) {
      const response = yield call(queryPermission);
      if (response && response.success && response.data) {
        yield put({
          type: 'savePermission',
          payload: response.data.reduce((data, name) => ({ ...data, [name]: true }), {}),
        });
      }
    },
    *logout(_, { call }) {
      const response = yield call(logout);
      if (process.env.NODE_ENV === 'development') {
        console.log('已退出登录，准备跳转');
      } else if (response && response.success) {
        window.location.href = response.data;
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    savePermission(state, action) {
      return {
        ...state,
        permission: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      let INT_HEALTH;

      const intervalCheckHealth = () => {
        healthCheck().then((res) => {
          if (!res.data) {
            Modal.info({
              title: '登录状态已超时',
              content: '请重新登录',
              onOk: () => {
                dispatch({
                  type: 'logout',
                });
              },
            });
            if (INT_HEALTH) {
              clearTimeout(INT_HEALTH);
            }
          } else {
            setTimeout(intervalCheckHealth, 1000 * 5 * 60);
          }
        });
      };

      return history.listen(() => {
        clearTimeout(INT_HEALTH);
        intervalCheckHealth();
      });
    },
  },
};
