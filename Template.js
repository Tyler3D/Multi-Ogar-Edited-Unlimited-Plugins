// Example plugin Make sure if you are using multiple files, they are in a seprate folder named the plugin's name.
function Example(gameServer, PluginHandler, Logger) {
  this.gameServer = gameServer;
  this.Logger = Logger;
  this.PluginHandler = PluginHandler;
  this.name = "Example";  // Required
  this.author = "Example"; // Required
  this.version = "1.0.0"; // Required
}

module.exports = Example;

Example.prototype.start = function () {
  // Replace Functions. This is called by PluginHandler
  this.Logger("HI", this.name); // Says Hi
  this.PluginHandler.addCommand("example", function(gameServer, split) {
    var id = split[1]; // Id part not neccasary
    // Command Stuff
  
  });
  this.PluginHandler.addPlayerCommand("example", function(PlayerCommand, args, playerTracker, gameServer) {
      var id = args[1]; // Id part not neccasary 
      // Command Stuff
  });
};
