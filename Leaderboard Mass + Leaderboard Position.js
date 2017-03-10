var UpdateLeaderboard = require('../packet/UpdateLeaderboard');
var BinaryWriter = require('../packet/BinaryWriter');

function Leaderboard (gameServer, PluginHandler, Logger) {
	this.gameServer = gameServer;
	this.PluginHandler = PluginHandler;
	this.Logger = Logger;
	this.name = "Leaderboard Mass and Position";
	this.author = "Tyler3D";
	this.version = "1.0.0";
}

module.exports = Leaderboard;

Leaderboard.prototype.start = function () {
	// Replace
UpdateLeaderboard.prototype.buildFfa5 = function () {
    var player = this.playerTracker;
    var writer = new BinaryWriter();
    writer.writeUInt8(0x31);                 	  		   // Packet ID
    writer.writeUInt32(this.leaderboardCount + 1 >>> 0);
    writer.writeUInt32(0);
    for (var i = 0; i < this.leaderboardCount; i++) {
        var item = this.leaderboard[i];
        var score = (item.getScore() / 100).toFixed();
        if (item == null) return null;   // bad leaderboard just don't send it
        var name = item.getFriendlyName();
        var j = i + 1;

        if (name != null) {
            if (i == 0) var info = (name + " ~~~ " + score).toString();
            else var info = ("	 " + name + " ~~~ " + score).toString();
            writer.writeStringZeroUnicode(info);

        }
	}
    		var pos = this.leaderboard.indexOf(this.playerTracker) + 1 == 0 ? "" : this.leaderboard.indexOf(this.playerTracker) + 1;
    		var info = ("	 Position: " + pos).toString();
    		writer.writeStringZeroUnicode(info);
    		return writer.toBuffer();
};

UpdateLeaderboard.prototype.buildFfa6 = function () {
    var player = this.playerTracker;
    var writer = new BinaryWriter();
    writer.writeUInt8(0x31);                 	  		   // Packet ID
    writer.writeUInt32(this.leaderboardCount + 1 >>> 0);
    for (var i = 0; i < this.leaderboardCount; i++) {
        var item = this.leaderboard[i];
        var score = (item.getScore() / 100).toFixed();
        if (item == null) return null;   // bad leaderboard just don't send it
        var name = item.getFriendlyName();
        var j = i + 1;
        var id = item == player ? 1 : 0;
        writer.writeUInt32(id >>> 0);   // isMe flag
        if (name != null) {
            writer.writeStringZeroUtf8(name + " ~~~ " + score);
        }
	}
    		writer.writeUInt32(1 >>> 0);
    		var pos = this.leaderboard.indexOf(this.playerTracker) + 1 == 0 ? "" : this.leaderboard.indexOf(this.playerTracker) + 1;
    		writer.writeStringZeroUtf8("Position: " + pos);
    		return writer.toBuffer();
};

UpdateLeaderboard.prototype.buildFfa11 = function() {
    var player = this.playerTracker;

    var writer = new BinaryWriter();
    writer.writeUInt8(0x31);                                 // Packet ID
    writer.writeUInt32(this.leaderboardCount >>> 0);         // Number of elements
    for (var i = 0; i < this.leaderboardCount; i++) {
        var item = this.leaderboard[i];
        var score = (this.leaderboard[i].getScore() / 100).toFixed();
        if (item == null) return null;  // bad leaderboardm just don't send it

        var name = item._nameUtf8;
        if (name != null) {
            writer.writeStringZeroUtf8(this.leaderboard[i].getFriendlyName() + " ~~~ " + score);
        }
        else
            writer.writeUInt8(0);
    }
    return writer.toBuffer();
};

}
