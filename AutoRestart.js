var GameServer = require('../GameServer');
var PlayerTracker = require('../PlayerTracker');

function AutoRestart (gameServer, pluginHandler, logger) {
    this.name = "AutoRestart";
    this.author = "Tyler3D";
    this.version = "1.0.2";
    this.gameServer = gameServer;
    this.pluginHandler = pluginHandler;
    this.Logger = logger;
    this.restartInterval = 24 * 3600000 // In Milliseconds 24 Hours
    this.time = (new Date).getTime();
    this.timeleft = this.restartInterval;
    this.fake_player = new PlayerTracker();
    this.active = true;
}

module.exports = AutoRestart;

AutoRestart.prototype.start = function () {
    this.fake_player.setName(this.formatTime(this.timeleft));
    this.fake_player.score = 20;
    this.gameServer.timerLoopBind = null;
    this.gameServer.mainLoopBind = null;
    this.replaceing();
    this.gameServer.timerLoopBind = this.gameServer.timerLoop.bind(this.gameServer);
    this.gameServer.mainLoopBind = this.gameServer.mainLoop.bind(this.gameServer);
    this.gameServer.config.serverMaxLB++;
    var self = this;
    setTimeout(function () {self.Logger(self.formatTime(self.timeleft), self.name)}, 50);
};

AutoRestart.prototype.formatTime = function (time) {
    if (time < 5) {
      return "RESTARTING IN " + Math.round(time % 60);
    }

    // Format
    var hour = ~~(time / 3600 % 24);
    var min = ~~(time / 60 % 60);
    var sec = ~~(time % 60)
    
    sec = (sec > 9) ? sec : "0" + sec.toString();
    
    return "Restart in " + hour + ":" + min + ":" +  sec + " Hours";
};

AutoRestart.prototype.updateTick = function () {
    this.fake_player.setName(this.formatTime(this.timeleft));
};

AutoRestart.prototype.Restart = function () {
    this.Logger("RESTARTING!", "AutoRestart");
    process.exit(3);
};

AutoRestart.prototype.replaceing = function () {

    GameServer.prototype.mainLoop = (function() {
    var cached_function = GameServer.prototype.mainLoop;

    return function() {

        var _time = new Date();
        if (((this.PluginHandler.plugins.AutoRestart.time + (this.PluginHandler.plugins.AutoRestart.restartInterval) - _time.getTime()) / 1000) <= 1)
              this.PluginHandler.plugins.AutoRestart.Restart();
        this.PluginHandler.plugins.AutoRestart.timeleft = ((this.PluginHandler.plugins.AutoRestart.time + (this.PluginHandler.plugins.AutoRestart.restartInterval) - _time.getTime()) / 1000);
        this.leaderboard.splice(this.config.serverMaxLB - 1, 1, (this.PluginHandler.plugins.AutoRestart.fake_player));
        this.PluginHandler.plugins.AutoRestart.updateTick();
        
        var result = cached_function.apply(this, arguments);
        return result;
    };
})();

};
