<template>
	<div style="height:100%;width:100%" @click="click_to_close_tip">
		<div class="list_box">
			<div class="mask_box">
				<div class="top_title">
					<div class="title_lefttext">设备组配置</div>
					<div class="title_righttext">结果{{init_data.allnum}}个</div>
				</div>
				<div class="input_box" @keyup.enter="keyup_to_search">
					<div class="export_btn" @click="click_to_add_info">添加</div>
					<div class="export_btn" @click="click_to_delete">删除</div>
					<div class="right_btn h2_right_btn m3_right_box">
						<div class="search h2_search" @click="click_to_search(search_data)">搜索</div>
						<input class="center_input id_card input_right" type="text" v-model="search_data.groupName" placeholder="设备组名称(最长20个字符)" maxlength="20"/>
					</div>
				</div>
				<div class="table_box h2_table_box">
					<div class="table_thbox">
						<table :style="{'width': tabledata_style}">
							<tr>
								<td class="td td4">
									<input class="checkbox_box" type="checkbox" :checked="isallchecked" v-model="isallchecked" @click="click_to_checkedall" />
								</td>
								<td class="td td18">组名称</td>
								<td class="td td18" v-if="false">区域</td>
								<td class="td td18">状态</td>
								<td class="td td18">备注</td>
								<td class="td td18">操作</td>
							</tr>
						</table>
					</div>
					<div class="table_thbox2" ref="table_f">
                        <my-loading v-if="is_tabledata_loading"></my-loading>
						<table id="tabledata" ref="table_c" v-else>
							<tr class="tr" v-for="item in tabledata">
								<td class="td td4">
									<input class="checkbox_box" type="checkbox" :checked="item.ischecked" v-model="item.ischecked" @click="click_to_checkedone(item.uuid)" />
								</td>
								<td class="td td18">
									<div class="table_text">
										<div class="cell_text">
											{{ item.name }}
										</div>
									</div>
								</td>
								<td class="td td18" v-if="false">
									<div class="table_text">
										<div class="cell_text">
											{{item.area}}
										</div>
									</div>
								</td>
								<td class="td td18">
									<div class="table_text">
										<div class="cell_text">
											<el-switch
											  v-model="item.groupStatus"
											  active-color="#13ce66"
	  										  inactive-color="#626262"
	  										  @change="isreal_change(item.uuid)"
	  										  :disabled="item.ischange"
											  >
											</el-switch>
										</div>
									</div>
								</td>
								<td class="td td18">
									<div class="table_text">
										<div class="cell_text">
											{{ item.remarks }}
										</div>
									</div>
								</td>
								
								<td class="td td18">
									<div class="td_icon">
										<div class="m_icon icon9" @click="skip_to_camera(item.uuid)" title="跳转到设备配置"></div>
										<div class="m_icon icon6" @click="skip_to_historyface1(item.uuid)" title="跳转到历史报警"></div>
										<div class="m_icon icon2" @click="click_to_change_gallery(item.uuid)" title="修改设备组信息"></div>
									</div>
								</td>
							</tr>
						</table>
					</div>
					<div class="pag">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="init_data.pageNum" :page-sizes="[10, 20, 30, 50]" :page-size="init_data.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="init_data.allnum" class="haha">
						</el-pagination>
					</div>
				</div>
			</div>
		</div>
		<!--遮罩层-->
		<div class="mack_box" v-show="is_request2add" @click="is_request2add = false"></div>
		<!--弹出框-新增设备组-->
		<div class="bounced_add mm3_bounced mm_hiddenx" v-show="is_request2add">
			<div class="bounced_box">
				<div class="bounced_top">
					<div class="bounced_title">新增设备组</div>
				</div>
				<div class="choose_input mm3_choose">
					<span>设备组名称：</span>
					<input class="mm3_inputname" 
						type="text" 
						v-model="add_data.name"
						@focus="focus_to_show(-90,124,'name')"
						@click.stop/>
					<div class="mmbtn_box mm3_btn" @click="click_to_addinfo_data" v-show="is_confirm_show">新建设备组</div>
					<div class="mmbtn_box mm3_btn left_mmbox" v-show="!is_confirm_show">新建设备组</div>
					<div class="mmbtn_box left_mmbox mm3_btn" @click="click_to_close_addinfo">暂不添加</div>
				</div>
				<div class="mmbottom_input">
					<input type="text" 
						placeholder="附加备注信息" 
						v-model="add_data.remarks"
						@focus="focus_to_show(-40,18,'remarks')"
						@click.stop/>
				</div>
			</div>
		</div>
		<!--遮罩层-->
		<div class="mack_box" v-show="is_request2change" @click="is_request2change = false"></div>
		<!--弹出框-编辑设备组信息-->
		<div class="bounced_add mm3_bounced" v-show="is_request2change">
			<div class="bounced_box">
				<div class="bounced_top">
					<div class="bounced_title">编辑设备组信息</div>
				</div>
				<div class="choose_input mm3_choose">
					<span>底库名称：</span>
					<input class="mm3_inputname" 
						type="text" 
						v-model="change_data.name"
						@focus="focus_to_show(-90,124,'name')"
						@click.stop/>
					<div class="mmbtn_box mm3_btn" @click="click_to_change_infodata" v-show="is_confirm_show">确认修改</div>
					<div class="mmbtn_box mm3_btn left_mmbox" v-show="!is_confirm_show">确认修改</div>
					<div class="mmbtn_box left_mmbox mm3_btn" @click="click_to_close_change_info">暂不修改</div>
				</div>
				<div class="mmbottom_input">
					<input type="text" 
						placeholder="附加备注信息" 
						v-model="change_data.remarks"
						@focus="focus_to_show(-40,18,'remarks')"
						@click.stop/>
				</div>
			</div>
		</div>
		<div class="shape_minbox" v-if="is_show_tip" :style="{'left':'calc(35% + '+tip_left+'px)','top':'calc(35% + '+tip_top+'px)'}">
			<div class="shape_topbox">
				<div class="triangle"></div>
				<div class="triangle1"></div>
			</div>
			<div class="shape_border">
				<div class="shape_text">
					<div style="color:white">输入限制：</div>
					<div class="shape_text2" style="color:white" v-for="text,index in shape_text">{{index+1}}.{{text}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	//js
	export default {
		data() {
			return {
				// 初始化数据
				init_data: {
					// galleries: ['扒窃人员','涉恐人员','重点人员'],
					
					pageNum: 1,
					pageSize: 10,
					// allnum: 50,
				},

				// 搜索数据
				search_data:{
					groupName: ""
				},
				save_search_data:{

				},
				delete_data: [],
				add_data:{
					name: "",
					remarks: "",
				},
				change_data: {},

				// 显示数据
				tabledata: null,

				isallchecked: false,

				// 弹窗
				is_request2add: false,
				is_request2change: false,
				is_confirm_show : true,

				// 滚动条
				tabledata_style: "width:100%",

				// 输入框提示
				is_show_tip: false,
				tip_top: 0,
				tip_left: 0,
				shape_text: [],

                // 列表数据是否加载中
                is_tabledata_loading: false,
			} //返回数据最外围
		},
		methods: {
			// 页面切换函数
			handleSizeChange:function(val) {
				// 单页面显示数量
				this.init_data.pageSize = val
				this.post_to_change_page(this.save_search_data)
                this.$refs.table_f.scrollTop = 0
			},
			handleCurrentChange:function(val) {
				// 页面切换
				this.init_data.pageNum = val
				this.post_to_change_page(this.save_search_data)
                this.$refs.table_f.scrollTop = 0
			},

			// 输入-正则化
			check_input:function(input_data,model=""){
				// let reg = /^[\u4e00-\u9fa5]{0,20}$/
				let reg = /^[\u4e00-\u9fa50-9a-zA-Z\_]{0,20}$/
				if( model === "remarks" ){
					reg = /^.{0,20}$/
				}
                return reg.test(input_data)
			},
			// 输入框聚焦
			focus_to_show:function(tip_top,tip_left,model=""){
				this.tip_top = tip_top
				this.tip_left = tip_left
				if( model === "remarks" ){
					this.shape_text = ["不超过20个字符"]
				}else{
					this.shape_text = ["不超过20个字符","可输入中文、数字、字母、下划线"]
				}
				if( this.shape_text.length ){
					this.is_show_tip = true
				}
			},
			click_to_close_tip:function(event){
				this.is_show_tip = false
			},

			// 复选框函数
			click_to_checkedall: function() {
				if(!this.isallchecked) {
					this.isallchecked = true
					for(let i = 0; i < this.tabledata.length; i++) {
						this.tabledata[i].ischecked = true
					}
				} else {
					this.isallchecked = false
					for(let i = 0; i < this.tabledata.length; i++) {
						this.tabledata[i].ischecked = false
					}
				}
			},
			click_to_checkedone:function(num){
				// console.log(this.tabledata[num].ischecked)
				let flag = true
				if( this.tabledata[num].ischecked ){
					this.isallchecked = false
				}else{
					for(let i = 0; i < this.tabledata.length; i++){
						if( i != num ){
							flag = this.tabledata[i].ischecked && flag
						}
					}
					this.isallchecked = flag
				}
			},

			// 搜索事件
			click_to_search:function(search_data){
				// if( !this.check_input(search_data.groupName) ){
				// 	this.warning_info("设备组名应输入中文且不超过20个字")
				// 	return ;
				// }

				this.isallchecked = false
				this.init_data.pageNum = 1
				this.save_search_data = JSON.parse(JSON.stringify(search_data))
				this.post_to_change_page(search_data)
			},
			// 添加事件
			click_to_add_info:function(){
				// 弹窗添加
				this.is_request2add = true
			},
			// 添加事件-弹窗
			click_to_addinfo_data:function(){
				if( !this.check_input(this.add_data.name,"name") ){
					this.warning_info("设备组名格式不正确")
					return ;
				}else if( !this.check_input(this.add_data.remarks,"remarks") ){
					this.warning_info("备注格式不正确")
					return ;
				}
				this.is_confirm_show = false
				this.require_to_add(this.add_data)
			},
			click_to_close_addinfo:function(){
				this.is_request2add = false
			},
			// 修改事件
			click_to_change_gallery:function(num){
				this.change_data = JSON.parse(JSON.stringify(this.tabledata[num]))
				this.is_request2change = true
			},
			// 修改事件-弹窗
			click_to_change_infodata:function(){
				if( !this.check_input(this.change_data.name,"name") ){
					this.warning_info("设备组名格式不正确")
					return ;
				}else if( !this.check_input(this.change_data.remarks,"remarks") ){
					this.warning_info("备注格式不正确")
					return ;
				}

				if( this.change_data.remarks === this.tabledata[this.change_data.uuid].remarks &&
					this.change_data.name === this.tabledata[this.change_data.uuid].name ){
					this.error_info("信息未更改")
				}else if( this.change_data.name === "" ){
					this.warning_info("设备组名称不能为空")
				}else{
					let template = {"id":this.change_data.id,"name":this.change_data.name,"remarks":this.change_data.remarks}
					this.is_confirm_show = false
					this.require_to_change(template,"default",this.change_data.uuid)
				}
			},
			click_to_close_change_info:function(){
				this.is_request2change = false
			},

			// 添加删除事件
			click_to_delete:function(){
				for ( let i = 0; i < this.tabledata.length; i++){
					if(this.tabledata[i].ischecked){
						this.delete_data = this.delete_data + this.tabledata[i].id + ","
					}
				}
				if( this.delete_data.length ){
					this.$confirm('是否删除该数据？','提示',{
						confirmButtonText: '是',
			            cancelButtonText: '否',
			            type: 'warning'
					}).then(() => {
						this.require_to_delete(this.delete_data)
						this.delete_data = ""
					}).catch(() => {
                        this.delete_data = ""
					})
				}else{
					this.warning_info("请选择删除项")
				}
			},
			// 清除数据
			clear_data:function(){
				this.is_request2add = false
				this.is_request2change = false
				this.change_data = {}
				this.add_data = { name: "", remarks: "" }

				this.is_show_tip = false
			},
			// 键盘事件
			// 键盘事件-回车搜索
			keyup_to_search:function(){
				// this.save_search_data = this.search_data
				// this.post_to_change_page(this.search_data)
				this.click_to_search(this.search_data)
			},

			// 页面跳转
			skip_to_camera:function(num){
				// 此处groupId 为设备组名
				this.$store.state.search_data.groupId = this.tabledata[num].name
				this.$store.state.is_search_data = true
				this.$router.push('/mmanage4')
			},
			skip_to_facepath:function(num){
				// 人脸轨迹
				this.$router.push('/facepath')
			},
			skip_to_historyface1:function(num){
				// console.log(this.tabledata[num].name)
				this.$store.state.search_data.cameraGroupName = this.tabledata[num].name
				this.$store.state.search_data.cameraGroupId = this.tabledata[num].id
				this.$store.state.is_search_data = true
				this.$router.push('/historyface1')
			},
			
			// 开关判断
			isreal_change:function(uuid){
				if( this.tabledata[uuid].groupStatus ){
					this.$confirm('确定打开该区域摄像头？','提示',{
						confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
					}).then(() => {
						this.tabledata[uuid].ischange = true
						this.tabledata.splice(uuid,1,this.tabledata[uuid])
						if( this.tabledata[uuid].groupStatus ){
							this.require_to_change({"id":this.tabledata[uuid].id,"groupStatus":1},"status",uuid)
						}else{
							this.require_to_change({"id":this.tabledata[uuid].id,"groupStatus":0},"status",uuid)
						}
					}).catch(() => {
						this.tabledata[uuid].groupStatus = false
					})
				}else{
					this.$confirm('确定关闭该区域摄像头？','提示',{
						confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
					}).then(() => {
						this.tabledata[uuid].ischange = true
						this.tabledata.splice(uuid,1,this.tabledata[uuid])
						// this.require_to_change({"id":this.tabledata[uuid].id,"groupStatus":this.tabledata[uuid].groupStatus},"status",uuid)
						if( this.tabledata[uuid].groupStatus ){
							this.require_to_change({"id":this.tabledata[uuid].id,"groupStatus":1},"status",uuid)
						}else{
							this.require_to_change({"id":this.tabledata[uuid].id,"groupStatus":0},"status",uuid)
						}
					}).catch(() => {
						this.tabledata[uuid].groupStatus = true
					})
				}
				// console.log(this.tabledata[uuid].groupStatus)
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
                this.is_tabledata_loading = true
				this.$ajax.post("/groupCamera/list",params).then((res) => {
                    if( res.data.status === 0){
                		this.init_data.allnum = res.data.data.total
            			this.tabledata = res.data.data.list
            			// console.log(this.tabledata)
            			for( let i = 0; i < this.tabledata.length; i++){
            				if( this.tabledata[i].groupStatus === 0 ){
            					this.tabledata[i].groupStatus = false
            				}else{
            					this.tabledata[i].groupStatus = true
            				}
		                	this.tabledata[i].uuid = i
		                	this.tabledata[i].ischecked = false
		                	this.tabledata[i].ischange = false
		                }
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                    this.is_tabledata_loading = false
                }).catch((error) => {
                    this.is_tabledata_loading = false
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			post_to_change_page:function(search_data){
				// console.log(this.search_data)
                var params = new URLSearchParams()
                if( search_data.groupName ){
                	params.append("groupName",search_data.groupName)
                }

                params.append("pageNum",this.init_data.pageNum)
                params.append("pageSize",this.init_data.pageSize)
                this.is_tabledata_loading = true
                this.$ajax.post("/groupCamera/list",params).then((res) => {
                    if( res.data.status === 0){
                		this.init_data.allnum = res.data.data.total
            			this.tabledata = res.data.data.list
            			// console.log(this.tabledata)
            			for( let i = 0; i < this.tabledata.length; i++){
            				if( this.tabledata[i].groupStatus === 0 ){
            					this.tabledata[i].groupStatus = false
            				}else{
            					this.tabledata[i].groupStatus = true
            				}
		                	this.tabledata[i].uuid = i
		                	this.tabledata[i].ischecked = false
		                }
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                    this.is_tabledata_loading = false
                }).catch((error) => {
                    this.is_tabledata_loading = false
                	console.log(error)
                	this.error_info('网络连接出错')
                    return ;
                })
			},
			require_to_delete:function( delete_data ){
				var params = new URLSearchParams()

				// console.log(delete_data) 
                params.append("groupCameraIds",delete_data) // 删除列表id数组
				this.$ajax.post("/groupCamera/delete",params).then((res) => {
                    if( res.data.status === 0){
	                    this.success_info('删除成功')
	                    this.isallchecked = false
	                    this.post_to_change_page(this.save_search_data)
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                }).catch((error) => {
                	console.log(error)
                    this.error_info('网络连接出错')
                    return ;
                })
			},
			require_to_add:function( add_data ){
				var params = new URLSearchParams()
                
            	if( add_data.name ){
            		params.append( "name", add_data.name )
            	}else{
            		this.is_confirm_show = true
            		this.error_info("设备组名称不能为空")
                    return ;
            	}
            	params.append( "remarks", add_data.remarks)

                // 请求人员数据
                this.$ajax.post("/groupCamera/add",params).then((res) => {
                    if( res.data.status === 0){
                    	this.success_info("添加成功")
	                    this.post_to_change_page(this.save_search_data)
	                    this.clear_data()
                    }else{
                        this.mes_handling(res.data.status,res.data.msg)
                    }
                    this.is_confirm_show = true
                }).catch((error) => {
                	console.log(error)
                	this.error_info('网络连接出错')
                	this.is_confirm_show = true
                    return ;
                })
			},
			require_to_change:function(change_data,model="default",uuid=null){
				var params = new URLSearchParams()

				for( let item in change_data ){
					params.append(item,change_data[item])
				}

                // 请求人员数据
                this.$ajax.post("/groupCamera/update",params).then((res) => {
                    if( res.data.status === 0){
                    	if( model === "default" ){
                    		this.success_info("修改设备组信息成功")
	                    	this.post_to_change_page(this.save_search_data)
	                    	this.clear_data()
                    	}else if( model === "status" ){
                    		this.success_info('修改设备状态成功')
                    	}
                    	this.tabledata[uuid].ischange = false
						this.tabledata.splice(uuid,1,this.tabledata[uuid])
                    }else{
                    	if( model === "status" ){
                    		this.tabledata[uuid].groupStatus = !this.tabledata[uuid].groupStatus
                    	}
	                    this.mes_handling(res.data.status,res.data.msg)
	                    if( uuid === 0 || (uuid != 0 && uuid) ){
							this.tabledata[uuid].ischange = false
							this.tabledata.splice(uuid,1,this.tabledata[uuid])
						}
                    }
                    this.is_confirm_show = true
                }).catch((error) => {
                	if( model === "status" ){
                		this.tabledata[uuid].groupStatus = !this.tabledata[uuid].groupStatus
                	}
                	console.log(error)
                	this.error_info('网络连接出错',uuid)
                	this.is_confirm_show = true
                    return ;
                })
			},


			// 消息窗口
			error_info:function(mes,uuid){
				this.is_confirm_show = true
				this.$message({
                    type: 'error',
                    message: mes,
                    showClose: true,
                    center: true
                })
			},
			warning_info:function(mes){
				this.$message({
                    type: 'warning',
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
			'search_data.groupName':function(newval,old){
				if( newval === "" ){
					this.click_to_search(this.search_data)
				}
			},
			
			// 滚动条
			'tabledata':function(){
			    // this.$nextTick(function(){
			    //     let table_height = document.getElementById("tabledata").scrollHeight
			    //     let box_height = this.$refs.table_f.offsetHeight
			    //     if( table_height > box_height ){
			    //     	this.tabledata_style = 'width: 100%'
			    //     }else{
			    //     	// console.log(table_height,box_height)
			    //     	this.tabledata_style = 'width: calc(100% - 20px)'
			    //     }
			    // });

			    // 全局函数-获取是否出现滚动条
			    this.get_scroll()
			}
		},
	}
</script>

<style>
	
</style>
<style scoped>
	@import "../css/historyface.css";
</style>
