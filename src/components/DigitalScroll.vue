<template>
  <div class="num_div1"
       :style="{
                'height': div_height +'px',
                'width': div_width*show_palce+0.5*show_palce+'px',
                'background-color': bgcolor,
                'color': numcolor,
                }">
    <div class="num" :style="{'font-size':size+'px'}" v-for="item,index in shownum" v-if="showflag[index]">
      <div class="num1" :style="{'transform': 'translate(0px,'+ item*(-div_height) +'px)','transition-duration':time +'s'}" ref="line_height">
        <div v-for="mynum in [0,1,2,3,4,5,6,7,8,9]">{{ mynum }}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      // 动画时间，单位秒
      time: {
        type: [Number,String],
        default: 1
      },
      // 数值，整数
      value: {
        type: Number,
        default: 0
      },
      // 字体大小,单位px
      size: {
        type: [Number,String],
        default: 20,
      },
      // 数字最大位数
      place: {
        type: [Number,String],
        default: 8,
      },
      // 背景颜色
      bgcolor:{
        type: String,
        default: 'rgba(0,0,0,0)',
      },
      // 字体颜色
      numcolor:{
        type: String,
        default: 'white',
      }
    },
    data(){
      return {
        // 显示数字每位
        shownum: [],
        showflag: [true],

        // div 长宽
        div_height: 0,
        div_width: 0,

        // 显示位数
        show_palce: 1,
      }
    },
    methods: {

    },
    mounted () {
      for(let i = 0; i < this.place; i++){
        this.shownum.push(0)
      }
      for(let i = 1; i < this.place; i++){
        this.shownum.push(false)
      }

      // 获取数字div长宽
      this.$nextTick(()=>{
        this.div_height = this.$refs.line_height[0].scrollHeight/10
        this.div_width = this.$refs.line_height[0].scrollWidth
      })
    },
    watch:{
      'value':function (newval,old) {
        if( newval.toString().length > this.place ){
          this.show_palce = this.place
        }else{
          this.show_palce = newval.toString().length
        }

        let num = newval

        for( let i = 0; i < this.place; i++ ){
          let res_num = num % 10

          // this.shownum.splice(i,1,res_num)
          this.showflag.splice(i,1,true)
          this.shownum.splice(i,1,res_num)

          num = (num - res_num)/10
          if( num === 0 ){
            // this.show_palce = i + 1
            break
          }
        }
      },
      'place':function (newval,old) {
        this.show_palce = newval
      },
    },
  }
</script>
<style scoped>
  .num1{
    transition-duration: .5s;
    transform: translate(0px,0px);
  }

  .num_div1{
    margin: auto;
    overflow: hidden;
  }
  .num_div1 .num{
    float: right;
    text-align: center;
    transition-duration: .5s;
    transform: translate(0px,0px);
  }
</style>
