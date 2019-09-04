/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-07-28 13:01:31
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载代码
 *****************************************
 */
module.exports = function loader(source) {
    let { handler } = this.query;

    // 执行处理函数
    if (typeof handler === 'function') {
        let result = handler.apply(this, arguments) || source;

        // 处理异步
        if (result instanceof Promise) {
            let callback = this.async();

            // 添加异步回调
            result.then(
                code => callback(null, code || source),
                err => callback(err)
            );

            // 退出
            return;
        }

        // 返回结果
        return result;
    }

    // 返回代码
    return source;
};
