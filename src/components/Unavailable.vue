<template>
  <div>
    
    <mu-content-block class="mu-content-block-404">
      <img src="src/assets/page-cannot-be-found.jpg" />
      <H1>WHoops!</H1>
      <p>Please make sure all service are run and alive :)</p>
    </mu-content-block>

  </div>
</template>

<style type="text/css">
  .mu-content-block-404 h1{
    font-size: 48px;
    margin-bottom: 0px;
  }
  .mu-content-block-404 p{
    color: #666;
  }
  .mu-content-block-404{
    background-color: #f7f7f7;
    margin-top: 0px;
    padding: 100px 0 150px 0 !important;
    width: 100% !important;
    text-align: center;
    float: right;
  }
</style>

<script type="text/javascript">

  import Sidebar from '../components/Sidebar.vue'
  import store from '../store';

  const request = require("browser-request");

  export default {

      name: 'DashboardView',

      data () {
        return {
          loading: true,
          interval: null
        }
      },

      created() {
      
      },
      
      mounted(){

        var token = store.get('flashboard_token');

        var self = this;

        if(window.location.hash.indexOf('?url=')>=0){

          var url = window.location.hash.split('?url=')[1];
            console.log(token)
            
          if(url != "" && token != null && !window.offline_mode ){
            console.log('inja')
            window.location.assign(url);
          }

        }

        document.querySelector('.mu-linear-progress').classList.add('hide');
        document.querySelector('.mu-appbar').classList.add('hide')

      },

      methods: {

      }
  }

</script>