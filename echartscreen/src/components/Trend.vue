<template>
  <div class="container">
    <div class="title" :style="titleFontSize">
      <div class='text'><span>▎{{title}}</span> <span class="arrow" @click="showSelect = !showSelect">&gt;</span></div>
      <div class="select" v-show="showSelect">
        <div class="select-item" v-for="item in selectedTypes" :key="item.key" @click="handleSelect(item.key)">{{item.text}}</div>
      </div>

    </div>

    <div class='main' ref="trend"></div>
  </div>
</template>

<script>
import chalk from '@/utils/theme.js'
import { getTrend } from '@/api'

let colorArr = [
  ['rgb(11,168,44)', 'rgb(11,168,44, 0.5)', 'rgb(11,168,44, 0)'],
  ['rgb(44,110,255)', 'rgb(44,110,255, 0.5)', 'rgb(44,110,255, 0)'],
  ['rgb(29,215,194)', 'rgb(29,215,194, 0.5)', 'rgb(29,215,194, 0)'],
  ['rgb(254,33,30)', 'rgb(254,33,30, 0.5)', 'rgb(254,33,30, 0)'],
  ['rgb(250,105,0)', 'rgb(250,105,0, 0.5)', 'rgb(250,105,0, 0)']
]
export default {
  name: 'Trend',
  data() {
    return {
      chart: null,
      data: null,
      timer: null,
      titleSize: 0, // 标题字体大小
      selectedType: 'map',
      showSelect: false,
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.adaptChart)
    this.adaptChart()


  },
  computed: {
    selectedTypes() {
      if (!this.data) return []
      return this.data.type.filter(item => {
        return item.key != this.selectedType
      })
    },
    title() {
      if (!this.data) return 'map'
      return this.data[this.selectedType].title
    },
    titleFontSize() {
      return {
        fontSize: this.titleSize + 'px'
      }
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.adaptChart)
  },
  methods: {
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = this.$echarts.init(this.$refs.trend, chalk)
      let option = {
        grid: {
          top: '25%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        legend: {
          show: true,
          icon: "circle",
          textStyle: {
            color: '#999',
          }
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          backgroundColor: 'rgba(50,50,50,0.7)',
          borderWidth: 0,
          textStyle: {
            color: '#fff',
          },
          formatter: (arg) => {
            let str = arg[0].axisValue + '<br />'
            arg.forEach(item => {
              str += item.marker + item.seriesName + ':' + item.value + '<br />'
            })
            return str
          }
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
    },
    updateChart() {

      let monthData = this.data.common.month
      let series = this.data[this.selectedType].data.map((item, index) => {

        return {
          name: item.name,
          data: item.data,
          type: "line",
          stack: this.selectedType,
          itemStyle: {
            color: colorArr[index][0]
          },
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: colorArr[index][1]
            }, {
              offset: 1,
              color: colorArr[index][2]
            }]),
          }
        }
      })
      let dataOption = {
        xAxis: {
          data: monthData
        },
        series
      }
      this.chart.setOption(dataOption)

    },

    adaptChart() {
      this.chart.resize()
      this.titleSize = this.$refs.trend.offsetWidth / 100 * 3.6
      let adaptOption = {

        legend: {
          top: this.titleSize * 3,
          left: this.titleSize * 5,
          itemGap: this.titleSize / 2,
          itemWidth: this.titleSize,  // 设置宽度
          itemHeight: this.titleSize, // 设置高度
          textStyle: {
            fontSize: this.titleSize / 1.5,
          }
        }
      }
      this.chart.setOption(adaptOption)

    },

    handleSelect(type) {
      this.selectedType = type
      this.showSelect = false
      this.updateChart()
    }

  }
}
</script>


<style scoped lang="scss">
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 2;
  color: #fff;
  .text span {
    float: left;
  }
  .arrow {
    margin-left: 10px;
    transform: rotate(90deg);
  }
  .select {
    margin-left: 30px;
  }
}
</style>
