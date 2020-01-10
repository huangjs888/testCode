import fetch from 'isomorphic-fetch';
import fetchJsonp from 'fetch-jsonp';
import querystring from 'querystring';

export const request = function(url, options) {
    options = Object.assign({
        method: 'GET',
        jsonp: false,
        timeout:30000,
        body:{}
    }, options);
    let { jsonp: isCrossDomain, body, ...others } = options;
    const newOptions = { credentials: 'include', ...others };
    newOptions.method = newOptions.method.toLocaleUpperCase();
    if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
        newOptions.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            ...newOptions.headers
        };
        newOptions.body =  querystring.stringify(body);
    }else if(newOptions.method === 'GET' || newOptions.method === 'HEAD'){
        if (typeof url === 'string') {
            url = `${url}${url.indexOf('?')!==-1?'&':'?'}${querystring.stringify(body)}`;
        }
    }
    let fetchPromise;
    if (isCrossDomain) {
        if (typeof url !== 'string') {
            url = !url.search ? url.href : `${url.href}?${url.search}`;
        }
        fetchPromise = fetchJsonp(url, newOptions);
    } else fetchPromise = fetch(url, newOptions);

    return fetchPromise.then(response => {
        if ((isCrossDomain && response.ok) || (response.status >= 200 && response.status < 300)) {
            return response;
        }
        let errMsg = '';
        switch (response.statusText) {
            case 400:
                errMsg = '请求错误';
                break;
            case 403:
                errMsg = '请求被禁止';
                break;
            case 404:
                errMsg = '请求接口不存在';
                break;
            case 408:
                errMsg = '请求超时';
                break;
            case 500:
                errMsg = '服务器内部错误';
                break;
            case 502:
                errMsg = '网关错误';
                break;
            case 503:
                errMsg = '请求的服务被暂停';
                break;
            case 504:
                errMsg = '网关超时';
                break;
            default:
                errMsg = '未知网络错误';
        }
        const error = new Error(`${response.statusText}:${errMsg}`);
        error.code = -2;
        error.response = response;
        throw error;
    }).then(response => response.json()).then(result => {
        return result;
    }).catch((error) => {
        console.log(`请求错误: ${error.message}`);
        console.log(`错误对象:`);
        console.dir(error);
        if(error.code!==-1 && error.code!==-2){
            error.message = '网络或数据错误';
        }
        throw error;
    });
};
