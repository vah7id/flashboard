<template>
	<div>
		<navbar>
			<h2 class="pull-left">{{ name }}</h2>
			<a href="javascript:void(0)" v-on:click="logout" class="logout pull-right"><i class="material-icons">arrow forward</i></a>
		</navbar>
	</div>
</template>


<script type="text/javascript">

  const request = require("browser-request");
  import store from '../store';

  export default { 

      name: 'NavbarView ',

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
			    window.location.assign('#!/login');
			  }

		    });
        }

      }
  }

</script>