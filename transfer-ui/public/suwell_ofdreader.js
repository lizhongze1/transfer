/*
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-08-01 19:32:33
 * @LastEditors: lip
 * @LastEditTime: 2019-08-15 10:31:17
 */
(function(w) {
	/*
	 * 方法和控件方法的映射. 一般来说,名称相同.key为js的方法名称;
	 * value中,real为控件的方法名,如果省略,则认为和js的方法相同.args为控件中该方法接受的参数名称
	 */
	w._METHOD = {

        //3.1.2退出插件及阅读器
        "exit":{
			args : []
		},


		// 3.2.1 设置元素可用性
		"setCompsiteEnable" : {
			args : [ "cmpName", "isEnable" ]
		},
		// 3.2.1-s 设置元素可用性-标准
		"setCompositeEnable" : {
			real : "setCompsiteEnable",
			args : [ "cmpName", "isEnable" ]
		},
		// 3.2.2 设置元素可见性
		"setCompsiteVisible" : {
			args : [ "cmpName", "isVisible" ]
		},
		// 3.2.2-s 设置元素可见性-标准
		"setCompositeVisible" : {
			real : "setCompsiteVisible",
			args : [ "cmpName", "isVisible" ]
		},


		// 3.2.3 设置插件的背景==setConfigInfo(“reader.backgroundinfo”,xml)*
		"setBackGroundInfo" : {
			args : [ "config" ]
		},
		// 3.2.4 设置插件的前景==setConfigInfo(“reader.foregroundinfo”,configxml)*
		"setForeGroundInfo" : {
			args : [ "config" ]
		},
		// 3.2.5 设置视图缩放率
		"setScale" : {
			args : [ "scale" ]
		},
		// (兼容旧版本)
		"setZoomRadio" : {
			args : [ "scale" ]
		},
		// (兼容旧版本)
		"getZoomRadio" : {
			args : []
		},
		// 3.2.6 设置多文档模式==setConfigInfo(“reader.singlemode”,true)*
		"setSingleMode" : {
			args : [ "mode" ]
		},
		// 获取当前是否单文档模式
		"isSingleMode":{
			args : [ ]
		},
		// 3.2.7 设置阅读器模式==setConfigInfo(“readermode”,1)
		"setReaderMode" : {
			args : [ "mode" ]
		},
		//3.2.7 获取阅读器模式
		"getReaderMode" : {
			args : [ ]
		},
		// 3.2.8 设置视图首选项==setConfigInfo(“view.navigator”,none)*
		"setViewPreference" : {
			args : [ "key", "value" ]
		},

		// 3.2.9 设置回调函数（已不推荐使用）
		"setCallback" : {
			args : [ "name", "func", "after" ]
		},
		// 3.2.9 设置回调函数
		"registListener" : {
			args : [ "name", "func", "after" ]
		},
		// 3.2.9 设置回调函数.移除监听
		"unRegistListener" : {
			args : [ "listenerID" ]
		},

		// 3.2.10 设置掩膜生效模式。==setConfigInfo(“annot.maskmode”,0)*--setConfigInfo(“maskmode”,0)
		//0为不禁止；1为禁止显示掩膜（Display）；2为禁止打印掩膜（Print）；3为全部禁止（DisplayAndPrint）；其他值按照0处理。
		"setMaskMode" : {
			args : [ "mode" ]
		},
		 // 3.2.11 设置导航栏不能移动==setConfigInfo(“toolbarmovable”,false)*
   		"setToolbarMovable" : {
			args : [ "value" ]
		},

		"setNavigatorVisible":{
				args : [ "obj","visible" ]

		},

        // 3.3.1 设置用户信息
		"setUserInfo" : {
			args : [ "userInfo" ]
		},
		// 3.3.1 设置用户信息.设置当前用户名
		"setUserName" : {
			args : [ "name" ]
		},
		// 3.3.1 设置用户信息.获取当前用户名
		"getUserName" : {
			args : []
		},
		// 3.3.1 设置用户信息.设置用户ID。
		"setUserID" : {
			args : [ "id" ]
		},
		"setDataTag" : {
			args : [ "dataTage" ]
		},
		//获取当前用户标识
		"getUserID" :{
			args : []
			},
		"getDataTag" : {
			args : []
		},
		// 设置登录身份标识
		"setUserToken" : {
			args : [ "sessionId" ]
		},
		//设置当前用户会话标识
		"setCookie":{
			args : [ "sessionId" ]
		},
        //设置网络代理信息
		"setUserAgent":{
			args : [ "url" ]
		},
        // 3.3.2 设置文档信息
		"setDocInfo" : {
			args : [ "docInfo" ]
		},
		// 3.3.2 设置文档信息.设置元数据.
		"setMetaData" : {
			args : [ "id", "val" ]
		},
		// 3.3.2 设置文档信息.获取元数据。
		"getMetaData" : {
			args : [ "id" ]
		},
        // 3.3.3 设置权限信息
		"setRightInfo" : {
			args : [ "rightInfo" ]
		},

        // 3.3.4 设置追踪水印
		"setBarcodeInfo" : {
			args : [ "param" ]
		},
		// 3.3.4 添加追踪水印
		"addTrackInfo" : {
			args : [ "param" ]
		},
		// 3.3.4 清除所有水印。
		"clearTrackInfo" : {
			args : []
		},

         // 3.3.5　设置文档水印
		"addWaterMakerAnnot" : {
			args : [ "param" ]
		},
		// 3.3.5　设置文档水印
		"addWatermarkAnnot" : {
			real:"addWaterMakerAnnot",
			args : [ "param" ]
		},

        // 3.3.5　删除文档水印
		"delWaterMakerAnnot" : {
			args : []
		},
         // 3.3.5　删除文档水印
		"delWatermarkAnnot" : {
			real:"delWaterMakerAnnot",
			args : []
		},
        // 3.3.6 高亮关键词
		"addDynamicLink" : {
			args : [ "key", "url", "color" ]
		},

		 // 3.3.6 高亮关键词2
		"addDynamicLink" : {
			args : [ "key", "url", "color","bLocate"]
		},
		// 3.3.5 清除所有高亮关键词
		"clearDynamicLink" : {
			args : []
		},

		// 3.3.7 获取日志文件地址
		"getLogFilePath" : {
			args : []
		},

        // 3.3.8　设置服务地址
		"setServiceAddr":{
			args : ["key","url"]
		},

		// 3.3.8设置内容服务地址
		"setContentSvrAddr" : {
			args : [ "url" ]
		},
		// 3.3.8设置转换服务地址
		"setConvertSvrAddr" : {
			args : [ "url" ]
		},
		//3.3.8设置注册服务地址
		"setRegistSvrAddr" : {
			args : [ "url" ]
		},
		//3.3.8设置封装服务地址
		"setEnvelopSvrAddr" : {
			real : "setEncryptSvrAddr",
			args : [ "url" ]
		},
		//3.3.8设置日志服务地址
		"setLogSvrAddr" : {
			args : [ "url" ]
		},
		//3.3.8设置日志服务地址-兼容四院标准接口
		"setLogSvrURL" : {
			real:"setLogSvrAddr",
			args : [ "url" ]
		},
    //3.3.8更新阅读器下载地址
                "setUpdateSvrAddr" : {
			args : [ "url" ]
		},

		 //3.3.9　设置配置信息项
		"setConfigInfo":{

			args : ["configKey","configValue"]
		},
		//3.3.9　  设置最大可打印份数
		"setPrintCopies" : {
			args : [ "number" ]
		},
		//3.3.9　设置可使用打印机名
		"setPrinterName" : {
			args : [ "printer" ]
		},
		//3.3.9　设置可使用打印分辨率
		"setPrintResolution":{
			args : [ "printDpi" ]
		},

    //3.3.10保存配置信息项
        "saveConfigInfoToIni":{
        	args : [ "svraddr","url"]
        },
     //3.3.11　获取阅读器版本信息项
	    "version":{
			args : [ ]
		},

		///3.3.11　获取阅读器版本信息项--标准接口
		"getPluginVersion":{
             real : "version",
			 args : []
		},

        //3.3.12　设置文本框常用意见信息项
		"setFreqUsedComments":{
			args:["comments"]
		},
		//3.3.13　自定义文本框落款
		"setCommentsSignInfo":{
			args:["signinfo"]
		},
		//3.3.14　打印时是否带章
		"setPrintSealEnable":{
			args:["isEnable"]
		},
        //3.3.15设置打印弹出对话框的复选框组件是否选中。
		"setPrintCompsiteChecked":{
			args:["cmpName","bChecked"]
		},
        //3.3.16设置打印弹出对话框的复选框组件是否可用。
		"setPrintCompsiteEnable":{
			args:["cmpName","bEnable"]
		},

		"scrollScreenOneTime":{
			args:["forward"]
		},

		// 3.4.1 获取语义位置
		"getTaggedPosition" : {
			args : [ "fieldId" ]
		},
		// 3.4.2 获取语义内容
		"getTaggedText" : {
			args : [ "fieldId" ]
		},
		// 3.4.3 获取全文文本内容
		"getDocumentText" : {
			args : []
		},
		// 3.4.4 获取打开文档的页数
		"getPageCount" : {
			args : []
		},
		//3.4.5 设置监视并清空剪切板
		 "setClipboardMonitor" :{
		 	args : ["bMonitor"]
		 },
		//3.4.6　关闭浏览器不弹出保存确认对话框
		"closeBrowser":{
			args : [""]
		},

		//3.4.7 获取当前文档是否处于编辑状态
		"isDocumentModified":{
			args : []
		},
        //3.4.8 获取组件中当前在阅读状态的文档打开后的修改状态
		"isDocumentModifiedAfterOpen":{
             args : [ ]
		},
        //3.4.9 获得文档中签章个数
		"getSignaturesCount":{
			args:["type"]
		},
		//3.4.10　获取当前页面索引
		"getCurrentPageIndex":{
			args:[]
		},
       // 3.5.1 打开远程文件，并可设置是否只读状态
		"openFile" : {
			real : "openFile2",
			args : [ "path", "readeOnly" ]
		},
		// 3.5.1 打开远程文件，可编辑状态
		"openFileOld" : {
			real : "openFile",
			args : [ "path"]
		},

       // 3.5.2　打开文件并设置保存路径
        "openurl":{
        	 args : [ "open_url","save_url","readeOnly"]
        },

		// 3.5.3 打开内容服务文件
		"openSvcFile" : {
			args : [ "svcAddr", "docId" ]
		},

       // 3.5.4 保存文件
		"saveFile" : {
			args : [ "filename" ]
		},

       // 3.5.5 下载安全文件
		"downloadFile":{
			args : [ "filename", "param" ]
		},

       // 3.5.6 打印文件
		"printFile" : {
			real : "printFile3",
			args : [ "docName", "bGrayPrint" ]
		},
       // 3.5.7 打印文件
		"printFileCopies" : {
			args : [ "copies" ]
		},
		//3.5.8　按指定的设置直接打印
		"printFileBySetting":{
			args : [ "printSetting" ]
		},
       // 3.5.9 关闭文件
		"closeFile" : {
			args : []
		},
       // 3.5.10 转换文件
		"convertFile" : {
			args : [ "srcpath", "destFile", "metaContent" ]
		},
       // 3.5.11 执行拷贝
		"editCopy" : {
			args : []
		},
       // 3.5.12 执行粘贴
		"editPaste" : {
			args : []
		},
       // 3.5.13 模拟点击
		"performClick" : {
			args : [ "commandId" ]
		},
        // 3.5.14 添加注释
		"addPageAnnot" : {
			args : [ "type", "index", "xPos", "yPos", "width", "height","parms" ]
		},
        // 3.5.15 执行跳转
		"gotoDest" : {
			args : [ "pageIndex", "xpost", "ypost" ]
		},
        // 3.5.16 执行操作
		"excuteOperation" : {
			args : [ "commandXML" ]
		},
        // 3.5.17 导入语义模板
		"importSinemaTemp" : {
			args : [ "param" ]
		},
		//3.5.18　验证签名
		"validSignature":{
			args : [ "online","signIds" ]
		},

		//3.5.18　验证签名并返回结果
		"validSignatureWithResult":{
				args : [ "online","signIds" ]
		},
        //3.5.19设置远程打开文件的临时文件模式
	    "setEncryptTempFile":{
		    args : ["bEncrypt"]
        },
        //3.5.20全屏显示功能
		"readerFullScreen":{
	     	args : [ ]
	     },
		//3.5.21　设置提示框为顶端显示
        "setWindowNotOnTop":{
			args : [ ]
		 },
        //3.5.22　控制插件是否退出
        "setExit":{
        	args:["isExit"]
        },
        //3.5.23客户端转换接口
		"openOfficeFile":{
			args : [ "filename","suffixes"]
		},
        //3.5.24　注册高级版
		"setRegistrationInfo":{
			args : [ "projectInfo","registration"]
		},
        //3.5.25查找文本接口
        "searchText":{
        	 args : [ "keyword","bCaseSensitive","bWholeWord","bForward" ]
        },
		//3.5.26清空注释
        "clearHandwrittenAnnotation":{
        	args:[]
        },
        //3.5.27　在线文件脱密并下载到本地-接口1
		"decryptAllSeals":{
			args:["bBlack","fileName"]
		},
		//3.5.27　在线文件脱密并下载到本地-接口2
		"decryptAllSeals":{
			args:["bWordBlack"," bPictureBlack","bSealBlack","fileName"]
		},
		//3.5.28添加远程橡皮图章地址
		"addStampUrl":{
			args:["url"]
		},
        //3.5.29 导出图片接口
		"exportImage":{
			 args : [ "imageInfo"]
		},
		//3.5.30 自定义盖章
		"sealSignBySetting":{
			 args : [ "json"]
		},
		//3.5.29　添加文本框注释
		"addFreeText":{
			  args : ["textInfo"]
		},
		//3.5.30　获取文本框注释
		"getFreeTextContentById ":{
				args : ["id"]
		},
		//3.5.31　修改文本框注释内容
        "modifyFreeTextById":{
           	args : [ "id","text" ]
		},
        //3.5.32　删除指定的文本框注释
         "deleteAllFreeTextBy":{
	       args : [ "user","datatag" ]
			},

	    //3.5.33　添加图片
		"addWaterImageAnnot":{
			args : [ "imagInfo"]
		},
		//3.5.34　删除图片
		"delWaterMakerAnnotByID":{
			args : ["annotId"]
		},

	   //3.5.35　设置印章标识
		"setSealId":{
             args : [ "sealId"]
		   },

		  //3.5.36　更新文档视图缓存
		"updateViewCache":{
             args : [ "bClearAll"]
		   },

		"setDateFormat" : {
			args : [ "data" ]
		},

		"writeDateText" : {
			args : [ ]
		},

		"cancleWriteDateText" : {
			args : [ ]
		},



	      //3.6.1　异步下载接口
	   "downloadHttpFile":{
	      	args:["url","localFileName","md5"]
	      },
	      //3.6.2　删除本地文件接口
	   "deleteLocalFile":{
            args : [ "localFileName" ]
        },
         //3.6.3上传本地文件接口
        "uploadLocalFile":{
        	 args : [ "url","localFileName"]
        },
		//3.6.4　获取计算机名
		"getLocalHostName":{
             args : []
		},
		//3.6.5　删除本地目录
		"deleteLocalDir":{
			args : ["url"]
		},
		//3.6.6　修改本地目录
		"renameLocalDir":{
			args : ["url","localDirNamel"]
		}





	},

	/*
	 * 初始化时需要隐藏的
	 */
	w._HIDDEN = [ "menu" ]

})(this);

