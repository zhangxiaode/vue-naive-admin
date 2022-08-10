import request from "@/utils/request";
// 获取七牛云上传凭证
export function getUploadToken() {
  return request({
    url: `/common/getUploadToken`,
    method: "get",
  });
}

// 登录
export function login(data: any) {
  return request({
    url: `/user/admin/login`,
    method: "post",
    data,
  });
}

// 创建活动
export function createActivity(data: any) {
  return request({
    url: `/activity/create`,
    method: "post",
    data,
  });
}

// 更新活动
export function putActivity(data: any) {
  return request({
    url: `/activity/${data.id}`,
    method: "put",
    data,
  });
}

// 活动列表
export function getActivity(params: any) {
  return request({
    url: `/activity/list`,
    method: "get",
    params
  });
}

// 活动详情
export function getActivityDetail(params: any) {
  return request({
    url: `/activity/${params.id}`,
    method: "get",
  });
}

// 核销列表
export function getCodeList(params: any) {
  return request({
    url: `/awardCode/list`,
    method: "get",
    params,
  });
}

// 核销
export function verifyDestroy(data: any) {
  return request({
    url: `/awardCode/verifyDestroy`,
    method: "post",
    data,
  });
}

// 标记核销状态
export function turnVerifyDestroyState(data: any) {
  return request({
    url: `/activity/${data.id}/turnVerifyDestroyState`,
    method: "put",
    data,
  });
}

// 标记核销状态
export function patchawardCode(data: any) {
  return request({
    url: `/awardCode/${data.id}`,
    method: "patch",
    data,
  });
}
