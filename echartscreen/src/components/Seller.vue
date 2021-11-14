<template>
  <div class="container">
    <div class='main' ref="seller"></div>
  </div>
</template>

<script>
import chalk from '@/utils/theme.js'
import { getSeller } from '@/api'
import config from '@/config'

export default {
  name: 'Seller',
  data() {
    return {
      chart: null,
      data: null,
      current: 1,// 当前页
      totalPage: 0,// 总页码
      num: 5,// 每页数据量 默认5
      timer: null,
      pageData: null, // 每页de数据
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
    this.timer = null
    window.removeEventListener('resize', this.adaptChart)
  },
  methods: {
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = this.$echarts.init(this.$refs.seller, chalk)
      let option = {
        title: {
          left: 20,
          top: 20,
          text: '▎' + config.title['seller'],
          textStyle: {
          }
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
          // formatter: '{b}<br />{c}',
          borderWidth: 0,
          textStyle: {
            color: '#fff'
          },
          trigger: 'axis',
          axisPointer: {
            z: -1,
            type: 'line',
            lineStyle: {
              type: 'solid',
              color: 'rgba(255,255,255,.1)',
            }
          }
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              color: '#fff',
              position: 'right'
            },
            itemStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#5152ee' },
                  { offset: 1, color: '#aa6ee5' },
                ]
              }
            }
          }
        ]
      }
      // 绘制图表
      this.chart.setOption(option)
    },
    async getData() {
      let res = await getSeller()
      this.data = res.data
      // 排序
      this.data.sort((a, b) => a.value - b.value)
      // 分页
      this.totalPage = Math.ceil(this.data.length / this.num)
      this.updateChart()
      this.startTimer()
    },
    updateChart() {
      // 截取每页数据
      this.pageData = this.data.slice((this.current - 1) * this.num, this.current * this.num)
      let nameData = this.pageData.map(item => {
        return item.name
      })

      let valueData = this.pageData.map(item => {
        return item.value
      })
      let dataOption = {
        yAxis: {
          data: nameData
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
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        if (this.current == this.totalPage) {
          this.current = 0
        }
        this.current++
        this.updateChart()
      }, 3000);
    },
    adaptChart() {
      this.chart.resize()
      this.titleSize = this.$refs.seller.offsetWidth / 100 * 3.6
      let adaptOption = {
        title: {
          textStyle: {
            fontSize: this.titleSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: this.titleSize
            }
          }
        },
        series: [
          {
            barWidth: this.titleSize,
            itemStyle: {
              borderRadius: [0, this.titleSize / 2, this.titleSize / 2, 0],//（顺时针左上，右上，右下，左下）
            }
          }

        ]
      }
      // 绘制图表
      this.chart.setOption(adaptOption)
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
