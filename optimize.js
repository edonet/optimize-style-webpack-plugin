/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-07-22 16:16:48
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const browserslist = require('browserslist');


/**
 *****************************************
 * 浏览器默认配置
 *****************************************
 */
browserslist.defaults = [
    'ie >= 9',
    'Chrome >= 50',
    'ff >= 50',
    'iOS >= 6',
    'Android >= 4.0'
];


/**
 *****************************************
 * 创建处理器
 *****************************************
 */
module.exports = (options = {}) => {
    return postcss([
        cssnano(options.cssnano), autoprefixer(options.autoprefixer)
    ]);
};
