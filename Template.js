
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
  this.Logger("HI"); // Says Hi
  this.PluginHandler.addCommand(name, function(gameServer, split) {
    var id = split[1];
    // Command Stuff
  
  });
};
