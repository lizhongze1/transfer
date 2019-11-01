/*
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-08-23 10:35:12
 * @LastEditors: lip
 * @LastEditTime: 2019-08-23 10:46:04
 */
import { Validator } from 'vee-validate'
// 正整数验证
Validator.extend('trueNum', {
  getMessage: field => field + '只能输入正整数',
  validate: value => {
    return /^[1-9]\d*$/.test(value)
  }
})
// 整数验证
Validator.extend('Num', {
  getMessage: field => field + '只能输入整数',
  validate: value => {
    return /^[+]{0,1}(\d+)$/.test(value)
  }
})
// 身份证验证
Validator.extend('IDCard', {
  getMessage: field => field + '只能输入整数',
  validate: value => {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
  }
})
// 统一社会认证代码
Validator.extend('SocCard', {
  getMessage: field => field + '只能输入整数',
  validate: value => {
    return /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/g.test(value)
  }
})
export default Validator
