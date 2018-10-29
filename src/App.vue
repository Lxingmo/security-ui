<template>
  <div id="app" class="fillcontain">
    <!-- <img src="./assets/logo.png"> -->
    <!--<transition :name="transitionName">-->
      <!-- <keep-alive> -->
        <router-view/>
      <!-- </keep-alive> -->
    <!--</transition>-->
  </div>
</template>

<script>
export default {
    name: 'App',
    mounted:function(){
        // window.document.title = "anytec"
        this.$router.beforeEach((to, from, next) => {
            window.document.title = to.meta.title;
            next()
        })
    },
    data(){
        return {
            transitionName: '',
        }
    },
    watch:{
        $route:function(to,from){
            this.transitionName = 'slide-left';
            window.document.title = this.$route.meta.title
        },
    },
}
</script>

<style>
  @import "./css/public_el.css";
  .fillcontain{
      height: 100%;
      width: 100%;
      /*position: relative;*/
      /*background-color: blue; */
  }
  html,body{
    width: 100%;
    height: 100%;
    margin: 0;
    min-width: 1920px;
    min-height: 974px;
  }

  /*!*界面切换样式*!*/
  /*.slide-left-enter-active{*/
    /*will-change: transform;*/
    /*transition: all 1s ease;*/
    /*position: absolute;*/
  /*}*/
  /*.slide-left-leave-active {*/
    /*will-change: transform;*/
    /*transition: all 1s ease;*/
    /*position: absolute;*/
  /*}*/
  /*.slide-left-enter {*/
    /*opacity: 0;*/
    /*transform: translate3d(100%, 0, 0);*/
  /*}*/
  /*.slide-left-leave-active {*/
    /*opacity: 0;*/
    /*transform: translate3d(-100%, 0, 0);*/
  /*}*/
</style>
