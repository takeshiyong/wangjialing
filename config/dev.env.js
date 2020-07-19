'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    //公司公共环境
    BASE_API: '"http://ksh.ikingtech.com/wjl"',
    // BASE_API: '"http://39.98.176.241:8888"',

})
