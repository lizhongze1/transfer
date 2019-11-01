var customElementTypeProvider = (function () {
    return function (options) {
        var aaa=leftData;
        var addElementTypes = function (context) {
            context.addPrintElementTypes(
                "configModule",
                [
                    new hiprint.PrintElementTypeGroup("信息项", leftData),
                    new hiprint.PrintElementTypeGroup("底版", backGroundData),
                  new hiprint.PrintElementTypeGroup("辅助", [
                    { tid: 'configModule.customText', title: '自定义文本',
                      customText: '自定义文本',
                      custom: true,
                      type: 'text' },
                    {
                      tid: 'configModule.hline',
                      title: '横线',
                      type: 'hline'
                    },
                    {
                      tid: 'configModule.vline',
                      title: '竖线',
                      type: 'vline'
                    },
                    {
                      tid: 'configModule.rect',
                      title: '矩形',
                      type: 'rect'
                    },
                    {
                      tid: 'testModule.oval',
                      title: '椭圆',
                      type: 'oval'
                    }
                  ])
                ]
            );
        };

        return {
            addElementTypes: addElementTypes
        };

    };
})();
