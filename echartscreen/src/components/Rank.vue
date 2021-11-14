<template>
  <div class="container">
    <div class='main' ref="rank"></div>
  </div>
</template>

<script>
import chalk from '@/utils/theme.js'
import { getRank } from '@/api'
import config from '@/config'
const colorArr = [
  ['#4ef677', '#23e1e4'],
  ['#23e3e4', '#2e74c0'],
  ['#5152ee', '#aa6ee5'],
]
export default {
  name: 'Rank',
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
    window.addEventListener('resize', this.adaptChart)
    this.adaptChart()
    this.chart.on('mouseover', 'series', () => {
      clearInterval(this.timer)
      this.timer = null
    })
    this.chart.on('mouseout', 'series', () => {
      this.startTimer()
    })
  },
  destroyed() {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.adaptChart)
  },
  methods: {
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = this.$echarts.init(this.$refs.rank, chalk)
      let option = {
        title: {
          left: 20,
          top: 20,
          text: '▎' + config.title['rank'],
        },
        grid: {
          top: '25%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          backgroundColor: 'rgba(50,50,50,0.7)',
          borderWidth: 0,
          textStyle: {
            color: '#fff'
          },
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: {
          show: false,
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              color: '#fff',
              position: 'top'
            },
            itemStyle: {
              color: function(arg) {
                // console.log(arg);
                if (arg.data < 100) {
                  return {
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: colorArr[0][0] },
                      { offset: 1, color: colorArr[0][1] },
                    ]
                  }
                } else if (arg.data < 200) {
                  return {
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: colorArr[1][0] },
                      { offset: 1, color: colorArr[1][1] },
                    ]
                  }
                } else {
                  return {
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: colorArr[2][0] },
                      { offset: 1, color: colorArr[2][1] },
                    ]
                  }
                }
              }
            }
          }
        ]
      }
      // 绘制图表
      this.chart.setOption(option)
    },

    async getData() {
      let res = await getRank()
      this.data = res.data
      // 排序
      this.data.sort((a, b) => a.value - b.value)

      this.updateChart()
      this.startTimer()
    },
    updateChart() {
      let nameData = this.data.map(item => {
        return item.name
      })

      let valueData = this.data.map(item => {
        return item.value
      })
      let dataOption = {
        xAxis: {
          data: nameData
        },
        dataZoom: {
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: valueData
          }
        ]
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
      this.titleSize = this.$refs.rank.offsetWidth / 100 * 3.6
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
