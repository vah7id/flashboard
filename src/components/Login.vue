<template>
	<div>

		<mu-snackbar v-if="snackbar" :message="message" action="error" @actionClick="hideSnackbar" @close="hideSnackbar"/>

  		<mu-content-block class="login-form">
    	  <mu-avatar :src="logo" :size="100" />
		  <mu-sub-header>Sign In To {{ brand }}</mu-sub-header>
		  <mu-text-field fullWidth hintText="Email" id="email" type="email" icon="people"/><br/>
		  <mu-text-field fullWidth hintText="Password" type="password" id="password" icon="lock"/><br/><br/>
		  <mu-raised-button v-on:click="login" fullWidth fullWidth label="Sign In" secondary/>
  		</mu-content-block>
		 
		<p class="copyright-foot">Powered By <a href="flashboard.com">Flashboard</a> . version 1.1.0</p>

  </div>
</template>

<style lang="css">
.mu-sub-header{
	font-size: 30px !important;
	font-weight: 500;
	margin-bottom: 30px;
	border-bottom: 1px solid #eee;
	padding-bottom: 20px;
}
.login-form .mu-avatar{margin-bottom: 20px;}
.login-form {
  background-color: #fff;
  width: 100%;
  max-width: 500px;
  margin: 50px auto;
  display: block;
  text-align: center;
}
.copyright-foot{
	text-align: center;
	color: #aaa;
}
</style>

<script type="text/javascript">

  import store from '../store';

  import { loading } from '../filters'

  const request = require("browser-request");

  module.exports = {

      name: 'LoginView',

      data() {
      	return {
      		snackbar: false,
      		message: '',
      		brand:'Dashboard',
      		logo:''
      	}
      },

      created(){
      	this.brand = JSON.parse(store.get('env')).BRAND;
      	this.logo = JSON.parse(store.get('env')).LOGO;
      },

      mounted(){
      	document.querySelector('.mu-appbar').classList.add('hide')
	  	document.querySelector('.mu-linear-progress').classList.add('hide');
      },

      methods: {

      	showSnackbar (msg) {
	      this.snackbar = true
	      if (this.snackTimer) clearTimeout(this.snackTimer)
	      this.snackTimer = setTimeout(() => { this.snackbar = false },5000)
	    },
	    hideSnackbar () {
	      this.snackbar = false
	      if (this.snackTimer) clearTimeout(this.snackTimer)
	    },

        login(e){

        	e.preventDefault();
        	var self = this;
        	loading('start');

        	request({method:'POST', 
		        url: window.api_url+'Users/login',
		        json:{
		        	'email': document.querySelector('input[type="email"]').value, 
					'password': document.querySelector('input[type="password"]').value
		        }
		    }, function (er, response, body) {
		      if(er)
		        throw er

		      if(typeof body['error'] != "undefined"){
		      	self.message = body.error.message;
		      	self.showSnackbar();
        		loading('end');
		  	  } else{
      			store.set('flashboard_token',body.id);
      			store.set('flashboard_userId',body.userId);

			    window.location.assign('#/dashboard');
			  }
		      	
		    });

        }

      }
  }

</script>