<template>
  <div>
    <section class="board">
     
    </section>

    <sidebar></sidebar>
  </div>
</template>


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
          models: []
        }
      },

      created() {
        this.models = JSON.parse(store.state().models);
      },

      methods: {
      
      }
  }

</script>