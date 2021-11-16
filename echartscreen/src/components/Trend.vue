<template>
  <div class="container">
    <div class='main' ref="trend"></div>
  </div>
</template>

<script>
import chalk from '@/utils/theme.js'
import { getTrend } from '@/api'
import config from '@/config'
let colorArr = [
  ['rgb(11,168,44)', 'rgb(11,168,44, 0.5)', 'rgb(11,168,44, 0)'],
  ['rgb(44,110,255)','rgb(44,110,255, 0.5)', 'rgb(44,110,255, 0)'],
  ['rgb(29,215,194)', 'rgb(29,215,194, 0.5)','rgb(29,215,194, 0)'],
  ['rgb(254,33,30)', 'rgb(254,33,30, 0.5)','rgb(254,33,30, 0)'],
  ['rgb(250,105,0)', 'rgb(250,105,0, 0.5)', 'rgb(250,105,0, 0)']
]
export default {
  name: 'Trend',
  data() {
    return {
      chart: null,
      data: null,
      timer: null,
      startValue: 0, // datazoom 滑块起始值
      endValue: 9, // datazoom 滑块结束值
      titleSize: 0, // 标题字体大小
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    // window.addEventListener('resize', this.adaptChart)
    // this.adaptChart()
    // this.chart.on('mouseover', 'series', () => {
    //   clearInterval(this.timer)
    //   this.timer = null
    // })
    // this.chart.on('mouseout', 'series', () => {
    //   this.startTimer()
    // })
  },
  destroyed() {
    // clearInterval(this.timer)
    // window.removeEventListener('resize', this.adaptChart)
  },
  methods: {
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = this.$echarts.init(this.$refs.trend, chalk)
      let option = {
        title: {
          left: 20,
          top: 20,
          text: '▎' + config.title['trend'][0],
        },
        grid: {
          top: '25%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },

        tooltip: {

        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      // 绘制图表
      this.chart.setOption(option)
    },

    async getData() {
      let res = await getTrend()
      this.data = res.data

      this.updateChart()
      // this.startTimer()
    },
    updateChart() {
      // console.log(this.data);
      let monthData = this.data.common.month
      let series = this.data.map.data.map((item, index) => {

        return {
          name: item.name,
          data: item.data,
          type: "line",
          stack: 'map',
          itemStyle: {
            color: colorArr[index][0]
          },
          areaStyle: {

            normal: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: colorArr[index][1]
              }, {
                offset: 1,
                color: colorArr[index][2]
              }]),
            }

          }
        }
      })
      let dataOption = {
        xAxis: {
          data: monthData
        },
        legend: {
          top: 150,
          left: 330,
          show: true,
          icon: "circle",
          itemWidth: 33,  // 设置宽度
          itemHeight: 33, // 设置高度
          textStyle: {
            color: '#999',
            fontSize: 33,
          }
        },
        series
      }
      this.chart.setOption(dataOption)

    },
    startTimer() {
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.data.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()

      }, 1500);
    },
    adaptChart() {
      this.chart.resize()
      this.titleSize = this.$refs.trend.offsetWidth / 100 * 3.6
      let adaptOption = {
        title: {
          textStyle: {
            fontSize: this.titleSize
          }
        },
        series: [
          {
            barWidth: this.titleSize,
            itemStyle: {
              borderRadius: [this.titleSize / 2, this.titleSize / 2, 0, 0],//（顺时针左上，右上，右下，左下）
            }
          }
        ]
      }
      this.chart.setOption(adaptOption)

    }

  }
}
</script>


<style scoped lang="scss">
</style>
