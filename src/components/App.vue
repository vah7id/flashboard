<template>
   <div id="app">
    <div id="wrapper">

      <mu-linear-progress id="top-loading" mode="indeterminate" />

      <mu-appbar id="page--title">
        <mu-avatar slot="right" src="/src/assets/avatar.jpg" :size="35"/>
        <mu-icon-menu icon="more_vert" slot="right">
          <mu-menu-item href="/profile/me" title="Edit Profile"/>
          <mu-menu-item v-on:click="logout" title="Sign Out"/>
        </mu-icon-menu>
      </mu-appbar>

      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>

</template>

<style lang="css">
  #top-loading{
    z-index: 11;
    position: fixed !important;
    top: 0;
    width: 100%;
    right: 0;
  }
  .mu-text-field.has-icon .mu-text-field-focus-line{
    left: 30px !important;
  }
  #page--title{
    padding-left: 280px;
  }
  .hide{
    display: none !important;
  }
  .mu-appbar{
    position: fixed;
  }
  
</style>

<script type="text/javascript">

  import { checkAuth } from '../filters'
  const request = require("browser-request");
  import store from '../store';

  require('jquery');

  module.exports = {

      name: 'app',

      data: function(){
        return {
          loading: true,
          configs: [],
          models: []
        }
      },

      watch: {
        models: function(val) {
            this.models = val;
            store.set('models',JSON.stringify(val))
            return val;
        }
      },
      created(){
        this.models = JSON.parse(store.state().models);
        checkAuth(api_url);
        this.fetchModelsDetail();
      },
      mounted: function(){
        
      },
      methods: {
        logout(){
            request({method:'POST', 
                url: window.api_url+'Users/logout',
                headers: {
                  'Authorization': store.get('flashboard_token')
                }
            }, function (er, response, body) {
              if(er)
                throw er
              
              if(typeof body['error'] != "undefined"){
                alert(body.error.message)
              } else{
                store.clearAll();
                window.location.assign('#/login');
              }

            });
        },
        fetchModelsDetail(){
          
          var self = this;
          var count = 0, _models = [];

          for(var m in self.models)
            _models.push(m);


          do {
            self.getConfigs(_models[count],count);
            count++;
          }
          while(count<store.get('models_count'))
       
        },

        getConfigs(model,count){
   
          var self = this;
          var _dir = 'models/'+model+'.json';

          if(model=='User')
            _dir = model+'.json';

          request({method:'GET', 
              url: '/api/common/'+_dir
          }, function (er, response, body) {
            if(er)
              throw er

            self.configs[ model ] = JSON.parse(body);

            if(count==store.get('models_count')-1){

              for(var config in self.configs){
                self.models[config]['configs'] = self.configs[config];
                self.models[config]['count'] = 0;
                self.getModelsCount(config);
              }

              store.set('models',JSON.stringify(self.models));
              self.$root.models = self.models;
            }

          });

        },

        getModelsCount(model){

          var self = this, _model = model;

          if(self.models[model].configs.plural != undefined)
            _model = self.models[model].configs.plural;

          if(model == 'User')
            _model = 'Users';

          request({method:'GET', 
              url: window.api_url+_model+'/count'
          }, function (er, response, body) {
            if(er)
              throw er

              var resp = JSON.parse(body);
              
              if(resp['error'])
                throw resp['error'].message;
              else
                self.models[model]['count'] = resp.count;
              
              //document.querySelector('.mu-linear-progress').classList.add('hide');

              store.set('models',JSON.stringify(self.models));
              self.models = JSON.parse(store.get('models'));
              self.$root.models = self.models;

          });

        }
      }
  }

</script>