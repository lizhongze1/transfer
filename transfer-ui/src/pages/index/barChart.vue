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
import { getLicenceTop } from '@/api/index'
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
      this.getTop10Data()
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
    getTop10Data() {
      getLicenceTop({ number: 10 }).then(response => {
        for (var i = 0; i < response.data.data.data.length; i++) {
          this.dataX.push(response.data.data.data[i].CATALOG_NAME)
          this.dataY.push(response.data.data.data[i].callCount)
        }
        this.initChart()
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      var option = {
        grid: {
          left: '5%',
          top: '5%',
          right: '3%',
          bottom: '2%',
          containLabel: true
        },
        tooltip: {
          show: true
        },
        backgroundColor: '#fff',
        xAxis: [{
          show: false
        }],
        yAxis: [{
          axisTick: 'none',
          axisLine: 'none',
          offset: '10',
          axisLabel: {
            textStyle: {
              color: '#666',
              fontSize: '14'
            }
          },
          data: this.dataX.reverse()
        }
        ],
        series: [{
          type: 'bar',
          yAxisIndex: 0,
          data: this.dataY.reverse(),
          label: {
            normal: {
              show: true,
              position: 'right',
              textStyle: {
                color: '#666',
                fontSize: '14'
              }
            }
          },
          barWidth: 15,
          itemStyle: {
            normal: {
              color: '#44C4EE'
            }
          },
          z: 2
        }
        ]
      }
      this.chart.setOption(
        option, true
      )
    }
  }
}
</script>

