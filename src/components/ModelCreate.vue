<template>
  <div>
  
   <sidebar></sidebar>

   <mu-content-block class="mu-content-block-board">
      <mu-snackbar :actionColor="actionColor" v-if="snackbar" :message="message" :action="action" @actionClick="hideSnackbar" @close="hideSnackbar"/>

      <h1 class="page--title"><a :href="'#/'+name">{{ label }}</a> . Create Item</h1>

      <form class="fields--container">
        <div class="field--item" v-for="(item,index) in items">

          <label v-if="item.label">{{ item.label }}</label>
          <label v-else="item.label">{{ index }}</label>

          <div v-if="type==='string'"></div>
        </div>
      </form>

    </mu-content-block>

  </div>
</template>

<style lang="css">
  .mu-content-block-board{
    width: calc(100% - 280px) !important;
    float: right;
  }
  .page--title{
    margin-top: 0;
  }
  .field--item{
    float: left;
    width: 100%;
    padding: 20px;
  }
</style>

<script type="text/javascript">

  import Sidebar from '../components/Sidebar.vue'
  import store from '../store';

  export default {

      name: 'ModelCreateView',

      components: {
        Sidebar
      },
      data () {
        return {
          models: [],
          items: [],
          label: '',
          name: '',
          interval: null,
          trigger: null,
          snackbar: false,
          message: '',
          action: 'error',
        }
      },

      watch: {
        items: function(val){
          this.items = val;
          this.items = this.models[this.name]['configs']['properties'];
          delete this.items['id'];
          return val;
        },
        models: function(val) {
            this.$root.models = val;
            this.models = val;
            this.items = this.models[this.name]['configs']['properties'];
            return JSON.parse(store.get('models'));
        }
      },

      created() {
        this.name = store.state().current_model;
        this.label = this.name;
        this.models = JSON.parse(store.state().models);

      },

      mounted(){
        var self = this;
        this.interval = setInterval(function(){
          if(self.$root.models[self.name]['configs']){

              if(typeof self.$root.models[self.name].label != "undefined")
                self.label = self.$root.models[self.name].label;

              console.log(self.label)
              self.models = self.$root.models;
              self.total = self.models[self.name].count;
              self.count = self.models[self.name].count;

              document.querySelector('.mu-appbar').classList.remove('hide')
              document.querySelector('.mu-linear-progress').classList.add('hide');

              self.interval = clearInterval(self.interval);
          }
        },2000);

      },

      methods: {

        showSnackbar (action) {
          this.snackbar = true
          this.action = action;
          if(this.action=='success')
            this.actionColor = 'green'
          else
            this.actionColor = 'red'

          if (this.snackTimer) clearTimeout(this.snackTimer)
          this.snackTimer = setTimeout(() => { this.snackbar = false }, 2000)
        },
        hideSnackbar () {
          this.snackbar = false
          if (this.snackTimer) clearTimeout(this.snackTimer)
        },

      }
  }

</script>