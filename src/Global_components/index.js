import MyLoading from '../components/myloading'
import NumberGrow from "../components/DigitalScroll"
import ImgDraw from "../components/ImgDraw"

// 注册全局组件
function plugin(Vue){
    if( plugin.installed ){
        rerurn;
    }

    Vue.component('my-loading',MyLoading)
    Vue.component('number-grow',NumberGrow)
    Vue.component('img-draw',ImgDraw)
}

export default plugin
