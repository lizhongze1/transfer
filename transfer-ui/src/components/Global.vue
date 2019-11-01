<!--
 * @Descripttion: 用于定义全局变量
 * @Author: lip
 * @Date: 2019-07-29 09:42:18
 * @LastEditors: lip
 * @LastEditTime: 2019-07-29 13:47:44
 -->
<template>
  <div />
</template>
<script>
import config from '../../public/staticConfig.js'
// nginx地址
const NGINXURL = config.config.NGINXURL
// 数科地址
const SKURL = config.config.SKURL
export default {
  NGINXURL,
  SKURL
}
</script>
