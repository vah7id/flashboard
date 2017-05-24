<template>
  <div>
  
   <sidebar></sidebar>

   <mu-content-block class="mu-content-block-board create--page">
      <mu-snackbar :actionColor="actionColor" v-if="snackbar" :message="message" :action="action" @actionClick="hideSnackbar" @close="hideSnackbar"/>

      <h1 class="page--title"><a :href="'#/'+name">{{ label }}</a> . Create Item</h1>

      <form class="fields--container">
        <div class="field--item" v-for="(item,index) in items">

          <div v-if="item.type.toLowerCase()==='string' || item.type.toLowerCase()==='Text'">
             <mu-text-field type="text"  v-if="item.label" :label="item.label" labelFloat/>
          </div>

          <div v-if="item.type.toLowerCase()==='password'">
             <mu-text-field type="password"  v-if="item.label" :label="item.label" labelFloat/>
          </div>

          <div v-if="item.type.toLowerCase()==='email'">
             <mu-text-field type="email"  v-if="item.label" :label="item.label" labelFloat/>
          </div>

          <div v-if="item.type.toLowerCase()==='number'">
             <mu-text-field type="number"  v-if="item.label" :label="item.label" labelFloat/>
          </div>

          <div v-if="item.type.toLowerCase()==='textarea'">
             <mu-text-field :hintText="item.label" multiLine :rows="3" :rowsMax="6"/>
          </div>

          <div v-if="item.type.toLowerCase()==='boolean'">
            <mu-switch :label="item.label" class="demo-switch" />
          </div>
          
          <div v-if="item.type.toLowerCase()==='money'">
            <mu-text-field :hintText="item.label" type="number" icon="attach_money"/>
          </div>

          <div v-if="item.type.toLowerCase()==='url'">
            <mu-text-field :hintText="item.label" type="text" icon="http"/>
          </div>

          <div v-if="item.type.toLowerCase()==='name'">
            <mu-text-field label="firstname" type="text" style="margin-right:20px" labelFloat/>
            <mu-text-field label="lastname" type="text" labelFloat/>
          </div>

          <div v-if="item.type.toLowerCase()==='location'">
            <label style="margin-right:20px">{{ item.label }} : </label>
            <mu-text-field label="latitude" type="text" style="margin-right:20px" labelFloat/>
            <mu-text-field label="langitude" type="text" labelFloat/>
          </div>

          <div v-if="item.type.toLowerCase()==='date'">
            <label>{{ item.label }} : <br /></label>
            <mu-date-picker :format="item.options.format" :value="today" mode="landscape" :dateTimeFormat="enDateFormat" okLabel="PICK" cancelLabel="CANCEL" autoOk="true" :hintText="item.label"/>
          </div>

          <div v-if="item.type.toLowerCase()==='time'">
            <label>{{ item.label }} : <br /></label>
            <mu-time-picker :hintText="item.label" okLabel="PICK" cancelLabel="CANCEL" mode="landscape" />
          </div>

          <div v-if="item.type.toLowerCase()==='color'">
            <mu-text-field :hintText="item.label" value="ab2567" inputClass="jscolor" type="text" icon="http"/>
          </div>

          <div v-if="item.type.toLowerCase()==='html'">
            <label>{{ item.label }}<br /><br /></label>
            <quill-editor v-if="item.options"  :v-model="getItemName(item.label)">
                  ref="myQuillEditor"
                  :options="item.options">
            </quill-editor>
          </div>
          <div v-if="item.type.toLowerCase()==='slider'">
            <label>{{ item.label }} ( <span :id="getItemName(item.label)+'-slider'">{{ item.default }}</span> )</label>
            <mu-slider v-model="item.default" v-on:change="change($event,item)" :step="item.options.step" :min="item.options.min" :max="item.options.max" />
          </div>

          <div v-if="item.type.toLowerCase()==='select'">
            <mu-select-field :labelFocusClass="['label-foucs']" :label="item.label">
              <mu-menu-item v-for="text,index in item.options" :key="index" :value="text.value" :title="text.label" />
            </mu-select-field>
          </div>

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
  .mu-text-field-icon{
    left: -5px !important;
  }
  .create--page .mu-dropDown-menu-text-overflow{
    margin-top: 0 !important;
  }
  .page--title{
    margin-top: 0;
  }
  .mu-text-field.has-icon{
    padding-left: 30px !important;
  }
  .mu-text-field.has-icon .mu-text-field-line{
    left: 30px !important;
  }
  .mu-slider{
    width: 40% !important;
    margin-left: 5px;
  }
  .field--item{
    float: left;
    width: 100%;
    padding: 5px 20px;
  }
  .ql-toolbar{
    width: 70%;
  }
  .ql-container{
    min-height: 200px;
    width: 70%;
  }
