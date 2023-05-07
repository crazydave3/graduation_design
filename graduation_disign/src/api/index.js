import requests from "./request";

//人脸识别
export const IdentifyFace = (params) => requests({
    url: `/face/v3/search?access_token=24.680299cd20ecc0f8ba70ce53929c5070.2592000.1685803531.282335-31686314`,
    method: "post",
    data: params
})

//查找罪犯
export const FindCriminal = (params) => requests({
    url: `/face/v3/multi-search?access_token=24.680299cd20ecc0f8ba70ce53929c5070.2592000.1685803531.282335-31686314`,
    method: "post",
    data: params
})

//创建用户组
export const CreateGroup = (group_id) => requests({
    url: `/face/v3/faceset/group/add?access_token=24.680299cd20ecc0f8ba70ce53929c5070.2592000.1685803531.282335-31686314`,
    method: "post",
    data: group_id
})

//人脸注册
export const SetFace = (params) => requests({
    url: `/face/v3/faceset/user/add?access_token=24.680299cd20ecc0f8ba70ce53929c5070.2592000.1685803531.282335-31686314`,
    method: "post",
    data: params
})

//监控人流
export const CountPerson = (params) => requests({
    url: `/image-classify/v1/body_num?access_token=24.682e5981a8ea588b7b771e951f30e0a4.2592000.1685803626.282335-30709565`,
    method: "post",
    data: params
})