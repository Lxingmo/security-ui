<template>
	<div class="bar2">
		<div class="line_head">
			<div class="pie_title">性别比重图</div>
		</div>
		<div class="main" v-if="maleNum.length || femaleNum.length || ageGroupList.length"></div>
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
		props: {
			maleNum: Array,
			femaleNum: Array,
			ageGroupList: Array,
		},
        components:{
            MyLoading
        },
		data(){
			return {
				myChart: {},
				// data:{
				// 	yAxis:[ "0 ~ 10","10 ~ 20","20 ~ 30","30 ~ 40","40 ~ 50","50 ~ 60","60 ~ 70" ],
				// 	maleNum: [320, 302, 341, 374, 390, 450, 420],
				// 	femaleNum: [-120, -132, -101, -134, -190, -230, -210],
				// },

				color: this.$store.state.color1,
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
				let option = {
					tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        },
				        formatter:function(data){
				        	// console.log(data)
				        	let show_data = data[0].name + "<br/>"
				        	for( let i = 0; i < data.length; i++ ){
				        		if( i === 1 ){
				        			show_data = show_data + data[i].marker + data[i].seriesName + ": " + data[i].data*-1 + "人"
				        		}else{
				        			show_data = show_data + data[i].marker + data[i].seriesName + ": " + data[i].data + "人<br/>"
				        		}
				        	}
				        	return show_data
				        }
				    },
				    legend: {
				        data:['男', '女'],
				        textStyle:{
				        	color: 'auto',
				        	fontSize: 16,
				        },
				        // 图例位置
				        x: 'center',
				        y: 15,
				        itemWidth: 25,
				        itemHeight: 10,
				        itemGap: 20,

				        // 内边距
				        padding: 10,
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
				    xAxis : [
				        {
				            type : 'value',
				            axisLine:{
				            	lineStyle: {
				            		color: this.text_color,
				            		type: 'dashed',
				            	},
				            }, // 线条设置
				            axisLabel:{
				            	textStyle:{
		            				color: this.text_color,
		            			},
		            			formatter:function(params){
		            				if( params < 0 ){
		            					return params * -1
		            				}else{
		            					return params
		            				}
		            			}
				            }, // 字体设置
				            splitLine:{
				            	show: true,
				            	lineStyle:{
				            		color: ['rgba(0, 255, 0, 0.2)'],
				            		type: 'dotted',
				            	},	
				            },
				            axisTick:{
				            	show: false,
				            },
				        }
				    ],
				    yAxis : [
				        {
				            type : 'category',
				            data : mydata.yAxis,
				            axisLine:{
				            	show: false,
				            	lineStyle: {
				            		color: this.text_color,
				            	},
				            },
				            axisLabel:{
				            	textStyle:{
		            				color: this.text_color,
		            				fontSize: 16,
		            			},
				            },
				            splitLine:{
				            	show: false,
				            	lineStyle:{
				            		color: ['rgba(0, 255, 0, 0.2)'],
				            		type: 'dotted',
				            	},
				            },
				            axisTick:{
				            	show: false,
				            }
				        }
				    ],
				    backgroundColor: 'rgba(0,0,0,0.4)', // 修改背景颜色
				    color: this.color, // 线条颜色
				    series : [
				        {
				            name:'男',
				            type:'bar',
				            stack: '总量',
				            barWidth: '30',
				            data: mydata.maleNum,
				            label: {
				                normal: {
				                    show: true,
				                    position: 'inside',
				                    formatter: function(params) {
				                    	if( params.data === 0 ){
			            					return ""
			            				}
				                        return "    " + params.data
				                    },
				                    textStyle:{
				                		fontSize: 16,
				                	},
				                },
				                emphasis: {
				                	// position: 'right',
				                	textStyle:{
				                		fontSize: 30,
				                	}
				                },
				            },
				        },
				        {
				            name:'女',
				            type:'bar',
				            stack: '总量',
				            barWidth: '30',
				            data: mydata.femaleNum,
				            label: {
				                normal: {
				                    show: true,
				                    position: 'inside',
				                    formatter: function(params) {
				                    	if( params.data === 0 ){
			            					// return ""
			            				}
				                        return params.data * -1 + "    ";
				                    },
				                    textStyle:{
				                		fontSize: 16,
				                	},
				                },
				                emphasis: {
				                	// position: 'right',
				                	textStyle:{
				                		fontSize: 30,
				                	}
				                },
				            },
				        }
				    ]
				}

				this.myChart = echarts.init(document.querySelector('.bar2 .main'))
				this.myChart.setOption(option,true)
			},
		},
		mounted(){
			// this.myChart = echarts.init(document.querySelector('.bar2 .main'))
			// this.line_echart_init( this.data )
			// this.line_echart_init( this.genderAgeData )
			// this.my_init()
			// console.log(this.genderAgeData)
		},
		watch:{
			'maleNum':function(newval,old){

                let mydata = {
                    yAxis: ["儿童","青年","中年","老年"],
                    // maleNum: [320, 302, 341, 374],
                    maleNum: [0, 0, 0, 10],
                    femaleNum: [-120, -132, -101, -134],
                }

                this.$nextTick(function(){
                    this.line_echart_init( mydata )
                    this.my_init()
                });

				// let mydata = {
				// 	yAxis: ["儿童","青年","中年","老年"],
				// 	maleNum: this.maleNum,
				// 	femaleNum: this.femaleNum,
				// }
                //
                // this.$nextTick(function(){
                //     this.line_echart_init( mydata )
                //     this.my_init()
                // });
			}
		}
	}
	
</script>


<style scoped>
	.bar2{
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
	.pie_title{
         width: 300px;
         height: 60px;
         line-height: 60px;
         color: #cccccc;
         font-size: 20px;
         margin-left: 20px;
	}
</style>
