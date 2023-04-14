import requests from "./request";

//人脸识别
export const IdentifyFace = (params) => requests({
    url: `/face/v3/search?access_token=24.b35797b9a33f0bde7326ab82ed339e4c.2592000.1682433318.282335-31686314`,
    method: "post",
    data: params
})

//查找罪犯
export const FindCriminal = (params) => requests({
    url: `/facev3/multi-search?access_token=24.b35797b9a33f0bde7326ab82ed339e4c.2592000.1682433318.282335-31686314`,
    method: "post",
    data: params
})

//创建用户组
export const CreateGroup = (group_id) => requests({
    url: `/face/v3/faceset/group/add?access_token=24.b35797b9a33f0bde7326ab82ed339e4c.2592000.1682433318.282335-31686314`,
    method: "post",
    data: group_id
})

//人脸注册
export const SetFace = (params) => requests({
    url: `/face/v3/faceset/user/add?access_token=24.b35797b9a33f0bde7326ab82ed339e4c.2592000.1682433318.282335-31686314`,
    method: "post",
    data: params
})

//监控人流
export const CountPerson = (params) => requests({
    url: `/image-classify/v1/body_num?access_token=24.7908ce567b1c1e1c938032e59f1035bb.2592000.1683273560.282335-30709565`,
    method: "post",
    data: params
})