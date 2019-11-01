<!--
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-08-21 23:17:58
 * @LastEditors: lip
 * @LastEditTime: 2019-08-27 10:15:48
 -->
<template>
  <div :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from '@/utils/resize'
import { getOrgCallHistory } from '@/api/index'
export default {
  mixins: [resize],
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      chart: null,
      dataX: [],
      dataY: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getChartData()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getChartData() {
      getOrgCallHistory().then(response => {
        for (var i = 0; i < response.data.data.data.length; i++) {
          this.dataX.push(response.data.data.data[i].PROVIDE_ORG_NAME)
          this.dataY.push(response.data.data.data[i].callCount)
        }
        this.initChart()
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.dataX,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#b3b3b3'
            },
            intervar: 0,
            rotate: 25
          }
        },

        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['#f3f5f8', '#fff']
            }
          },
          axisLabel: {
            textStyle: {
              color: '#b3b3b3'
            }
          }
        },
        dataZoom: [{
          show: true,
          height: 12,
          xAxisIndex: [
            0
          ],
          bottom: '8%',
          start: 0,
          end: 50,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: 'rgba(255,255,255,0)'

          },
          textStyle: {
            color: '#b3b3b3'
          },
          borderColor: '#bcd1e5',
          fillerColor: 'rgba(188,209,229,.8)'
        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 0,
          end: 50
        }],
        series: {
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: '#3491E6'
            }
          },
          data: this.dataY
        }
      }
      this.chart.setOption(
        option, true
      )
      this.chart.resize()
    },
    chartResize() {
      this.chart.resize()
    }
  }
}
</script>

