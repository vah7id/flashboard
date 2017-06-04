import Vue from 'vue'
import VueRouter from 'vue-router'

import ModelListView from './components/ModelList.vue'
import ModelEditView from './components/ModelEdit.vue'
import ModelCreateView from './components/ModelCreate.vue'

import VueQuillEditor from 'vue-quill-editor'

import store from './store';

import LoginView from './components/Login.vue'
import DashboardView from './components/Dashboard.vue'
import UnavailableView from './components/Unavailable.vue'

import { checkAuth, domain, fromNow } from './filters'

import App from './components/App.vue'

import 'whatwg-fetch'

import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-carbon.css'


Vue.use(MuseUI)
Vue.use(VueQuillEditor)


const api_port = '3000', 
      protocol = 'http://';

var   host     = protocol+window.location.hostname;

if(host == 'http://localhost')
    host = 'http://127.0.0.1';

const api_url = host +':'+api_port+'/api/';

window.api_url = api_url;

// install router

fetch('/api/server/model-config.json')
.then(function(response) {
  response.json().then(function(models) {
    
    var _models = models, _counter = 0;

    delete _models.ACL;
    delete _models.AccessToken;
    delete _models.Role;
    delete _models._meta;
    delete _models.RoleMapping;

    for(var m in _models){
      var model = _models[m];
      model['name'] = m;
      model['icon'] = 'folder';

      if(m=='User')
        model['icon'] = 'people';

      _counter++;
    }

    store.set('models',JSON.stringify(_models))
    store.set('models_count',_counter)


    var _routes = {
      routes: [
        { path: '', component: DashboardView, name: 'Dashboard' },
        { path: '/dashboard', component: DashboardView, name: 'dashboard' },
        { path: '/login', component: LoginView, name: 'login' },
        { path: '/unavailable', component: UnavailableView, name: 'unavailable' }
      ]
    };

    for(var model in models){
        _routes.routes.push({ path: '/'+model, component: ModelListView, name: model  });
        _routes.routes.push({ path: '/'+model+'/create', component: ModelCreateView, name: model });
        _routes.routes.push({ path: '/'+model+'/:id', component: ModelEditView , name: model });
    }

    _routes.routes.push({
       path: '*',
       redirect: ''
    });

    Vue.use(VueRouter);

    // Create the router instance and pass the `routes` option
    // You can pass in additional options here, but let's
    // keep it simple for now.
    const router = new VueRouter({
     routes: _routes.routes,
     history:true
    })

    router.beforeEach(function (to, from, next) {
      window.scrollTo(0, 0);
    
      if(document.querySelector('.mu-linear-progress') != null)
        document.querySelector('.mu-linear-progress').classList.remove('hide');
    
        next();

    });

    router.afterEach(function (route) {      
      store.set('current_model',route.name);
      document.title = route.name;
    });

    //instatinat the vue instance
    new Vue({
      //define the selector for the root component
      el: '#app',
      data(){
        return {
          models: []
        }
      },
      watch:{
        models: function(val){
          this.$root.models = val;
          return val;
        }
      },
      //pass the template to the root component
      template: '<App/>',
      //declare components that the root component can access
      components: { App },
      //pass in the router to the vue instance
      router
    }).$mount('#app')//mount the router on the app

  });

}).then(function(json) {

}).catch(function(ex) {
  console.log('parsing failed', ex)
});


