(self.webpackChunkheardle_italia=self.webpackChunkheardle_italia||[]).push([[28],{880:(e,t,a)=>{var r,l=Object.create,s=Object.defineProperty,o=Object.getOwnPropertyDescriptor,i=Object.getOwnPropertyNames,n=Object.getPrototypeOf,p=Object.prototype.hasOwnProperty,h=(e,t,a,r)=>{if(t&&"object"===typeof t||"function"===typeof t)for(let l of i(t))p.call(e,l)||l===a||s(e,l,{get:()=>t[l],enumerable:!(r=o(t,l))||r.enumerable});return e},y=(e,t,a)=>(((e,t,a)=>{t in e?s(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a})(e,"symbol"!==typeof t?t+"":t,a),a),u={};((e,t)=>{for(var a in t)s(e,a,{get:t[a],enumerable:!0})})(u,{default:()=>P}),e.exports=(r=u,h(s({},"__esModule",{value:!0}),r));var d=((e,t,a)=>(a=null!=e?l(n(e)):{},h(!t&&e&&e.__esModule?a:s(a,"default",{value:e,enumerable:!0}),e)))(a(584)),c=a(588),m=a(556);class P extends d.Component{constructor(){super(...arguments),y(this,"callPlayer",c.callPlayer),y(this,"mute",(()=>{this.setVolume(0)})),y(this,"unmute",(()=>{null!==this.props.volume&&this.setVolume(this.props.volume)})),y(this,"ref",(e=>{this.container=e}))}componentDidMount(){this.props.onMount&&this.props.onMount(this)}load(e){const{playing:t,config:a,onError:r,onDuration:l}=this.props,s=e&&e.match(m.MATCH_URL_VIDYARD)[1];this.player&&this.stop(),(0,c.getSDK)("https://play.vidyard.com/embed/v4.js","VidyardV4","onVidyardAPI").then((e=>{this.container&&(e.api.addReadyListener(((e,t)=>{this.player||(this.player=t,this.player.on("ready",this.props.onReady),this.player.on("play",this.props.onPlay),this.player.on("pause",this.props.onPause),this.player.on("seek",this.props.onSeek),this.player.on("playerComplete",this.props.onEnded))}),s),e.api.renderPlayer({uuid:s,container:this.container,autoplay:t?1:0,...a.options}),e.api.getPlayerMetadata(s).then((e=>{this.duration=e.length_in_seconds,l(e.length_in_seconds)})))}),r)}play(){this.callPlayer("play")}pause(){this.callPlayer("pause")}stop(){window.VidyardV4.api.destroyPlayer(this.player)}seekTo(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.callPlayer("seek",e),t||this.pause()}setVolume(e){this.callPlayer("setVolume",e)}setPlaybackRate(e){this.callPlayer("setPlaybackSpeed",e)}getDuration(){return this.duration}getCurrentTime(){return this.callPlayer("currentTime")}getSecondsLoaded(){return null}render(){const{display:e}=this.props,t={width:"100%",height:"100%",display:e};return d.default.createElement("div",{style:t},d.default.createElement("div",{ref:this.ref}))}}y(P,"displayName","Vidyard"),y(P,"canPlay",m.canPlay.vidyard)}}]);