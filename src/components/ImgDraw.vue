<template>
    <div class="img_main_box">
        <div class="img_main_box_ch1">
            <img  id="myimg_id"
                  :src="imgsrc"
                  style="max-width:800px; max-height:800px;"
                  :style="{'margin-left': marginLeft +'px','margin-top': marginTop +'px'}"  />
            <div class="face_box"
                 v-for="item in detections"
                 :style="{'width': (item[2] - item[0])+'px',
                          'height': (item[3] - item[1]) +'px',
                          'top': item[1] + 'px',
                          'left': item[0] + 'px',
                          'margin-left': marginLeft +'px',
                          'margin-top': marginTop +'px'}"
                 v-if="is_show_box_flag"
            ></div>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            imgsrc:{
                type: String,
                default: "",
            },
            detections:{
                type: Array,
                default: [[]],
            },
            flag:{
                type: Boolean,
                default: false,
            },
        },
        data(){
            return{
                // total_pic: "http://192.168.10.108:3333/uploads/5aaf46c127d6e53000b189d8/20181024/3943366542739878_6486309d7a05_photo.jpeg",
                // detections: [[376,423,644,691]],

                img_width: 0,
                img_height: 0,

                img_box_width: 0,
                img_box_height: 0,

                marginLeft: 0,
                marginTop: 0,

                width_rate: 1,
                height_rate: 1,

                is_show_box_flag: false,
            }
        },
        methods:{
            // 获取图片的实际宽高
            get_src_wh:function(){
                // 创建对象
                var img = new Image()

                // 改变图片的src
                img.src = this.imgsrc

                if( img.complete ){
                    this.img_width = img.width
                    this.img_height = img.height
                    // console.log('from:hah : width:'+img.width+',height:'+img.height);

                    this.get_img_wh()
                }else{
                    // 加载完成执行
                    img.onload = () => {
                        this.img_width = img.width
                        this.img_height = img.height
                        // 打印
                        // console.log('from:onload : width:'+img.width+',height:'+img.height);

                        this.get_img_wh()
                    }
                }
            },
            // 获取图片容器的宽高
            get_img_wh:function(){
                // 获取图片容器宽高
                this.img_box_width = document.getElementById("myimg_id").width
                this.img_box_height = document.getElementById('myimg_id').height
                // console.log(this.img_box_width, this.img_box_height)

                // 计算图片在容器的居中位置
                if( this.img_box_width < 801 ){
                    this.marginLeft = ( 800 - this.img_box_width)/2
                }
                if( this.img_box_height < 801 ){
                    this.marginTop = ( 800 - this.img_box_height )/2
                }

                // 计算播放比率
                this.width_rate = this.img_box_width/this.img_width
                this.height_rate = this.img_box_height/this.img_height

                // 替换比率
                // console.log(this.width_rate,this.height_rate)
                for( let i = 0; i < this.detections.length; i++ ){
                    let temp_list = [0,0,0,0]
                    temp_list[0] = this.detections[i][0] * this.width_rate
                    temp_list[1] = this.detections[i][1] * this.height_rate
                    temp_list[2] = this.detections[i][2] * this.width_rate
                    temp_list[3] = this.detections[i][3] * this.height_rate

                    this.detections.splice(i,1,temp_list)
                    this.is_show_box_flag = true
                }
            },

            // 计算比率画框
            draw_face_box:function(){
                this.$nextTick(()=>{
                    if( this.imgsrc ){
                        this.get_src_wh()
                        // this.get_img_wh()
                    }
                })
            }
        },
        mounted(){
            // this.draw_face_box()
        },
        watch:{
            'flag': function (newval,old) {
                if( newval ){
                    if( this.detections[0].length ){
                        this.draw_face_box()
                    }
                }else{
                    this.is_show_box_flag = false
                }
            },
        },
    }
</script>

<style scoped>
    .img_main_box{
        /*background-color: rgba(255,0,0,0.5);*/
        width: 100%;
        height: 100%;
        padding: 0.1px;
    }
    .img_main_box_ch1{
        width: 800px;
        height: 800px;
        position: relative;
        margin: 0 auto;
        margin-top: 5%;
        /*background-color: rgba(0,255,0,0.5);*/
    }
    .img_main_box_ch1 img{
        position: absolute;
        border: 3px white solid;
    }
    .face_box{
        position: absolute;
        border: 3px #11de11 solid;
    }
</style>