</style>

<script type="text/javascript">

  import Sidebar from '../components/Sidebar.vue'
  import store from '../store';
  import { quillEditor } from 'vue-quill-editor'

  const dayAbbreviation = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec']
  const monthLongList = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const enDateFormat = {
    formatDisplay (date) {
      return `${dayList[date.getDay()]}, ${monthList[date.getMonth()]} ${date.getDate()}`
    },
    formatMonth (date) {
      return `${monthLongList[date.getMonth()]} ${date.getFullYear()}`
    },
    getWeekDayArray (firstDayOfWeek) {
      let beforeArray = []
      let afterArray = []
      for (let i = 0; i < dayAbbreviation.length; i++) {
        if (i < firstDayOfWeek) {
          afterArray.push(dayAbbreviation[i])
        } else {
          beforeArray.push(dayAbbreviation[i])
        }
      }
      return beforeArray.concat(afterArray)
    }
  }

  export default {

      name: 'ModelCreateView',

      components: {
        Sidebar,
        quillEditor
      },
      data () {
        return {
          models: [],
          items: [],
          today: null,
          label: '',
          defaultSelect: '',
          name: '',
          interval: null,
          trigger: null,
          snackbar: false,
          message: '',
          action: 'error',
          enDateFormat,
          editorOptions:[],
          defaultOptions: {
            theme: 'bubble',
            placeholder: "输入任何内容，支持html",
            modules: {
              toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
              ]
            }
          }
        }
      },

      watch: {
        items: function(val){
          this.items = val;
          this.items = this.models[this.name]['configs']['properties'];
          this.itemsModification();
          return val;
        },
        editorOptions: function(val){
          this.editorOptions = val;
          return val;
        },
        models: function(val) {
            this.$root.models = val;
            this.models = val;
            if(typeof this.models[this.name]['configs'] != "undefined"){
              this.items = this.models[this.name]['configs']['properties'];
            }

            return JSON.parse(store.get('models'));
        }
      },

      created() {
        this.name = store.state().current_model;
        this.label = this.name;
        this.models = JSON.parse(store.state().models);

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10)
            dd='0'+dd;
        if(mm<10)
            mm='0'+mm;

        this.today = yyyy+'-'+mm+'-'+dd;

      },

      mounted(){
        var self = this;
        this.interval = setInterval(function(){
          if(self.$root.models[self.name]['configs']){

              if(typeof self.$root.models[self.name].label != "undefined")
                self.label = self.$root.models[self.name].label;

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
        itemsModification(){
          delete this.items['id'];
          for(var item in this.items){
            if( typeof this.items[item].label == "undefined" ){
              this.items[item]['label'] = item;
            }

            if( this.items[item].type.toLowerCase() == 'date'){
              if( typeof this.items[item]['options'] == "undefined"){
                this.items[item]['options'] = {'format': 'YYYY-MM-DD'};
              }
            }

            if( this.items[item].type.toLowerCase() == 'html'){
              this.editorOptions[item] = this.items[item].options;
              console.log(this.editorOptions)
            }

            if( this.items[item].type.toLowerCase() == 'slider'){

              if( typeof this.items[item]['default'] == "undefined"){
                this.items[item]['default'] = 0;
              }

              if( typeof this.items[item]['options'] != "undefined"){
                  
                  if( typeof this.items[item]['options']['min'] == "undefined" )
                      this.items[item]['options']['min'] = 0;

                  if( typeof this.items[item]['options']['max'] == "undefined" )
                    this.items[item]['options']['max'] = 100;

                  if( typeof this.items[item]['options']['step'] == "undefined" )
                    this.items[item]['options']['step'] = 10;


              } else{
                this.items[item]['options']['step'] = 10;
                this.items[item]['options']['min'] = 0;
                this.items[item]['options']['max'] = 100;
              }

              this.items[item]['value'] = this.items[item]['default'];

            }


            if(this.items[item].type.toLowerCase() == 'select'){
              var options = this.items[item]['options'];
              for(var i = 0 ; i < options.length ; i++){
                var option = options[i];
                if( typeof options[i].value == "undefined"){
                  options[i] = {'value':option,'label':option}
                }
              }
            }
          }
        },
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
        getItemName(label){
          var name = 'sag';
          for(var item in this.items){
            console.log(this.items[item].label)
            if(this.items[item].label==label){
              name = item;
              break;
            }
          }
          console.log(name)
          return name;
        },
        change(event,e){
          console.log(event)
          document.getElementById(this.getItemName(e.label)+'-slider').innerHTML = event;
        },
        createOptions(label){
          return {
            'theme': 'bubble',
            'placeholder': "输入任何内容，支持html"
          }
        }

      }
  }

</script>