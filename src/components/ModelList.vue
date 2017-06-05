
<template>
  <div>

    <sidebar></sidebar>

    <mu-content-block class="mu-content-block-board">

      <mu-snackbar :actionColor="actionColor" v-if="snackbar" :message="message" :action="action" @actionClick="hideSnackbar" @close="hideSnackbar"/>

      <mu-row gutter>
       
        <mu-col width="200" tablet="60" desktop="70">
          <h1 class="page--title">{{ count }} {{ name }}</h1>
          <p class="note" v-if="note != null"> {{ note }} </p>
        </mu-col>

        <mu-col width="200" tablet="40" desktop="30">
          <mu-raised-button label="Create Item" :href="'#/'+name+'/create'" icon="add" class="btn-add" primary/>
        </mu-col>

      </mu-row>

      <mu-float-button icon="delete" v-on:click="deleteItem()" id="btn-delete" class="disabled" />

     
      <div class="row" v-if="count>0">
        <mu-text-field hintText="Search" type="text" v-model="search" id="mu-search" icon="search"/>


        <mu-select-field class="columns" v-model="active_columns" multiple label="Columns">
          <mu-menu-item v-for="column in columns" :value="column" :title="column"/>
        </mu-select-field>

         <mu-dropDown-menu class="btn-limit" :value="limit"  @change="changeLimit">
          <mu-menu-item value="10" title="10 Total"/>
          <mu-menu-item value="25" title="25 Total"/>
          <mu-menu-item value="50" title="50 Total"/>
          <mu-menu-item value="100" title="100 Total"/>
        </mu-dropDown-menu>

        <mu-raised-button class="btn-download" ref="button" @click="toggle">
        Download <mu-icon value="expand_more" />
        </mu-raised-button>

        <mu-popover :trigger="trigger" :open="open" @close="handleClose">
          <mu-menu>
            <mu-menu-item v-on:click="download_as_json()" title="JSON OBJECT" />
            <mu-menu-item v-on:click="download_as_csv()" title="CSV FORMAT" />
          </mu-menu>
        </mu-popover>


      </div>
      <div class="empty-list" v-if="count<1">
        <h2>No {{ name }} found :(</h2>
      </div>
      <mu-table v-if="count>0">
        <mu-thead>
          <mu-tr>
            <mu-th v-for="column in active_columns">{{ column }}</mu-th>
            <mu-th v-if="!noedit">Actions</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr v-for="value in items" :selectable="true" :data-id="value.id">
            <mu-td v-for="(val,index) in value" v-if="index !=='id' ">{{ val }}</mu-td>
            <mu-td>
              <mu-icon-menu icon="more_vert" v-if="!noedit">
                <mu-menu-item v-on:click="goEdit(value.id)" title="Edit"/>
              </mu-icon-menu>
            </mu-td>
          </mu-tr>
        </mu-tbody>
      </mu-table>

      <mu-pagination v-if="total>limit" :total="total" :pageSize="parseInt(limit)" :current="current" @pageChange="paginate">
      </mu-pagination>

    </mu-content-block>

  </div>
</template>

<style lang="css">
  .mu-pagination{
    margin: 80px auto 40px auto;
    display: block;
    width: 500px !important;
  }
  .row{
    width: 100%;
    float: left;
  }
  #mu-search{
    float: left;
    width: 30%;
    margin-left: 22px;
    margin-top: 0px;
  }
  .note{
    width: 100%;
    margin: -15px 0 50px 20px !important;
    float: left;
    display: inline-block;
    clear: both;
  }
  .mu-table{
    margin-top: 10px !important;
  }
  .btn-add{
    float: right;
    margin-top: 10px !important;
  }
  .mu-content-block-board{
    width: calc(100% - 280px) !important;
    float: right;
  }
  .page--title{
    width: 65%;
    float: left;
    padding: 5px 5px 15px 15px;
    text-transform: capitalize;
    margin-top: 10px;
  }
  #btn-delete{
    position: fixed;
    right: 30px;
    bottom: 30px;
  }
  .btn-download{
    float: right;
    margin-right: -55px !important;
    padding: 10px 20px !important;
  }
  .mu-dropDown-menu-text-overflow{
    margin-top: -10px;
  }
  .columns .mu-dropDown-menu-icon{
    top: -10px !important;
  }
  .empty-list h2{
    font-weight: lighter;
  }
  .empty-list{
    width: 100%;
    background-color: #fafafa;
    float: left;
    margin: 50px 0;
    text-align: center;
    padding: 40px 20px;
    font-size: 32px;
  }
  .btn-limit{
    margin: -8px 10px 0 0px;
    float: right;
    padding: 10px 22px !important;
  }
  .columns{
    margin-top: -10px;
    float: right;
  }
  .columns.mu-select-field .mu-dropDown-menu{
    height: 22px;
  }
</style>

