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

          <div v-if="item.type.toLowerCase()==='file'">
            
            <label>{{ item.label }} : <br /><br /></label>
            <mu-raised-button icon="cloud" v-on:click="browseFile($event)" :id="'upload-'+getItemName(item.label)" label="UPLOAD NOW" class="btn-upload" primary/>
            <input :max-size="item.options.maxSize" :multiple="item.options.multiple" :accept="item.options.allowedTypes" type="file" :dest="item.options.dest" @change="onFileChange" :id="'file-upload-'+getItemName(item.label)" class="hide" />

            <mu-list>
              <mu-list-item :id="'files-list-'+getItemName(item.label)+'-'+index" :title="file.name" class="item-uploaded" v-for="(file,index) in files[getItemName(item.label)]">
                <mu-avatar :src="file.path" slot="leftAvatar"/>
                <span slot="describe">
                  <span>{{ file.size }} - {{ file.type }}</span> 
                </span>
                <mu-icon value="delete" v-on:click="removeImage(getItemName(item.label),index)" class="delete-image" slot="right"/>
              </mu-list-item>
            </mu-list>
          </div>

          <div v-if="item.type.toLowerCase()==='color'">
            <mu-text-field :hintText="item.label" v-on:blur="closePicker()" v-on:focus="openPicker()" type="text" :inputClass="'color-ui-'+getItemName(item.label)" icon="brush"/>
              <div class="colorpicker--wrapper hide">
                <div :class="'color-'+getItemName(item.label)"></div>
              </div>
          </div>

          <div v-if="item.type.toLowerCase()==='code'">
            <label>{{ item.label }}<br /><br /></label>
            <textarea :id="'code-'+getItemName(item.label)"></textarea>
          </div>

          <div v-if="item.type.toLowerCase()==='html'">
            <div v-if="item.options">
              <label>{{ item.label }}<br /><br /></label>
              <quill-editor v-if="item.options"  :v-model="getItemName(item.label)">
                    ref="myQuillEditor"
                    :options="item.options">
              </quill-editor>
            </div>
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
  .item-uploaded{
    width: 50%;
    float: left;
  }
  .Scp-hue{
    width: 10px !important;
    position: absolute !important;
    right: 4px;
    top: 4px;
    height: 95% !important;
  }
  .colorpicker--wrapper{
    margin-bottom: 20px !important;
  }
  .mu-text-field-icon{
    left: -5px !important;
  }
  .CodeMirror-gutters{
    z-index: 1 !important;
  }
  .create--page .mu-dropDown-menu-text-overflow{
    margin-top: 0 !important;
  }
  .btn-upload{
    text-align: center !important;
    margin-bottom: 20px !important;
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
  .delete-image:hover{color: red;}
</style>

<script type="text/javascript">

  const request = require("browser-request");

  import Sidebar from '../components/Sidebar.vue'
  import store from '../store';
  import { quillEditor } from 'vue-quill-editor'
  import CodeMirror from 'codemirror'

  var ColorPicker = require('simple-color-picker');

  require('codemirror/lib/codemirror.css');
  require('simple-color-picker/src/simple-color-picker.css');


  var myCodeMirror;


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
          files: []
        }
      },

      watch: {
        items: function(val){
          this.items = val;
          this.items = this.models[this.name]['configs']['properties'];

          this.itemsModification();
          return val;
        },
        files: function(val){
          this.files = val;
          console.log(this.files)
          console.log('file uplaoded')
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

          var self = this;

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

            if( this.items[item].type.toLowerCase() == 'code'){
              if( typeof this.items[item]['options'] != "undefined"){
                  self.generateCodeMirror('code-'+item,this.items[item]['options']);
              } else {
                  self.generateCodeMirror('code-'+item,{} );
              }
            }

            if( this.items[item].type.toLowerCase() == 'color'){
              this.generateColorPicker('color-'+item);
            }

            if( this.items[item].type.toLowerCase() == 'file'){
              if( typeof this.items[item]['options'] != "undefined"){

                  if( typeof this.items[item]['options']['maxSize'] == "undefined" )
                    this.items[item]['options']["maxSize"] = 2000;
                  if( typeof this.items[item]['options']['dest'] == "undefined" )
                    this.items[item]['options']["dest"] = '/static';
                  if( typeof this.items[item]['options']['allowedTypes'] == "undefined" )
                    this.items[item]['options']["allowedTypes"] = 'image/png,image/jpeg,image/gif';
                  if( typeof this.items[item]['options']['multiple'] == "undefined" )
                    this.items[item]['options']["multiple"] = false;

              } else{
                this.items[item]['options']["maxSize"] = 2000;
                this.items[item]['options']["dest"] = '/static';
                this.items[item]['options']["allowedTypes"] = 'image/png,image/jpeg,image/gif';
                this.items[item]['options']["multiple"] = false;
              }
              this.items[item].op
            }

            if( this.items[item].type.toLowerCase() == 'html'){
              this.editorOptions[item] = this.items[item].options;
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
          var name = 'rewatcher';
          for(var item in this.items){
            if(this.items[item].label==label){
              name = item;
              break;
            }
          }
          return name;
        },
        change(event,e){
          document.getElementById(this.getItemName(e.label)+'-slider').innerHTML = event;
        },
        createOptions(label){
          return {
            'theme': 'bubble',
            'placeholder': "输入任何内容，支持html"
          }
        },
        generateCodeMirror(el,options){
          setTimeout(function(){
            var myTextArea = document.getElementById(el);
            require('codemirror/mode/'+options.mode+'/'+options.mode);
            myCodeMirror = CodeMirror(function(elt) {
              myTextArea.parentNode.replaceChild(elt, myTextArea);
            }, options);
          },1000);
        },
        generateColorPicker(el){

          setTimeout(function(){

            var colorPicker = new ColorPicker({
              color: '#FF0000',
              background: '#454545',
              el: document.querySelector('.'+el),
              width: 200,
              height: 150
            });

            colorPicker.onChange(function(color){
              this.$el.parentNode.parentNode.parentNode.querySelector('.mu-text-field-hint').innerHTML = color;
            });

          },1000);

        },
        closePicker(){
          var el = document.querySelector('.colorpicker--wrapper');
          el.classList.add('hide');
        },
        openPicker(){
          var el = document.querySelector('.colorpicker--wrapper');
          el.classList.remove('hide');
        },
        browseFile(event){
          var id = event.target.parentNode.parentNode.getAttribute('id');
          document.getElementById('file-'+id).click()
        },
        onFileChange(e) {
          var files = e.target.files || e.dataTransfer.files;
          if (!files.length)
            return;

          console.log(files)
          for(var i = 0 ; i<files.length ; i++)
            this.createImage(files[i],e.target.getAttribute('id'));
        },
        createImage(file,el) {
          console.log(file)
          var name = el.split('upload-')[1], vm = this;
          var maxSizeAllow = document.getElementById(el).getAttribute('maxSize');
          var self = this;
          var image = new Image();
          var reader = new FileReader();

          var file_name = file.name;
          var file_type = file.type;
          var file_size = parseInt(file.size/100);

          if(file_size>parseInt(maxSizeAllow) ){
            self.message = 'File size is more than maximum file size rule';
            self.showSnackbar('error');
            return;
          }

          reader.onload = (e) => {
            var tmp = this.files;
            if(typeof tmp[name] == "undefined"){
              tmp[name] = []
              vm.files = tmp;
            }

            tmp[name].push({path:e.target.result,size:file_size,type:file_type,name:file_name});
            vm.files = ['rewatcher'];
            vm.files = tmp;
            
              //var id = body.id;
          request({method:'POST', 
              url: window.api_url+'uploads/files/upload',
              json: { "file": [vm.files[name][vm.files[name].length-1]] },
              headers: {
                'Content-Type' : 'application/json' ,
                'Authorization': store.get('flashboard_token')
              }
          }, function (er, response, body) {
            if(er)
              throw er

            console.log(body)
              
            });
                
          };
          reader.readAsDataURL(file);
        },
        removeImage: function (e,index) {

          delete this.files[e][index]

          if(index == 0)
            delete this.files[e];

          var child = document.getElementById('files-list-'+e+'-'+index);
          child.parentNode.removeChild(child);
        }

      }
  }

</script>