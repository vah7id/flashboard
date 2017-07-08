
<template>
  <div>
  
   <sidebar></sidebar>

   <mu-content-block class="mu-content-block-board create--page">

      <mu-snackbar :actionColor="actionColor" v-if="snackbar" :message="_t(message)" :action="action" @actionClick="hideSnackbar" @close="hideSnackbar"/>

      <h1 class="page--title"><a :href="'#/'+name">{{ label }}</a> . {{ _t('edit_item') }}</h1>

      <form class="fields--container">
        <div class="field--item" v-for="(item,index) in items">

          <div v-if="item.ui_type.toLowerCase()==='string' || item.ui_type.toLowerCase()==='text'">
             <mu-text-field type="text" :value="data[getItemName(item.label)]" :name="getItemName(item.label)"  v-if="item.label" :label="item.label" labelFloat/>
             <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='password'">
             <mu-text-field type="password" :value="data[getItemName(item.label)]" :name="getItemName(item.label)" v-if="item.label" :label="item.label" labelFloat/>
             <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='email'">
             <mu-text-field type="email" :value="data[getItemName(item.label)]" :name="getItemName(item.label)" v-if="item.label" :label="item.label" labelFloat/>
             <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='number'">
             <mu-text-field type="number" :value="data[getItemName(item.label)]" :name="getItemName(item.label)" v-if="item.label" :label="item.label" labelFloat/>
             <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='textarea'">
             <mu-text-field :value="data[getItemName(item.label)]" :name="getItemName(item.label)" :hintText="item.label" :label="item.label" multiLine :rows="3" :rowsMax="6"/>
             <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='boolean'">
            <mu-switch v-model="data[getItemName(item.label)]" :label="item.label" :name="getItemName(item.label)" class="demo-switch" />
            <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
          </div>
          
          <div v-if="item.ui_type.toLowerCase()==='money'">
            <mu-text-field :value="data[getItemName(item.label)]" :name="getItemName(item.label)" :hintText="item.label" type="number" :label="item.label" icon="attach_money"/>
            <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='url'">
            <mu-text-field :name="getItemName(item.label)" :value="data[getItemName(item.label)]" :label="item.label" :hintText="item.label" type="text" icon="http"/>
            <p class="validation" :id="'validation-'+getItemName(item.label)"></p>

          </div>

          <div v-if="item.ui_type.toLowerCase()==='name'" :id="'name-'+getItemName(item.label)">
            <mu-text-field label="firstname" :value="data[getItemName(item.label)].firstname" class="firstname" type="text" style="margin-right:20px" labelFloat/>
            <mu-text-field label="lastname" :value="data[getItemName(item.label)].lastname" class="lastname" type="text" labelFloat/>
            <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='geopoint'" :id="'location-'+getItemName(item.label)">
            <label style="margin-right:20px">{{ item.label }} : </label>
            <mu-text-field label="latitude" :value="data[getItemName(item.label)].lat" class="lat" type="text" style="margin-right:20px" labelFloat/>
            <mu-text-field label="langitude" :value="data[getItemName(item.label)].lng" class="lng" type="text" labelFloat/>
            <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='date'">
            <label>{{ item.label }} : <br /></label>
            <mu-date-picker :value="data[getItemName(item.label)]" :id="'data-picker-'+getItemName(item.label)" :name="getItemName(item.label)" :format="item.options.format"  mode="landscape" :dateTimeFormat="enDateFormat" okLabel="PICK" cancelLabel="CANCEL" autoOk="true" :hintText="item.label"/>
            <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='time'">
            <label>{{ item.label }} : <br /></label>
            <mu-time-picker :value="data[getItemName(item.label)]" :id="'data-picker-'+getItemName(item.label)" :hintText="item.label" okLabel="PICK" cancelLabel="CANCEL" mode="landscape" />
            <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='file'">
            
            <label>{{ item.label }} : <br /><br /></label>
            <mu-raised-button icon="cloud" v-on:click="browseFile($event)" :id="'upload-'+getItemName(item.label)" :label="_t('upload_now')" class="btn-upload" primary/>
            
            <form method="POST" action="http://127.0.0.1:3000/api/uploads/files/upload" v-on:submit.prevent="submitForm($event,getItemName(item.label))">
              <input :name="'file-upload-'+getItemName(item.label)" :max-size="item.options.maxSize" :multiple="item.options.multiple" :accept="item.options.allowedTypes" type="file" :dest="item.options.dest" @change="onFileChange" :id="'file-upload-'+getItemName(item.label)" class="hide" />
              <input type="submit" name="submit" class="hide" />
            </form>

            <p class="validation" :id="'validation-'+getItemName(item.label)"></p>

            <mu-list class="file-items">
              <mu-list-item :data-name="file.name" :id="'files-list-'+getItemName(item.label)+'-'+index" :title="file.name" class="item-uploaded" v-for="(file,index) in files[getItemName(item.label)]">
                <mu-avatar :src="file.path" slot="leftAvatar"/>
                <span slot="describe">
                  <span>{{ file.size }} kb - {{ file.type }}</span> 
                </span>
                <mu-icon value="delete" disabled="disabled" v-on:click="removeImage(getItemName(item.label),index)" class="delete-image" slot="right"/>
                <mu-linear-progress />
              </mu-list-item>
            </mu-list>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='color'">
            <mu-text-field :name="getItemName(item.label)" :hintText="item.label" v-on:blur="closePicker()" v-on:focus="openPicker()"  :value="data[getItemName(item.label)]" type="text" :inputClass="'color-ui-'+getItemName(item.label)" icon="brush"/>
              <div class="colorpicker--wrapper hide">
                <div :class="'color-'+getItemName(item.label)"></div>
              </div>
            <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='code'">
            <label>{{ item.label }}<br /><br /></label>
            <textarea  :value="data[getItemName(item.label)]" :id="'code-'+getItemName(item.label)">
              {{ data[getItemName(item.label)] }}
            </textarea>
            <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='html'">
            <div v-if="item.options">
              <label>{{ item.label }}<br /><br /></label>
              <quill-editor @change="onEditorBlur($event,getItemName(item.label))" :name="getItemName(item.label)" :content="data[getItemName(item.label)]" v-if="item.options">
                :ref="'myQuillEditor-'+getItemName(item.label)"
                :options="item.options">
              </quill-editor>
              <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
            </div>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='slider'">
            <label>{{ item.label }} ( <span :id="getItemName(item.label)+'-slider'">{{ data[getItemName(item.label)] }}</span> )</label>
            <mu-slider :value="data[getItemName(item.label)]" v-on:change="change($event,item)" :step="item.options.step" :min="item.options.min" :max="item.options.max" />
            <p class="validation" :id="'validation-'+getItemName(item.label)"></p>
          </div>

          <div v-if="item.ui_type.toLowerCase()==='select'">
            <mu-select-field :value="data[getItemName(item.label)]" :name="getItemName(item.label)" :labelFocusClass="['label-foucs']" :label="item.label">
              <mu-menu-item v-for="text,index in item.options" :key="index" :value="text.value" :title="text.label" />
            </mu-select-field>
            <p class="validation" :id="'validation-'+getItemName(item.label)"></p>

          </div>


        </div>
        <div class="row">
          <mu-raised-button icon="save" :label="_t('save_item')" v-on:click="createModel()" class="btn--save" primary/>
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
  .validation{
    color: red;
    width: 100%;
    float: left;
    margin-top: -5px !important;
    font-size: 13px;
  }
  .item-uploaded{
    width: 50%;
    float: left;
  }
  .btn--save{
    float: left;
    width: 200px;
    margin: 20px 20px 50px 20px !important;
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
  .file-items .mu-linear-progress{
    margin-top: 5px;
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


  var myCodeMirror = [];


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

      name: 'ModelEditView',

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
          files: [],
          editors: [],
          data: []
        }
      },

      watch: {
        items: function(val){
          this.items = val;
          if(typeof this.models[this.name]['configs'] != "undefined"){
            this.items = this.models[this.name]['configs']['properties'];
            this.itemsModification();
          }
          return val;
        },
        label: function(val){
          this.label = val;
        },
        files: function(val){
          this.files = val;
          return val;
        },
        $route: function(val){
          this.label = '';
          this.initial();
          this.fetchModel();
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
              this.itemsModification();
            }

            return JSON.parse(store.get('models'));
        }
      },

      created() {
        this.initial();
      },

      mounted(){
        this.fetchModel();
      },

      methods: {

        _t (key){
          
          var keys = this.$root.keys;

          if(keys[key] != null)
            return keys[key]

          return key;

        },

        fetchModelData(){

          var _id = window.location.href.split(this.name+'/')[1], self=this;
          var name = this.name;

          if(name == 'User')
            name = 'Users';
          
          request({method:'GET', 
              url: window.api_url+name+'/'+_id
          }, function (er, response, body) {
            
            if(!er){
              self.data = JSON.parse(body);
              self.storeFiles();
              self.itemsModification();

              document.querySelector('.mu-appbar').classList.remove('hide')
              document.querySelector('.mu-linear-progress').classList.add('hide');

            }

            if(er)
              throw er
          });

        },

        fetchModel(){
          
          var self = this;

          this.interval = setInterval(function(){

            if(self.$root.models[self.name]['configs']){

                if(typeof self.$root.models[self.name].label != "undefined")
                  self.label = self.$root.models[self.name].label;

                self.models = self.$root.models;
                self.total = self.models[self.name].count;
                self.count = self.models[self.name].count;
                self.fetchModelData();

                self.interval = clearInterval(self.interval);
            }

          },2000);


        },

        getLabel(){

           if( typeof this.$root.models[this.name]['configs'] !== "undefined"){

              if( typeof this.$root.models[this.name]['configs']['label'] !== "undefined")
                this.label = this.$root.models[this.name]['configs']['label'];
              else
                this.label = this.$root.models[this.name]['configs'].name;
            }

        },

        initial(){

            this.name = store.state().current_model;
            this.models = JSON.parse(store.state().models);
            var self = this;

            setTimeout(function(){
              self.getLabel();
            },1000);

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

        storeFiles(){

          var self = this;

          for(var item in this.items){
            if(this.items[item].uiType=="file"){
              self.files[item] = self.data[item];
            }
          }
          
          setTimeout(function(){

            var progress = document.querySelectorAll('.mu-linear-progress');
            for(var i = 0 ; i < progress.length ; i++)
              progress[i].classList.add('hide');

          },1000);

        },

        changeForm(){
          document.querySelector('.btn--save').classList.remove('disabled');
          document.querySelector('.btn--save').removeAttribute('disabled');
        },

        itemsModification(){

          var self = this;


          delete this.items['id'];

          for(var item in this.items){

            if(self.isHiddenProp(item)){
              delete this.items[item];
              continue;
            }

            if( typeof this.items[item].label == "undefined" ){
              this.items[item]['label'] = item;
            }

            if( typeof this.items[item].required == "undefined" ){
              this.items[item].required = false;
            }

           if( typeof this.items[item].uiType == "undefined")
              this.items[item].ui_type = this.items[item].type;
            else
              this.items[item].ui_type = this.items[item].uiType


            if( this.items[item].ui_type.toLowerCase() == 'date'){
              if( typeof this.items[item]['options'] == "undefined"){
                this.items[item]['options'] = {'format': 'YYYY-MM-DD'};
              }
            }

            if( this.items[item].ui_type.toLowerCase() == 'code'){
              if( typeof this.items[item]['options'] != "undefined"){
                  self.generateCodeMirror('code-'+item,this.items[item]['options'],item);
              } else {
                  self.generateCodeMirror('code-'+item,{},item );
              }
            }

            if( this.items[item].ui_type.toLowerCase() == 'color'){
              this.generateColorPicker('color-'+item);
            }

            if( this.items[item].ui_type.toLowerCase() == 'file'){
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

            }

            if( this.items[item].ui_type.toLowerCase() == 'html'){
              this.editorOptions[item] = this.items[item].options;
            }

            if( this.items[item].ui_type.toLowerCase() == 'slider'){

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


            if(this.items[item].ui_type.toLowerCase() == 'select'){
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
          this.snackTimer = setTimeout(() => { this.snackbar = false }, 5000)
        },
        hideSnackbar () {
          this.snackbar = false
          if (this.snackTimer) clearTimeout(this.snackTimer)
        },
              isHiddenProp(name){
          if( typeof this.models[this.name]['configs']['hidden'] != "undefined"){
            var hiddens = this.models[this.name]['configs']['hidden'];
            for( var i = 0 ; i<hiddens.length ; i++){
              if(hiddens[i]==name)
                return true;
            }
            return false;
          }
          return false;
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
        generateCodeMirror(el,options,name){
          setTimeout(function(){
            var myTextArea = document.getElementById(el);
            require('codemirror/mode/'+options.mode+'/'+options.mode);
            console.log(el)
            options['value'] = document.getElementById(el).innerHTML;
            myCodeMirror[name] = CodeMirror(function(elt) {
              myTextArea.parentNode.replaceChild(elt, myTextArea);
            }, options);
          },1000);
        },
        generateColorPicker(el){

          setTimeout(function(){

            if(!document.querySelector('.Scp')){
             
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

            }

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

          for(var i = 0 ; i<files.length ; i++)
            this.createImage(files[i],e.target.getAttribute('id'));
        },
        createImage(file,el) {

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

          document.getElementById('file-upload-'+name).parentNode.querySelector('input[type="submit"]').click();

          reader.onload = (e) => {
            var tmp = this.files;
            if(typeof tmp[name] == "undefined"){
              tmp[name] = []
              vm.files = tmp;
            }

            tmp[name].push({path:e.target.result,size:file_size,type:file_type,name:file_name});
            vm.files = ['rewatcher'];
            vm.files = tmp;
            
          };
          reader.readAsDataURL(file);
        },

        createModel(){
        
          var json = {};
          var self = this;

          document.getElementById('top-loading').classList.remove('hide');

          for(var item in this.items){
       
            var type = this.items[item].ui_type.toLowerCase();

            if( type == 'string' || type == 'password' || type=='textarea' || type=="number" || type == 'money' || type=='url' || type=='text'){

              if( document.querySelector('input[name="'+item+'"]') )
                json[item] = document.querySelector('input[name="'+item+'"]').value;
              else
                json[item] = document.querySelector('textarea[name="'+item+'"]').value;

            }

            if(type == 'color'){
              json[item] = document.querySelector('input[name="'+item+'"]').parentNode.querySelector('.mu-text-field-hint').innerHTML;
            }

            if(type == 'boolean'){
              json[item] = document.querySelector('input[name="'+item+'"]').checked;
            }

            if(type == 'date' || type == "time"){
              json[item] = document.getElementById('data-picker-'+item).querySelector('input').value;
            }

            if(type=='GeoPoint'){
              json[item] = {
                lat: document.getElementById('location-'+item).querySelector('.lat input').value,
                lng: document.getElementById('location-'+item).querySelector('.lng input').value,
              }
            }

            if(type == 'select'){
              json[item] = document.querySelector('input[name="'+item+'"]').value;
            }

            if(type == 'code'){
              console.log(myCodeMirror)
              json[item] = myCodeMirror[item].getValue()
            }

            if(type == 'html'){
              json[item] = this.editors[item];
            }

            if(type == 'file'){
              json[item] = this.files[item];
            }

            if(type == 'name'){
              json[item] = {
                firstname: document.getElementById('name-'+item).querySelector('.firstname input').value,
                lastname: document.getElementById('name-'+item).querySelector('.lastname input').value,
              }
            }
    
          }

          var validation_elements = document.querySelectorAll('.validation');

          for(var i = 0 ; i<validation_elements.length ; i++)
            validation_elements[i].innerHTML = '';

          var _name = this.name;

           if(_name == 'User')
            _name = 'Users';
          
          var _id = window.location.href.split(_name+'/')[1];

          request({method:'PUT', 
              url: window.api_url+_name+'/'+_id,
              json: json
          }, function (er, response, body) {


            var response = body;

            document.getElementById('top-loading').classList.add('hide');

            if(body.error){

              if(body.error.details){
                
                var messages = body.error.details.messages;

                for(var msg in messages){
                  console.log(msg);
                  document.getElementById('validation-'+msg).innerHTML = messages[msg];
                }

              } 


              self.message = body.error.message;
              self.showSnackbar('error');
          

            } else{
              self.message = 'Well done, Item created Successfully';
              self.showSnackbar('success');
              setTimeout(function(){
                window.location.assign('#/'+self.name);
              },1000)
            }

            if(er)
              throw er

          });

        },

        submitForm(event,name){

          event.preventDefault();
          var xhr  = new XMLHttpRequest();
          var self = this;
          var elem = event.target;

          xhr.onload = function(){ 
            var response = JSON.parse(xhr.response);
            var uploaded_files = response.result.files['file-upload-'+name];

            for(var i = 0 ; i<uploaded_files.length ; i++){
              self.message = 'File "'+uploaded_files[i].name+'" Uploaded Successfully';
              self.showSnackbar('success');
              var uploading_item = null;
              uploading_item = document.querySelectorAll('.item-uploaded[data-name="'+uploaded_files[i].name+'"]')[0];
              uploading_item.querySelector('.delete-image').removeAttribute('disabled');
              uploading_item.querySelector('.mu-linear-progress').classList.add('hide');
            }
          }

          xhr.open (event.target.method, event.target.action, true);
          xhr.send (new FormData (event.target));
          return false;
        },
        onEditorBlur(event,name){
          this.editors[name] = event.html;
        },
        removeImage: function (e,index) {
          var item = document.getElementById('files-list-'+e+'-'+index);
          var el = item.querySelector('.delete-image');
          var file_name = item.getAttribute('data-name');
          var self = this;

          if(el.getAttribute('disabled') != "disabled"){

            request({method:'DELETE', 
                  url: window.api_url+'uploads/files/files/'+file_name
              }, function (er, response, body) {
                
              if(JSON.parse(body).error){
                self.message = JSON.parse(body).error.message;
                self.showSnackbar('error');
                return;

              } else{

              //if(index == 0)
              //  delete self.files[e];

                self.message = 'File "'+file_name+'" Deleted Successfully';
                self.showSnackbar('success');

                var child = document.getElementById('files-list-'+e+'-'+index);
                child.parentNode.removeChild(child);

                delete self.files[e][index]

              }

            });

          }
        }

      }
  }

</script>