<template>
	<!--html,不用head和body-->
	<div class="max_box">
		<div class="left_nav">
			<el-menu default-active="2" class="el-menu-vertical-demo" text-color="#fff" active-text-color="#00fcff">
				<el-submenu :index="item.uuid"  :key="item.uuid" v-for="item in groupNames">
					<template slot="title">
						<div class="tem_box1">
							<div class="mincheck_input" @click.stop @click="click_to_change_all(item.uuid)"><img :src="img_url[item.ischecked]"/></div>
						</div>
						<span class="check_span">{{item.name}}</span>
					</template>
					<el-menu-item-group>
						<el-menu-item :index="item.uuid + '-' + cam_item.uuid" :key="item.uuid + '-' + cam_item.uuid" :title="cam_item.name" v-for="cam_item in video_names[item.uuid]">
							<div class="tem_box1" >
								<div class="mincheck_input" @click.stop @click="click_to_change_one(cam_item.uuid,item.uuid)"><img :src="img_url[cam_item.ischecked]"/></div>
							</div>
							{{ cam_item.name.slice(0,8) }}
						</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
			</el-menu>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				img_url:[require("../assets/historyface/chck_no.png"),require("../assets/historyface/chck_ok.png")],

				groupNames: [],
				video_names: [],
				// view_data: null,
			}
		},
		methods:{
			click_to_change_all:function(num){
				num = parseInt(num)
				if( !this.groupNames[num].ischecked ){
					this.groupNames[num].ischecked = 1
					// this.$store.state.facepath_search_data.cameraGroupIds.push(this.groupNames[num].id)
					this.checkall(num)
				}else{
					this.groupNames[num].ischecked = 0
					// let index = this.$store.state.facepath_search_data.cameraGroupIds.indexOf(this.groupNames[num].id)
					// if( index != -1){
					// 	this.$store.state.facepath_search_data.cameraGroupIds.splice(index,1)
					// }
					// this.$store.state.facepath_search_data.cameraGroupIds.push()
					this.notcheckall(num)
				}
				this.groupNames.splice(num,1,this.groupNames[num]);
				// console.log(this.$store.state.facepath_search_data.cameraGroupIds)
			},
			click_to_change_one:function(num,num2){
				num2 = parseInt(num2)
				if( !this.video_names[num2][num].ischecked ){
					this.video_names[num2][num].ischecked = 1
					// this.$store.state.facepath_search_data.cameraIds.push(this.video_names[num2][num].id)
					this.ischeckedall(num2)
				}else{
					this.video_names[num2][num].ischecked = 0
					// let index = this.$store.state.facepath_search_data.cameraIds.indexOf(this.video_names[num2][num].id)
					// if( index != -1){
					// 	this.$store.state.facepath_search_data.cameraIds.splice(index,1)
					// }

					this.groupNames[num2].ischecked = 0
					this.groupNames.splice(num2,1,this.groupNames[num2]);
					// for( let i = 0; i < this.$store.state.facepath_search_data.cameraGroupIds.length; i++ ){
					//     // console.log(this.$store.state.facepath_search_data.cameraGroupIds[i])
                    //     // console.log(this.groupNames[num2].id)
					//     if( this.$store.state.facepath_search_data.cameraGroupIds[i] === this.groupNames[num2].id ){
                    //         this.$store.state.facepath_search_data.cameraGroupIds.splice(i,1)
                    //         // break
                    //     }
					//     // console.log(this.$store.state.facepath_search_data.cameraGroupIds)
                    // }
				}
				this.video_names[num2].splice(num,1,this.video_names[num2][num])
				// console.log(this.$store.state.facepath_search_data.cameraIds)
			},
			checkall:function(num){
				for( let i = 0; i < this.video_names[num].length; i++ ){
					this.video_names[num][i].ischecked = 1
					this.video_names[num].splice(i,1,this.video_names[num][i])
				}
			},
			notcheckall:function(num){
				for( let i = 0; i < this.video_names[num].length; i++ ){
					this.video_names[num][i].ischecked = 0
					this.video_names[num].splice(i,1,this.video_names[num][i])
				}
			},
			ischeckedall:function(num2){
				let count = 0
				for( let i = 0; i < this.video_names[num2].length; i++ ){
					if( this.video_names[num2][i].ischecked ){
						count += 1
					}
				}
				if( this.video_names[num2].length === count ){
					this.groupNames[num2].ischecked = 1
					this.groupNames.splice(num2,1,this.groupNames[num2]);
				}
			},


			// 请求数据
			// mes_handling:function(status, msg){
   //              if( status === 1 ){
   //                  this.error_info(msg)
   //                  return ;
   //              }else if( status === 2 ){
   //                  this.error_info(msg)
   //                  return ;
   //              }else if( status === 10 ){
   //                  this.error_info('请先登录')
   //                  return ;
   //              }else{
   //                  if( status === 401 && msg === "未登录" ){
   //                      this.error_info(msg)
   //                      this.$router.push("/login")
   //                  }else{
   //                      this.error_info(status + "  " + msg)
   //                  }
   //              }
   //          },
			get_init_data:function(){
				// 请求设备组列表
				var params = new URLSearchParams()
				this.$ajax.post("/groupCamera/getAllCameras",params).then((res) => {
			        if( res.data.status === 0){
			        	this.groupNames = []
			        	this.video_names = []
						for( let item in res.data.data ){
							let [name,id] = item.split(",")
							this.groupNames.push( {"name":name,"id":id} )
							this.video_names.push( res.data.data[item] )
						}
						this.$store.state.facepath_search_data.allcamera_list = []
						for( let i = 0; i < this.video_names.length; i++ ){
							for( let j = 0; j < this.video_names[i].length; j++ ){
								this.video_names[i][j].uuid = j
								this.video_names[i][j].ischecked = 0
								if( !this.video_names[i][j].groupName ){
									this.video_names[i][j].groupName = this.groupNames[i].name
								}

								if( this.$store.state.facepath_model === "online" ){
									this.video_names[i][j].location = [this.video_names[i][j].location.split(",")[0],this.video_names[i][j].location.split(",")[1]]
								}else if( this.$store.state.facepath_model === "offline" ){
									this.video_names[i][j].location = [this.video_names[i][j].location.split(",")[1],this.video_names[i][j].location.split(",")[0]]
								}
								// console.log(this.video_names[i][j].location)
								this.$store.state.facepath_search_data.allcamera_list.splice(-1,0,this.video_names[i][j])
							}
						}
						// console.log(this.$store.state.facepath_search_data.allcamera_list)
						// console.log(this.$store.state.facepath_search_data.allcamera_list)
						for (let i = 0; i < this.groupNames.length; i++) {
							this.groupNames[i].uuid = i + ""
							this.groupNames[i].ischecked = 0
						}
						// console.log(this.video_names)
			        }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
			    }).catch((error) => {
			    	console.log(error)
			    	this.error_info('网络连接出错')
			        return ;
			    })
			},
			// 消息窗口
			error_info:function(mes){
				this.$message({
                    type: 'error',
                    message: mes,
                    showClose: true,
                    center: true
                })
			},
			success_info:function(mes){
				this.$message({
                    type: 'success',
                    message: mes,
                    showClose: true,
                    center: true
                })
			},

		},
		mounted:function(){
			this.get_init_data()	
		},
        watch:{
            'groupNames':function (newval,old) {
                this.$store.state.facepath_search_data.cameraGroupIds = []
                for( let i = 0; i < newval.length; i ++ ){
                    if( newval[i].ischecked ){
                        this.$store.state.facepath_search_data.cameraGroupIds.push(newval[i].id)
                    }
                }
                // console.log(this.$store.state.facepath_search_data.cameraGroupIds)
            },
            'video_names':function (newval,old) {
                this.$store.state.facepath_search_data.cameraIds = []
                for( let i = 0; i < newval.length; i++ ){
                    if( this.groupNames[i].ischecked ){
                        continue
                    }else{
                        for( let j = 0; j < newval[i].length; j++ ){
                            if( newval[i][j].ischecked ){
                                this.$store.state.facepath_search_data.cameraIds.push(newval[i][j].id)
                            }
                        }
                    }
                }
                // console.log(this.$store.state.facepath_search_data.cameraIds)
            },
        },
	};
</script>

<style>
	@import "../css/left_nav5.css";
</style>
