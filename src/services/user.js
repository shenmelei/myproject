import request from '../utils/request';

export async function queryCurrent() {
  return request('/auth-web/CurrentUser/Info', {
    method: 'POST',
  });
}

export async function queryPermission() {
  return request('/auth-web/CurrentUser/Permission', {
    method: 'POST',
  });
}

export async function logout() {
  return request('/auth-web/logout', {
    method: 'POST',
  });
}

export async function healthCheck() {
  return request('/auth-web/CurrentUser/HealthCheck', {
    method: 'POST',
  });
}
