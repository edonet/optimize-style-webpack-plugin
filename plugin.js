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
const path = require('path');
const match = require('@airb/style/match');
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

        // 缓存配置
        this.options = { ...options };

        // 定义描述
        this.descriptor = {
            name: 'optimize-style-webpack-plugin'
        };

        // 创建处理器
        this.processer = optimize(this.options);
    }

    /* 执行插件 */
    apply(compiler) {
        let loader = path.resolve(__dirname, './loader.js'),
            rules = compiler.options.module.rules;

        // 添加前置勾子
        if (this.options.beforeCompile) {
            rules.push({
                test: match,
                loader,
                options: {
                    handler: this.options.beforeCompile
                }
            });
        }

        // 添后置勾子
        if (this.options.afterCompile) {
            rules.unshift({
                test: match,
                loader,
                options: {
                    handler: this.options.afterCompile
                }
            });
        }

        // 处理资源
        compiler.hooks.compilation.tap(this.descriptor, compilation => {

            // 优化片段
            compilation.hooks.optimizeChunkAssets.tapPromise(
                this.descriptor,
                chunks => chunks && this.process(chunks, compilation)
                );

            // 优化资源
            compilation.hooks.optimizeAssets.tapPromise(
                this.descriptor,
                assets => assets && this.process(assets, compilation)
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
