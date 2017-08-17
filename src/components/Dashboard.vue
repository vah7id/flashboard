<template>
  <div>
    
    <sidebar></sidebar>

    <mu-content-block class="mu-content-block-board">
      
      <div v-if="visitors.length>1 || pageviews.length>1">
      <p class="total-report">Visitors: {{ totalusers }} . Pageviews : {{ totalvisits }}</p>
      <canvas :height="100" id="mycanvas" count="2"></canvas>

      <chartjs-line :labels="days"  :data="visitors"
      :backgroundcolor="'rgba(75,192,192,0.1)'" :bordercolor="'#00c853'" :fill="true"
      :datalabel="' Vistor'"
      :pointborderwidth="4"
      :pointbordercolor="'rgba(22, 160, 133,1.0)'"
      :pointhoverborderwidth="3"
      :pointhoverbackgroundcolor="'#636b6f'"
      :pointhoverbordercolor="'#ffd663'" target="mycanvas"></chartjs-line>

      <chartjs-line :labels="days" :data="pageviews"
      :backgroundcolor="'rgba(52, 152, 219,0.1)'" :bordercolor="'#3498db'" :fill="true"
      :datalabel="' Page View'"
      :pointborderwidth="4"
      :pointbordercolor="'rgba(142, 68, 173,1.0)'"
      :pointhoverborderwidth="3"
      :pointhoverbackgroundcolor="'#636b6f'"
      :pointhoverbordercolor="'#ffd663'" target="mycanvas"></chartjs-line>
      </div>
      
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
          pageviews: [],
          visitors: [],
          totalusers: 0,
          totalvisits: 0,
          interval: null,
          days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
        }
      },

      watch: {
        pageviews: function(val){
          this.pageviews = val;
        },
        visitors: function(val){
          this.visitors = val;
        }
      },

      created() {
        
        if(true){ //TODO
          this.getGoogleAnalytics();
        }

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

        },

        getGoogleAnalytics(){

          var url = window.api_url + 'googleAnalytics';
          url = url.replace('/api/','/');
          var self = this;

          request({method:'GET', 
              url: url
          }, function (er, response, body) {
            var resp = JSON.parse(body);
            
            self.totalvisits = resp.totalsForAllResults['ga:pageviews'];
            self.totalusers  = resp.totalsForAllResults['ga:users'];

            for(var i = 0 ; i < 31 ; i++){
              self.pageviews.push(resp.rows[i][2]);
              self.visitors.push(resp.rows[i][1]);
            }

          });

        }

      }
  }

</script>