<script type="text/javascript">

  import Sidebar from '../components/Sidebar.vue'
  import store from '../store';
  const request = require("browser-request");
  
  export default {

      name: 'ModelList',

      components: {
        Sidebar
      },

      data () {
        return {
          models: [],
          name: null,
          items: [],
          noedit: false,
          note: null,
          original_items: [],
          loading: true,
          search: '',
          selected: null,
          total: 0,
          current: 1,
          count: '',
          limit: '10',
          columns: [],
          active_columns: [],
          open: false,
          trigger: null,
          snackbar: false,
          message: '',
          action: 'error',
          actionColor: 'red',
          interval: null
        }
      },
     
      watch: {
        name: function(val){
            return store.state().current_model;
        },
        search: function(val){
          this.search = val;
          this.doSearch();
          return val;
        },
        note: function(val){
          this.note = val;
          return val;
        },
        count: function(val){
          this.count = val;
          return val;
        },
        limit: function(val){
          this.limit = val;
          this.current = 1;

          if(this.total<parseInt(this.limit) ){
            document.querySelector('.mu-pagination').classList.add('hide');
          } else{
            document.querySelector('.mu-pagination').classList.remove('hide');
          }

          this.dataFetch();
          return val;
        },
        $route: function(){

          this.name = store.state().current_model;
          this.models = JSON.parse(store.get('models'));
          this.total = this.models[this.name].count;
          this.note = '';
          this.noedit = false;

          //this.count = this.models[this.name].count;
          this.checkForOptions();
          this.getDefaultColumns();
          this.dataFetch();

          setTimeout(function(){
            document.querySelector('.mu-linear-progress').classList.add('hide');
          },1000);
        },
        columns: function(val){
          this.columns = val;
          return this.columns;
        },
        models: function(val) {
            this.$root.models = val;
            this.models = val;
            return JSON.parse(store.get('models'));
        },
        total: function(val){
          this.total = val;
          return val;
        },
        original_items: function(val){
          this.original_items = val;
          return val;
        },
        active_columns: function(val){
          this.active_columns = val;
          this.updateItems();
          return val;
        },
        items: function(val){

          this.items = val;
          this.updateItems();
      
        }
      },
      
      created() {
        this.name = store.state().current_model;
        this.models = JSON.parse(store.get('models'));
      },
      
      mounted(){

        var self = this;

        this.interval = setInterval(function(){

          if(typeof self.$root.models[self.name]['configs'] != "undefined"){

              self.models = self.$root.models;
              self.total = self.models[self.name].count;
              self.count = self.models[self.name].count;

              self.checkForOptions();
              self.getDefaultColumns();
              self.dataFetch();


              self.trigger = self.$refs.button.$el

              document.querySelector('.mu-appbar').classList.remove('hide')
              document.querySelector('.mu-linear-progress').classList.add('hide');

              self.interval = clearInterval(self.interval);
          }
        },2000);
        
      },

      methods: {

        updateItems(){
          var self = this, tmp;

          for(var item in self.items){

              if(self.original_items[item])
                tmp = self.original_items[item]
              else
                tmp = self.items[item]
        
              self.items[item] = {};

              for(var column in self.active_columns){
                var property = self.active_columns[column];
                var value = tmp[ property ];
                self.items[item][property] = value;
              }

              self.items[item]['id'] = tmp.id;
          }
          console.log(self.items)
        },
        dataFetch(){
          var self = this;
          var _model = self.name;

          if( self.models[self.name]['configs'] ){

              if( typeof self.models[self.name].configs.plural != "undefined"){
                _model = self.models[self.name].configs.plural;
              }

              if(self.name == 'User')
                _model = 'Users';

              request({method:'GET', 
                  url: window.api_url+_model+'?filter[limit]='+self.limit+'&filter[skip]='+(self.current-1)*parseInt(self.limit)
              }, function (er, response, body) {
                if(er)
                  throw er

                document.querySelector('.mu-linear-progress').classList.add('hide');
                self.items = '';
                self.items = JSON.parse(body);
                self.count = self.items.length;
                self.original_items = JSON.parse(body);

                setTimeout(function(){

                  for(var i = 1 ; i < document.querySelectorAll("table .mu-checkbox").length ; i++){

                    this.selected = null;

                    document.querySelectorAll("table .mu-checkbox")[i]
                    .addEventListener("click", function(){

                      var tr = this.parentNode.parentNode;

                      if(tr.classList.contains('selected')){
                        this.selected = null;
                        document.getElementById('btn-delete').classList.add('disabled');
                      } else {
                        console.log('inja')
                        self.selected = tr.getAttribute('data-id');
                        document.getElementById('btn-delete').classList.remove('disabled');
                      }
                     
                    });
                  }

                },500);

              });

          }
          
        },
        modelFetch() {
          var self = this;
          var _model = self.name;
          
          if( typeof self.models[self.name].configs != "undefined")
            _model = self.models[self.name].configs.plural;

          if(self.name == 'User')
            _model = 'Users';

          request({method:'GET', 
              url: '/api/common/models/'+_model+'.json'
          }, function (er, response, body) {
            if(er)
              throw er

            document.querySelector('.mu-linear-progress').classList.add('hide');

          });
        },

        getDefaultColumns(){

          var columns = [], active_columns = [];

          var current_model = this.models[this.name];

          if( current_model['configs'] ){

            var properties = current_model['configs']['properties'];
            
            for(var prop in properties){
            
              if(prop != 'id'){
                columns.push(prop);

                if( typeof properties[prop].defaultColumn != "undefined" ){
                  if(properties[prop].defaultColumn == true){
                    //if(properties[prop].label)
                    //  columns.push(properties[prop].label);
                    //else
                    active_columns.push(prop);
                  }
                } 
              }           
            }

            if(active_columns.length<1){
              for(var prop in properties){
                if(prop != 'id')
                  active_columns.push(prop);
              }
            }

            this.columns = columns;
            this.active_columns = active_columns;


          }


        },
        changeLimit(v) {
          this.limit = v;
        },
        toggle () {
          this.open = !this.open
        },
        handleClose (e) {
          this.open = false
        },
        paginate (newIndex) {

          document.querySelector('.mu-linear-progress').classList.remove('hide');

          console.log(newIndex)
          this.current = newIndex;

          this.name = store.state().current_model;
          this.dataFetch();

          setTimeout(function(){
            document.querySelector('.mu-linear-progress').classList.add('hide');
          },1000);

        },
        checkForOptions(){

          var current_model = this.models[this.name];

          if( typeof current_model['configs']['options']['note'] != "undefined" ){
            this.note = current_model['configs']['options']['note'];
          }

          if( typeof current_model['configs']['options']['noedit'] != "undefined" ){
            this.noedit = current_model['configs']['options']['noedit'];
          }

        },
        download_as_json(){

          var uri = 'data:text/csv;charset=utf-8,' + escape(JSON.stringify(this.original_items));
          var link = document.createElement("a");    
          link.href = uri;
          link.style = "visibility:hidden";
          link.download = 'Data_Report'+ ".json";
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

        },

        download_as_csv(){

          var data = this.original_items;
          if(data == '')
              return;
          
          this.JSON2CSV(data, "Data_Report", true);

        },

        JSON2CSV(JSONData, ReportTitle, ShowLabel) {

          var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
          
          var CSV = '';    
          CSV += ReportTitle + '\r\n\n';

          if (ShowLabel) {
              var row = "";
              
              for (var index in arrData[0])
                  row += index + ',';

              row = row.slice(0, -1);
              CSV += row + '\r\n';
          }
          
          for (var i = 0; i < arrData.length; i++) {
              var row = "";

              for (var index in arrData[i])
                  row += '"' + arrData[i][index] + '",';
         
              row.slice(0, row.length - 1);
              CSV += row + '\r\n';
          }

          if (CSV == '') {        
              alert("Invalid data");
              return;
          }   
          
          var fileName = "MyReport_";
          fileName += ReportTitle.replace(/ /g,"_");   
          var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
          var link = document.createElement("a");    
          link.href = uri;
          link.style = "visibility:hidden";
          link.download = fileName + ".csv";
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      },

      deleteItem(){
        
        if(!document.getElementById('btn-delete').classList.contains('disabled')){
          
            if(this.selected != null){

              var self = this;
              var _model = self.name;
              
              if( typeof self.models[self.name].configs.plural != "undefined"){
                _model = self.models[self.name].configs.plural;
              }

              if(self.name == 'User')
                _model = 'Users';

              request({method:'DELETE', 
                  url: window.api_url+_model+'/'+self.selected
              }, function (er, response, body) {
                if(er)
                  throw er

                if(typeof body['error'] != "undefined"){
                  self.message = body.error.message;
                  self.showSnackbar('error');
                } else{
                  self.message = 'Item Deleted Successfully :) ';
                  self.showSnackbar('success');
                  self.total -= 1;
                  self.count -= 1;
                  self.items = [];
                  self.dataFetch();
                }

              });

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

      goEdit(id){
        window.location.assign('#/'+this.name+'/'+id);
      },

      doSearch(){
          var input, filter, table, tr, td, i;
          input = this.search;
          filter = input.toUpperCase();
          table = document.querySelector('.mu-table');
          tr = document.querySelectorAll('tbody tr');
    
          // Loop through all table rows, and hide those who don't match the search query
          for (i = 0; i < tr.length; i++) {
            td = tr[i].querySelectorAll("td");
            for(var j = 0 ; j<td.length ; j++){
              var tmp = td[j];
              if (tmp) {
                if (tmp.innerHTML.toUpperCase().indexOf(filter) > -1) {
                  tr[i].style.display = "";
                  break;
                } else {
                  tr[i].style.display = "none";
                }
              } 
            }
          }

        }



      }
  }

</script>