var OFD = (function(_w) {
	/*
	 * 常量
	 */
	var Constant = {
		// CLSID
		CLSID : "C7F277DC-6C47-AB2C-FB6A-070DC8BE7533",
		// 控件的注册名
		ACTIVE_NAME_OLD : "suwellreaderax.SuwellOfdActiveX",
		ACTIVE_NAME : "suwellreaderax.OFDReaderActiveX",
		// 嵌入类型
		EMBED_TYPE : "application/x-suwell",
		// 随机字符种子
		RANDOM_SEED : "0123456789qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM"
	};

	var Method = {
		// 控件组件的显示或隐藏
		"setCompsiteVisible" : {
			args : [ "name", "visible" ]
		},
		// 兼容旧版
		"setCompositeVisible" : {
			real : "setCompsiteVisible",
			args : [ "name", "visible" ]
		},
		// 打文件(包括本地和远程)
		"openFile" : {
			args : [ "path", "readOnly" ]
		},
		// 关闭当前文件
		"closeFile" : {
			args : []
		}
	};

	/*
	 * 一些简单的css
	 */
	var CSS = {
		info : "margin: 10px 0px; padding: 12px; border-radius:10px; color: #00529B; background-color: #BDE5F8;",
		success : "margin: 10px 0px; padding: 12px; border-radius:10px; color: #4F8A10; background-color: #DFF2BF;",
		warn : "margin: 10px 0px; padding: 12px; border-radius:10px; color: #9F6000; background-color: #FEEFB3;",
		error : "margin: 10px 0px; padding: 12px; border-radius:10px; color: #D8000C; background-color: #FFBABA;"
	};
	/*
	 * 工具
	 */
	var Tool = {
		// 合并对象
		extend : function(defs, target) {
			var r = target;
			if (this.isNull(r)) {
				if (this.isArray(defs)) {
					r = [];
				} else {
					r = {};
				}
			}
			this.each(defs, function(n, v) {
				if (!(n in r)) {
					r[n] = v;
				}
			});
			return r;
		},
		// 判断参数是否是数组
		isArray : function(v) {
			return Object.prototype.toString.call(v) === "[object Array]";
		},
		// 判断是否为纯粹对象,like jquery.isPlainObject
		isPlainObject : function(v) {
			if (!v || v.toString() !== "[object Object]" || v.nodeType
					|| "setInterval" in v) {
				return false;
			}
			try {
				if (v.constructor
						&& !v.hasOwnProperty("constructor")
						&& !v.constructor.prototype
								.hasOwnProperty("isPrototypeOf")) {
					return false;
				}
			} catch (e) {
				return false;
			}
			var key;
			for (key in v) {
			}
			return key === undefined || v.hasOwnProperty(key);
		},
		// 判断参数是否是undefined或null
		isNull : function(v) {
			return typeof v == "undefined" || (v != 0 && !v);
		},
		// 判断参数是有有效值
		isValid : function(v) {
			return this.isNull(v) !== true;
		},
		// getElementById
		_$ : function(id) {
			return document.getElementById(id);
		},
		// createElement
		_new : function(tag) {
			return document.createElement(tag);
		},
		// for-each like jquery
		each : function(o, fn) {
			if (this.isNull(o)) {
				return o;
			}
			if (this.isArray(o)) {
				for ( var i = 0, ol = o.length, val = o[0]; i < ol
						&& fn.call(val, i, val) !== false; val = o[++i]) {
				}
			} else {
				for ( var i in o) {
					if (fn.call(o[i], i, o[i]) === false) {
						break;
					}
				}
			}
			return o;
		},
		// 对字符串进行转义
		escape : function(s) {
			return ('' + s).replace(/["'\\\n\r\u2028\u2029]/g, function(
					character) {
				// http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
				switch (character) {
				case '"':
				case "'":
				case '\\':
					return '\\' + character
				case '\n':
					return '\\n'
				case '\r':
					return '\\r'
				case '\u2028':
					return '\\u2028'
				case '\u2029':
					return '\\u2029'
				}
			});
		},
		/*
		 * 浏览器类型判断 http://
		 * stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
		 */
		Browser : {
			// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
			isOpera : function() {
				return !!window.opera
						|| navigator.userAgent.indexOf(' OPR/') >= 0;
			},
			// Firefox 1.0+
			isFirefox : function() {
				return typeof InstallTrigger !== 'undefined';
			},
			// At least Safari 3+: "[object HTMLElementConstructor]"
			isSafari : function() {
				return Object.prototype.toString.call(window.HTMLElement)
						.indexOf('Constructor') > 0;
			},
			// Chrome 1+
			isChrome : function() {
				return !!window.chrome && !this.isOpera();
			},
			// IE6-11
			isIE : function() {// At least IE6
				// 此处防止编辑器把正则误认为注释而出现问题
				return eval('/*@cc_on!@*/false || !!document.documentMode');
			}
		},
		/*
		 * 系统和浏览器位数
		 */
		Bit : {
			// 操作系统位数
			os : function() {
				var agent = navigator.userAgent;
				var isX64OS = agent.indexOf("WOW64") != -1
						|| agent.indexOf("Win64") != -1;
				return isX64OS ? 64 : 32;
			},
			// ie的位数
			ie : function() {
				var agent = navigator.userAgent;
				var o = OFD.Bit.os;
				var isX64IE = (o == 64) && agent.indexOf("MSIE") != -1
						&& agent.indexOf("x64") != -1;
				return isX64IE ? 64 : 32;
			}
		},
		/*
		 * 页面方法
		 */
		Page : {
			// 获取窗口宽度
			width : function() {
				var w = 0;
				if (window.innerWidth) {
					w = window.innerWidth;
				} else if ((document.body) && (document.body.clientWidth)) {
					w = document.body.clientWidth;
				}
				// 通过深入Document内部对body进行检测，获取窗口大小
				if (document.documentElement
						&& document.documentElement.clientHeight
						&& document.documentElement.clientWidth) {
					w = document.documentElement.clientWidth;
				}
				return w;
			},
			// 获取窗口高度
			height : function() {
				var h = 0;
				if (window.innerHeight) {
					h = window.innerHeight;
				} else if ((document.body) && (document.body.clientHeight)) {
					h = document.body.clientHeight;
				}
				// 通过深入Document内部对body进行检测，获取窗口大小
				if (document.documentElement
						&& document.documentElement.clientHeight
						&& document.documentElement.clientWidth) {
					h = document.documentElement.clientHeight;
				}
				return h;
			}
		}
	};

	var _Private = function(reader, config) {
		// reader对象本身
		this.reader = reader;
		// object的id
		this.id;
		// 控件对象
		this.obj;

		// 配置
		this.cfg = Tool
				.extend(
						// 合并配置
						{
							// 容纳控件的div的id
							div : undefined,
							// 控件宽度
							width : "auto",
							// 控件高度
							height : "auto",
							// 组件初始化时的状态
							compsite : {
								// 显示的控件
								show : [],
								// 隐藏的控件
								hide : []
							},
							// 控件安装程序的下载路径
							// downURL : undefined,
							downURL : "http://10.20.12.29:8088/plugin.zip",

							// 是否检查控件已经安装
							checkInstalled : false,
							// 是否在未给定容纳控件的div时自动新建
							autoNewDiv : false,
							// codebase
							codebase : undefined
						}, config);

		if (_w._HIDDEN) {// 如果没有设置,则使用默认的隐藏
			var h = this.cfg.compsite.hide;
			if (h == undefined || h.length == 0) {
				this.cfg.compsite.hide = _w._HIDDEN;
			}
		}

		// 缓存未完成的操作,key为函数名称,value为每次操作的参数的数组
		this.operates = {
		// openFile : [ [ "doc1" ], [ "doc2" ] ]
		};
		// ready后的回调函数
		this.callback = [];

		/*
		 * 缓存操作
		 */
		this.cache = function(fnName, fnArgs) {
			var o = this.operates[fnName];
			if (Tool.isNull(o)) {
				o = new Array();
				this.operates[fnName] = o;
			}
			o.push(fnArgs);
		};

		/*
		 * 生成随机串
		 */
		this.randomText = function(length) {
			var x = Constant.RANDOM_SEED;
			var s = "";
			for ( var i = 0; i < length; i++) {
				s += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
			}
			return s;
		};

		/*
		 * 写出HTML信息
		 */
		this.message = function(html, level) {
			var div = Tool._$(this.cfg.div);
			if (Tool.isValid(div)) {
				if (Tool.isNull(level)) {
					level = "error";
				}
				if (level == "none") {
					div.innerHTML = html;
				} else {
					div.innerHTML = "<span style='" + CSS[level] + "'>" + html
							+ "</span>";
				}
			} else {
				alert(html);
			}
		};

		/*
		 * 判断组件是否已经安装
		 */
		this.checkComponent = function() {
			// alert("判断组件是否已经安装");
			if (Tool.Browser.isIE()) {
				return this.hasActiveX();
			} else if (Tool.Browser.isFirefox()) {
				return this.hasEmbed();
			} else if (Tool.Browser.isChrome()) {
				return this.hasEmbed();
			}
			return "不支持的浏览器类型";
		}

		/*
		 * 判断Firefox是否已经安装了OFD控件
		 */
		this.hasEmbed = function() {

			var version = navigator.plugins['Suwell Reader Plugin'];
			if (typeof (version) == "undefined") {

				var html = "OFD阅读控件没有正确安装，请下载安装！";
				if (Tool.isValid(this.cfg.downURL)) {
					html += "<a href='"//
							+ this.cfg.downURL //
							+ "' target='_blank'>&gt;&gt;&gt;&gt;&nbsp;&nbsp;下载&nbsp;&nbsp;&lt;&lt;&lt;&lt;</a>";
				}
				// html +=
				// "<br>由于安装程序会更改IE的安全设置并注册dll文件，安全软件可能会弹出安全警告，允许本软件继续即可。<br>建议使用管理员权限运行本软件。";
				this.message(html, "warn");
				return false;
			} else {

				return true;
			}
		}

		/*
		 * 判断IE是否安装了OFD控件
		 */
		this.hasActiveX = function() {

	if ("ActiveXObject" in window) {// 判断是否IE
		if (this.cfg.checkInstalled !== true) {

			return true;
		}
		try {// 判断是否安装OFD阅读器
			var axo = new ActiveXObject(Constant.ACTIVE_NAME);
			return true;

		} catch (e) {


				try {// 判断是否安装OFD阅读器
					var axo = new ActiveXObject(Constant.ACTIVE_NAME_OLD);
					return true;

				} catch (e) {

					var html = "OFD阅读控件没有正确安装，请下载安装！";
					if (Tool.isValid(this.cfg.downURL)) {
						html += "<a href='"//
								+ this.cfg.downURL //
								+ "' target='_blank'>&gt;&gt;&gt;&gt;&nbsp;&nbsp;下载&nbsp;&nbsp;&lt;&lt;&lt;&lt;</a>";
					}
				// html +=
				// "<br>由于安装程序会更改IE的安全设置并注册dll文件，安全软件可能会弹出安全警告，允许本软件继续即可。<br>建议使用管理员权限运行本软件。";
				this.message(html, "warn");
			}

		}
	} else {
		this.message("无法显示ActiveX控件,请使用IE访问", "warn");
	}
	return false;
};

		/*
		 * 输出控件的HTML
		 */
		this.write = function() {
			var w = this.cfg.width;
			if (Tool.isNull(w) || w == "auto") {
				w = "100%";
			}
			var h = this.cfg.height;
			if (Tool.isNull(h) || h == "auto") {
				h = (Tool.Page.height() - 10) + "px";

			}

			if (Tool.Browser.isIE()) {
				this
						.message(
								"<object id='"
										+ this.id // id
										+ "' width='"
										+ w// width
										+ "' height='"
										+ h// heigth
										+ "' classid='CLSID:"
										+ Constant.CLSID // clsid
										// + "' codebase='" + this.cfg.codebase
										// //
										// codebase,不使用cab时注释掉此行
										+ "'><param name='object_id' value = '"
										+ this.id
										+ "'><param name='inited_call' value = '__OFD_OCX_Ready'><param name='object_width' value = '"+ w
										+ "'><param name='object_height' value = '"+ h + "'> "
										+ "</object>", "none");
			} else if (Tool.Browser.isFirefox()) {
				this.message("<embed id='" + this.id // id
						+ "' width='" + w// width
						+ "' height='" + h// heigth
						+ "' type='" + Constant.EMBED_TYPE// type
						+ "' object_id='" + this.id
						+ "' inited_call='__OFD_OCX_Ready"// callback
						+ "' >", "none");
			} else if (Tool.Browser.isChrome()) {
				this.message("<embed id='" + this.id // id
						+ "' width='" + w// width
						+ "' height='" + h// heigth
						+ "' type='" + Constant.EMBED_TYPE// type
						+ "' object_id='" + this.id
						+ "' inited_call='__OFD_OCX_Ready"// callback
						+ "' >", "none");
			} else {
				this.message("不支持的浏览器类型", "error");
			}
		};

		/*
		 * 加载控件
		 */
		this.load = function() {
			var rand = this.randomText(10);
			if (Tool.isNull(this.cfg.div)) {
				if (this.cfg.autoNewDiv === true) {
					// 新建一个div放置控件,并追加到body的最后
					var div = Tool._new("div");
					div.id = "ofd_div_" + rand;
					var body = document.body;
					if (Tool.isNull(body)) {
						this.message("请在onload中调用本方法", "warn");
						return;
					} else {
						body.appendChild(div);
					}
					this.cfg.div = div.id;
				} else {
					this.message("请指定一个div,以便写入控件!");
					return;
				}
			}
			var check = this.checkComponent();
			if (check === true) {
				this.message("正在加载控件，请稍候...", "info");
				this.id = "ofd_ocx_" + rand;
				this.write();
			} else if (check === false) {
				// alert("控制加载失败");
				// this.message("控件加载失败", "error");
			} else {
				this.message(check);
			}
		};

		/*
		 * 加载配置,完成准备工作,只执行一次
		 */
		this.ready = function() {
			if (this.reader.valid()) {// 已经初始化
				return;
			}

			var o = Tool._$(this.id);
			//if (Tool.isNull(o)) {// 判断是否有对象
			//	this.message("控件未正确初始化!");
			//	return;
			//}
			// 赋值,很重要
			this.obj = o;
			// private
			var T = this;

			// 控制初始化时的组件显示
			Tool.each([ "show", "hide" ], function(i, n) {
				var v = T.cfg.compsite[n];
				if (Tool.isValid(v) && v.length > 0) {
					reader.setCompsiteVisible(v, n == "show");
				}
			});

			// 加载完毕前的动作都执行一遍
			Tool.each(this.operates, function(n, v) {
				if (Tool.isArray(v) && v.length > 0) {
					var fn = T.reader[n];// 得到reader对象的函数
					if (fn) {// 如果正确,执行函数
						Tool.each(v, function(i, args) {
							try {
								fn.apply(T.reader, args);
							} catch (e) {
							}
						});
					} else {
						_log("Not found function " + n + " from Reader");
					}

					v.length = 0;// 清除缓存
				}
			});
		};
	}

	// 缓存所有的Reader对象,id为reader的id,value为private对象实例
	var _ = {};
	/*
	 * 控件封装
	 */
	function Reader(config) {
		// 构建私有
		var _p = new _Private(this, config);
		// 加载
		_p.load();
		// 控件的id
		this.id = _p.id;
		// 缓存
		_[this.id] = _p;
		// 当调用控件方法时回调
		this.onInvoke = function(fnName, fnRet) {
		};
	}

	/*
	 * 检查组件是否准备完毕
	 */
	Reader.prototype.valid = function() {
		return Tool.isValid(_[this.id].obj);
	};

	/*
	 * 控件版本号
	 */
	Reader.prototype.version = function() {
		var o = Tool._$(this.id);
		try {
			return o.version();
		} catch (e) {
		}
		return false;
	};

	// 遍历注册所有的方法
	Tool.each(Tool.isValid(_w._METHOD) ? _w._METHOD : Method, function(name,
			val) {
		Reader.prototype[name] = function() {
			// 方法名
			var n = val.real;
			if (Tool.isNull(n)) {
				n = name;
			}

			// 参数
			var l = val.args.length, al = arguments.length;
			if (l > al) {
				l = al;
			}
			var arg = [];
			for ( var i = 0; i < l; i++) {
				arg[i] = arguments[i];
			}

			var _p = _[this.id];
			var T = this;
			// 返回值
			var result;
			if (this.valid()) {
				var o = _p.obj;
				if (Tool.isArray(arg[0])) {// 第一个参数是数组,拆开执行
					var A = arg.slice();// clone
					Tool.each(arg[0], function(i, v) {
						A[0] = v;
						result = doEval(T, o, n, A, val.ret);
					});
				} else {// 执行并返回值
					result = doEval(T, o, n, arg, val.ret);
				}
			} else {// 缓存操作
				_p.cache(name, arg);
			}
			var ret = val.ret;
			if (Tool.isNull(ret)) {
				return result;
			} else if (Tool.isFunction(ret)) {
				return ret.call(this, result);
			} else {
				return ret;
			}
		}
	});

	// 执行方法,并回调
	var doEval = function(reader, o, n, args) {

		if(false && n==='addFreeText'){
			var json=JSON.parse(args);;
			var page={};
			var user10='{"text":"","page-index":"1","pos-x":"40.65","pos-y":"59.06","width":"130.19","height":"133.39","font-family": "simsun","font-size":"36","font-style":"italic","font-weight":"bold", "font-color":"#ff0000"}';
			 var user1='{"page-index":"1","pos-x":"54.83","pos-y":"225.87","width":"141.83","height":"100.66","text":""}',
			 user2='{"page-index":"1","pos-x":"55.04","pos-y":"192.21","width":"141.83","height":"33.66","text":"请在此处添加意见"}',
			user3='{"page-index":"1","pos-x":"55.04","pos-y":"158.13","width":"141.62","height":"33.66","text":"请在此处添加意见"}',
			 user4='{"page-index":"1","pos-x":"55.04","pos-y":"124.47","width":"141.62","height":"33.66","text":"请在此处添加意见"}',
			 user5='{"page-index":"1","pos-x":"55.04","pos-y":"90.60","width":"141.62","height":"34.08","text":"请在此处添加意见"}',
			 user6='{"page-index":"1","pos-x":"54.83","pos-y":"79.17","width":"47.21","height":"11.43","text":"请在此处添加意见"}';
			var jsonobjects=[];
			if(json.userid=='1'){
				jsonobjects[0]=user10;
			}else if(json.userid=='2'){
				jsonobjects[0]=user2;
			}
			else if(json.userid=='3'){
				jsonobjects[0]=user3;
			}
			else if(json.userid=='4'){
				jsonobjects[0]=user4;
			}
			else if(json.userid=='5'){
				jsonobjects[0]=user5;
			}
			else if(json.userid=='6'){
				jsonobjects[0]=user6;
			}
			var nret={};

			nret.id = _eval(o, n, jsonobjects);
			nret.index="1";
			nret.x="54.83";
			nret.y="225.87"
			var ret=nret;


		}else{
			var ret = _eval(o, n, args);
		}

		if (reader.onInvoke) {
			try {
				// if (ret == undefined) {
				// reader.onInvoke.call(reader, n);
				// } else {
				reader.onInvoke.call(reader, n, ret);
				// }
			} catch (e) {
				_log("onInvoke " + n + " : " + e);
			}
		}
		return ret;
	}

	// 执行控件的方法
	var _eval = function(o, m, args) {
		var arg = "";
		Tool.each(args, function(i, v) {
			if (i > 0) {
				arg += ", ";
			}
			if (typeof (v) === "string") {
				arg += "\"" + Tool.escape(v) + "\"";
			} else {
				arg += v;
			}
		});
		try {
			return eval("o." + m + "(" + arg + ")");
		} catch (e) {
			_log("Eval " + m + " : " + e);
		}
	};

	// 记录日志
	var _log = function(msg) {
		window.console && console.log(msg);
	}

	// 缓存所有的定时结果
	var cache = {};

	return {// 防止外界的非法访问
		OCX : {
			// 初始化一个控件
			init : function(a) {
				var config = {};
				if (Tool.isPlainObject(a)) {
					config = Tool.extend(config, a);
				} else {
					var name = [ "div", "width", "height", "downURL" ];
					for ( var i = 0; i < arguments.length; i++) {
						if (i > name.length - 1) {
							break;
						}
						var n = name[i], v = arguments[i];
						if (Tool.isValid(v)) {
							config[n] = arguments[i];
						}
					}
				}

				// 新对象
				var r = new Reader(config);
				// 尝试用版本号来确定是否已经加载
				var T = this;
				cache[r.id] = setInterval(function() {
					if (r.version() !== false) {
						T.ready(r.id);
					}
				}, 500);// 缓存起来
				return r;
			},
			// 控件已准备好
			ready : function(id) {
				var _p = _[id];
				if (Tool.isValid(_p)) {
					_p.ready();
					clearInterval(cache[id]);

					_log("Reader is ready, version is " + _p.reader.version());
				}
				return _p;
			}
		}
	}
})(this);// 立即执行函数,使其成为单例

var suwell = {};
// 加载并初始化阅读器OCX控件
var width;
var height;
suwell.ofdReaderInit = function(divID, width, height) {
	this.width=width;
	this.height=height;

	return OFD.OCX.init(divID, width, height);
};


var ofdreader={};
ofdreader.init=function(divID, width, height) {
	this.width=width;
	this.height=height;

	return OFD.OCX.init(divID, width, height);
};
