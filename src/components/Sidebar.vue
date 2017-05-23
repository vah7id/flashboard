<template>
  <div>
  <mu-drawer left :open="open">
    <mu-appbar class="mu-bar" title="FLASHBOARD" />
    <mu-list class="sidebar-panel">
      <mu-list-item href="#/dashboard" title="Dashboard"/>
      <div v-for="item in models">
        <mu-list-item :href="'#/'+item.name" :title="item.name"/>
      </div>
      <mu-list-item href="#/connector" title="Database Connector"/>
      <mu-list-item href="http://127.0.0.1:3000/explorer" title="API Explorer"/>
      <mu-list-item href="#/api" title="API Documentation"/>
      
    </mu-list>
  </mu-drawer>

  </div>
</template>

<style lang="css">
.sidebar-panel{
  margin-top: 100px;
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
          models: []
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
        }
      },
      created() {
        this.models = JSON.parse(store.state().models);
        this.name   = store.state().current_model;
      },
      computed: {
        name: function () {
          return store.get('current_model');
        }
      },
      methods: {


      }
  }

</script>