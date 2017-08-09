<template>
  <div>
  <mu-drawer class="sidebar-container" left :open="open">
    <mu-avatar :src="logo" class="logo" :size="35" />
    <mu-appbar class="mu-bar brand" :title="brand" />
    <mu-list class="sidebar-panel">
      <mu-list-item href="#/dashboard" :title="_t('dashboard')"/>
      <div v-for="item in $root.models">
        <mu-list-item v-if="!item.hidden" :href="'#/'+item.name" :title="getName(item.name)"/>
      </div>
      <mu-list-item v-on:click="goExplorer()" :title="_t('api_explorer')"/>
      <mu-list-item href="http://vah7id.github.io/flashboard/restfull.html" :title="_t('api_docs')"/>
    </mu-list>
  </mu-drawer>

  </div>
</template>

<style lang="css">
  .sidebar-panel{
    margin-top: 100px;
  }
  .brand{padding-left: 10px !important;}
  .logo{
    margin-top: 16px !important
  }
  .mu-drawer .mu-avatar{
      float: left;
      position: relative;
      z-index: 11;
      margin: 18px 12px;
  }
  .mu-appbar-title{
    margin-left: 35px !important;
  }
  .mu-item-title{
      font-weight: 400 !important;
      letter-spacing: 1px !important;
      font-size: 17px !important;
      color: #666 !important;
  }
  .mu-bar{
    height: 64px !important;
    padding-top: 5px !important;
  }
  .mu-bar span{
    font-size: 28px !important;
  }
  .mu-item-title{
    text-transform: capitalize;
  }
</style>

<script type="text/javascript">

  import store from '../store';

  export default {

      name: 'SidebarView',

      data: function(){
        return {
          name: null,
          models: [],
          brand: '',
          logo:'',
          _url: null
        }
      },
      data () {
        return {
          open: true
        }
      },
      watch: {
        name: function(val){
            return store.state().current_model;
        },
        models: function(val) {
            return store.state().current_model;
        },
        open: function(val){
          return val;
        }
      },
      created() {
        this.models = JSON.parse(store.state().models);
        this.name   = store.state().current_model;
        this.brand = JSON.parse(store.get('env')).BRAND;
        this.logo = JSON.parse(store.get('env')).LOGO;
        this._url = window.location.hostname+':'+JSON.parse(store.get('env')).API_PORT;
      },
      mounted(){

        if(window.innerWidth<768){
          this.open = false;
        }

        window.addEventListener("resize", this.resize );

      },
      computed: {
        name: function () {
          return store.get('current_model');
        }
      },
      methods: {
        _t (key){
          
          var keys = this.$root.keys;

          if(keys[key] != null)
            return keys[key]

          return key;

        },
        resize(){
          if(window.innerWidth<768){
            console.log('inja')
            this.open = false;
          } else {
            this.open = true;
          }
        },
        goExplorer(){
          var _url = this._url;
          if(_url.indexOf('http')<0)
            _url = 'http://'+_url;

          window.location.assign(_url+'/explorer')
        },
        getName(item){
          if(typeof this.$root.models[item]['configs'].label != "undefined")
            return this.$root.models[item]['configs'].label;
          else
            return this.$root.models[item]['configs'].name; 
        }
      }
  }

</script>