/*
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-08-14 15:59:27
 * @LastEditors: lip
 * @LastEditTime: 2019-08-23 15:21:41
 */
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import zh from 'vee-validate/dist/locale/zh_CN' // 引入中文文件
// 自定义规则
import Validator from './ customValidate'
// 配置中文
Validator.localize(zh)

// 自定义validate
const dictionary = {
  zh_CN: {
    messages: {
      trueNum: function() { return '只能填写正整数' },
      Num: function() { return '只能填写整数' },
      required: (field) => '请输入' + field,
      after: (field) => field + '应晚于有效期起始',
      IDCard: (field) => '请输入正确的证件信息',
      SocCard: (field) => '请输入正确统一社会认证代码'

    },
    attributes: {
      collectNum: '采集总量',
      perLimit: '每一次采集量',
      beginIndex: '采集起始坐标',
      endTime: '有效期（截止）',
      editendTime: '有效期（截止）'
    }
  }
}

Validator.localize(dictionary)

const config = {
  locale: 'zh_CN',
  events: 'change',
  fieldsBagName: 'vee-fields'
  // errorBagName: 'errors'
  // delay: 0,
  // messages: null,
  // strict: true,
  // inject: true
}

Vue.use(VeeValidate, config)
