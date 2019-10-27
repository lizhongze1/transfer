package com.lzz.common.enums;

/* /**
　　* @description: 分词器类型
　　* @param ${tags}
　　* @return ${return_type}
　　* @throws
　　* @author lizz
　　* @date 2019/10/27 10:31
　　*/
public enum Analyzer {
    standard,//支持中文采用的方法为单字切分。他会将词汇单元转换成小写形式，并去除停用词和标点符号
    simple,//首先会通过非字母字符来分割文本信息，然后将词汇单元统一为小写形式。该分析器会去掉数字类型的字符
    whitespace,//仅仅是去除空格，对字符没有lowcase化,不支持中文
    stop,//StopAnalyzer的功能超越了SimpleAnalyzer，在SimpleAnalyzer的基础上增加了去除英文中的常用单词（如the，a等）
    keyword,
    pattern,
    fingerprint,
    ik_max_word,//ik中文分词
}
