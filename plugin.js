/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-07-13 23:43:05
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const optimize = require('@airb/style/optimize');
const { RawSource } = require('webpack-sources');


/**
 *****************************************
 * 资源插件
 *****************************************
 */
class OptimizeStyleWebpackPlugin {

    /* 初始化对象 */
    constructor(options) {

        // 定义描述
        this.descriptor = {
            name: 'optimize-style-webpack-plugin'
        };

        // 创建处理器
        this.processer = optimize(options);
    }

    /* 执行插件 */
    apply(compiler) {

        // 处理资源
        compiler.hooks.compilation.tap(this.descriptor, compilation => {

            // 优化片段
            compilation.hooks.optimizeChunkAssets.tapPromise(
                this.descriptor,
                chunks => this.process(chunks, compilation)
                );

            // 优化资源
            compilation.hooks.optimizeAssets.tapPromise(
                this.descriptor,
                assets => this.process(assets, compilation)
            );
        });
    }

    /* 执行处理 */
    process(assets, compilation) {
        return Promise.all(
            Object.keys(assets).map(async key => {
                if (key.endsWith('.css')) {
                    let asset = assets[key],
                        result = await this.processer.process(asset.source(), { from: key, to: key });

                    // 更新资源
                    compilation.assets[key] = new RawSource(result.css);
                }
            })
        );
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = OptimizeStyleWebpackPlugin;
