<template>
	<div class="pie2">
		<div class="line_head">
			<div class="pie_title">年龄比重图</div>
		</div>
        <!--<div class="main" ></div>-->
		<div class="main" v-if="ageGroupList.length || genderData.length || AgeGengerData.length"></div>
        <div class="main_ch" v-else-if="$store.state.dataview2_flag">
            <my-loading></my-loading>
        </div>
        <div class="main_ch" v-else>
            <div class="main_text">
                <div class="main_table">
                    <div class="main_cell">
                        -- 暂无数据 --
                    </div>
                </div>
            </div>
        </div>
	</div>
</template>


<script>
	import echarts from 'echarts'
    import MyLoading from '../../components/myloading'

    export default{
		props:{
			ageGroupList: Array,
			genderData: Array,
			AgeGengerData: Array,
		},
        components:{
            MyLoading
        },
		data(){
			return {
				legendArr: [],
				myChart: {},
				name: '环形图',

				color: this.$store.state.color2,
				text_color: this.$store.state.text_color,
			}
		},
		methods:{
			my_init() {
				this.legendArr = this.myChart.getOption().series
				this.legendArr.forEach((data) => {
					data.selected = true;
				})
				this.$root.charts.push(this.myChart)
				window.addEventListener('resize', function() {
					this.myChart.resize()
				}.bind(this))
			},
			line_echart_init:function( mydata ){
				let rich =  {
				    yellow: {
				        color: "auto",
				        fontSize: 18,
				        align: 'center',
				        padding: [4,0]
				    },
				    yellow_hide: {
				        color: "auto",
				        fontSize: 30,
				        fontWeight: 'bold',
				        align: 'center',
				        padding: [4,0]
				    },
				    white: {
				        color: "auto",
				        align: 'center',
				        fontSize: 25,
				        padding: [0,1]
				    },
				    white_hide: {
				        color: "auto",
				        align: 'center',
				        fontSize: 40,
				        fontWeight: 'bold',
				        padding: [0,1]
				    },
				    hr: {
				        borderColor: 'auto',
				        width: '100%',
				        borderWidth: 1,
				        height: 0,
				    }
				}
				let option = {
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c}人 ({d}%)",
				        textStyle:{	
				        	fontSize: 20,
				        }
				    },
				    legend: {
				        orient : 'vertical',
				        x : 'left',
				        data: mydata.yAxis,
				        // 图例位置
				        x: 20,
				        y: 'center',
				        itemWidth: 25,
				        itemHeight: 10,
				        itemGap: 20,
				        // 内边距
				        padding: 10,

				        textStyle:{
				        	color: 'auto',
				        	fontSize: 20,
				        },
				    }, 
				    toolbox: {
				    	x: '1150px',
				        show : true,
				        feature : {
				            mark : {show: false},
				            dataView : {show: false, readOnly: false},
				            restore : {show: false},
				            saveAsImage : {show: true}
				        }
				    },
				    calculable : false,
				    backgroundColor: 'rgba(0,0,0,0.4)', // 修改背景颜色
				    color: this.color, // 线条颜色
                    startAngle: 0, //起始角度
                    minAngle: 20, // 最小角度
				    series : [
				        {
				            name:'性别',
				            type:'pie',
				            selectedMode: 'single',
				            radius : [0, 70],
				            
				            // for funnel
				            x: '20%',
				            width: '40%',
				            funnelAlign: 'right',
				            max: 1548,
				            
				            itemStyle : {
				                normal : {
				                    label : {
				                        position : 'inner',
				                        textStyle:{
				                        	fontSize: 20,
				                        	fontWeight: 'bold',
				                        }
				                    },
				                    labelLine : {
				                        show : false
				                    }
				                }
				            },
				            data: mydata.genderData,
				        },
				        {
				            name:'抓拍量',
				            type:'pie',
				            radius : [100, 140],
				            
				            // for funnel
				            x: '60%',
				            width: '35%',
				            funnelAlign: 'left',
				            // max: 1048,
				            
				            itemStyle : {
				                normal : {
				                    label : {
				                        show : true,
				                        position: 'outside',
				                        formatter: function(a){
				                        	if( a.data.value != 0 ){
				                        		return '{white|' + a.name + '}'
				                        	}else{
				                        		return a.name + ''
				                        	}
				                        },
				                        rich: rich,
				                    },
				                    labelLine : {
				                        show : true,
				                        length: 40,
				                    },

				                },
				                emphasis : {
				                    label : {
				                        show : true,
				                        position : 'outside',
				                        formatter: function(a){
				                        	return '{white_hide|' + a.percent + '%}\n{hr|}\n{yellow_hide|' + a.name + '}'
				                        },
				                        rich: rich,
				                    }
				                }
				            },

				            data: mydata.AgeGengerData
				        }
				    ]
				}
                this.myChart = echarts.init(document.querySelector('.pie2 .main'))
				this.myChart.setOption(option,true)
			},
		},
		mounted(){
			// this.myChart = echarts.init(document.querySelector('.pie2 .main'))
		},
		watch:{
			'genderData':function(newval,old){
				let mydata = {}
				let yAxis = []
				let age_items = ["儿童","青年","中年","老年"]
				mydata.genderData = [
					{value:this.genderData[0], name:'男'},
	                {value:this.genderData[1], name:'女'},
				]
				mydata.AgeGengerData = []
				for( let i = 0; i < this.AgeGengerData.length; i++ ){
					if( this.AgeGengerData[i] != 0 ){
						mydata.AgeGengerData.push( {value:this.AgeGengerData[i], name:age_items[i]} )
						yAxis.push(age_items[i])
					}
				}
				mydata.yAxis = yAxis

                this.$nextTick(function(){
                    this.line_echart_init( mydata )
                    this.my_init()
                });

                // this.line_echart_init( mydata )
				// this.my_init()
			},
		},
	}
	
</script>


<style scoped>
	.pie2{
		width: 100%;
		height: 100%;
	}
	.main{
		width: 100%;
		height: calc( 100% - 60px );
	}
	.line_head{
		width: 100%;
		height: 60px;
		/*margin-bottom: 10px;*/
		background-color: rgba(0,0,0,0.5);
	}
	.pie_select{
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		margin-right: 20px;
		width: 170px;
		height: 32px;
		font-size: 16px;
		float: right;
 		margin-top: 14px;
		padding: 0px 8px;
		background-color: rgba(225,225,225,0.1);
		border: none;
		color: #cccccc;
		outline: none;
	}
	.pie_option{
		background-color: #34465a ;
  		color: #cccccc;
  		border: none;
  		outline: none;
	}
	.pie_title{
        width: 300px;
        height: 60px;
        line-height: 60px;
        color: #cccccc;
        font-size: 20px;
        margin-left: 20px;
        float: left;
	}
</style>
