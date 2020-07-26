var Auth = (function() {

    var wm = new WeakMap();
    var privateStore = {};
    var lock;
  
    function Auth() {
      this.lock = new Auth0Lock(
        '<YOUR_CLIENT_ID>',
        '<YOUR_DOMAIN>'
      );
      this.lock.
      wm.set(privateStore, {
        appName: "example"
      });
    }
  
    Auth.prototype.getProfile = function() {
      return wm.get(privateStore).profile;
    };
  
    Auth.prototype.authn = function() {
      // Listening for the authenticated event
      this.lock.on("authenticated", function(authResult) {
        // Use the token in authResult to getUserInfo() and save it if necessary
        this.getUserInfo(authResult.accessToken, function(error, profile) {
          if (error) {
            // Handle error
            return;
          }
  
          //we recommend not storing Access Tokens unless absolutely necessary
          wm.set(privateStore, {
            accessToken: authResult.accessToken
          });
  
          wm.set(privateStore, {
            profile: profile
          });
  
        });
      });
    };
    return Auth;
  }());