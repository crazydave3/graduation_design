import requests from "./request";

//人脸识别
export const SetAndGetFace = (params) => requests({
    url: `/v1/merge?access_token=25.93403fb009a5e64f6b531a027b44097e.315360000.1995096874.282335-27973027`,
    method: "post",
    data: params
})

//创建用户组
export const CreateGroup = (group_id) => requests({
    url: `/v3/faceset/group/add?access_token=24.b35797b9a33f0bde7326ab82ed339e4c.2592000.1682433318.282335-31686314`,
    method: "post",
    data: group_id
})

//人脸注册
export const SetFace = (params) => requests({
    url: `https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add?access_token=24.b35797b9a33f0bde7326ab82ed339e4c.2592000.1682433318.282335-31686314`,
    method: "post",
    data: params
})