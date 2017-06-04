<template>
  <div>
    
    <sidebar></sidebar>

    <mu-content-block class="mu-content-block-board">

      <mu-flexbox>

        <mu-flexbox-item>
            <mu-paper v-for="item in $root.models" class="paperItem" :zDepth="2" v-if="!item.hidden">
                <a :href="'#/'+item.name" class="ripple"><i class="material-icons">{{ item.icon }}</i> {{ item.name }}</a>
                <span class="count">{{ item.count }}<small>items</small></span>
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
    width: 20%;
    margin: 20px;
    text-align: center;
  }
  .mu-content-block-board{
    margin-top: 100px;
    width: calc(100% - 280px) !important;
    float: right;
    padding-right: 30px !important;
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
        document.querySelector('.mu-appbar').classList.remove('hide')

      },

      methods: {

      }
  }

</script>