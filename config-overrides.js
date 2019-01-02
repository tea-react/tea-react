const fs = require('fs')
const path = require('path')
const { injectBabelPlugin } = require('react-app-rewired')
const rewireEslint = require('react-app-rewire-eslint');

module.exports = {
    webpack: function (config, env) {
        // 支持装饰器
        config = injectBabelPlugin('transform-decorators-legacy', config)
        // 重置eslint配置
        config = rewireEslint(config, env, options => {
            return options
        })
        // 设置src路径别名
        config.resolve = {
            alias: {
                'src': path.resolve(__dirname, './src'),
                'components': path.resolve(__dirname, './src/components/'),
                'utils': path.resolve(__dirname, './src/utils'),
            }
        }
        if (env === 'production') {
        }
        return config
    },
    devServer: function (configFunction) {
        return function (proxy, allowedHost) {
            const config = configFunction(proxy, allowedHost)
            return config
        }
    }
}
