<template>
  <div>
    
    <sidebar></sidebar>

    <mu-content-block class="mu-content-block-board">

      <mu-flexbox>

        <mu-flexbox-item>
            <mu-paper v-for="item in $root.models" class="paperItem" :zDepth="2" v-if="!item.hidden">
                <a :href="'#/'+item.name" class="ripple"><i class="material-icons">{{ item.icon }}</i> 
                <div v-if="item['configs'].label">{{ item['configs'].label }}</div>
                <div v-else="item.label">{{ item.name }}</div>
                </a>
                <span class="count">{{ item.count }}<small>{{ _t('items') }}</small></span>
                <mu-float-button mini :href="'#/'+item.name+'/create'" icon="add" class="float-button"/>
            </mu-paper>
        </mu-flexbox-item>
       
      </mu-flexbox>
      
    </mu-content-block>

  </div>
</template>

<style type="text/css">

  .ripple{
    float: left;
    font-size: 24px;
    text-transform: capitalize;
    width: 100%;
    text-align: left;
    padding-left: 20px;
  }
  small{
    font-size: 13px !important;
    padding-left: 5px;
  }
  .ripple i{
    float: left;
    margin: 5px 10px 0 0;
  }
  .float-button{
    margin-top: 20px !important;
    margin-right: 20px !important;
    float: right;
  }
  .count{
    float: left;
    margin: 20px 0 0 20px;
    font-size: 32px;
    color: #ccc;
  }
  .paperItem {
    display: inline-block;
    height: 125px;
    padding-top: 10px !important;
    width: 25%;
    margin: 15px;
    text-align: center;
  }
  @media (min-width: 970px) and (max-width: 1920px){
    .paperItem {
      width: 25%
    }
  }
    @media (min-width: 768px) and (max-width: 970px){
    .paperItem {
      width: 40%
    }
    .mu-appbar-title{
      margin-left: 0 !important;
    }
  }
  @media (min-width: 450px) and (max-width: 768px){
    .paperItem {
      width: 42%
    }
    .mu-appbar-title{
      margin-left: 0 !important;
    }
  }
  @media (min-width: 0px) and (max-width: 450px){
    .paperItem {
      width: 96%
    }
    .mu-appbar-title{
      margin-left: 0 !important;
    }
  }
  .mu-content-block-board{
    margin-top: 100px;
    width: calc(100% - 280px) ;
    float: right;
    padding-right: 30px;
  }
</style>

<script type="text/javascript">

  import Sidebar from '../components/Sidebar.vue'
  import store from '../store';

  const request = require("browser-request");

  export default {

      name: 'DashboardView',

      components: {
        Sidebar
      },

      data () {
        return {
          loading: true,
          interval: null
        }
      },

      created() {
      
      },
      
      mounted(){

        var self = this;

        document.querySelector('.mu-linear-progress').classList.add('hide');
        document.querySelectorAll('.mu-appbar')[0].classList.remove('hide');


      },

      methods: {

        _t (key){
          
          var keys = this.$root.keys;

          if(keys[key] != null)
            return keys[key]

          return key;

        }

      }
  }

</script>