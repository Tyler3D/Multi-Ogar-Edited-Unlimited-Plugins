var PlayerCell = require('../Entity/PlayerCell');
var BotLoader = require('../ai/BotLoader');
var FakeSocket = require('../ai/FakeSocket');
var PacketHandler = require('../PacketHandler');
var GameServer = require('../GameServer');
var Entity = require('../Entity');

function Super_Minions (gameServer, PluginHandler, Logger) {
	this.gameServer = gameServer;
	this.PluginHandler = PluginHandler;
	this.Logger = Logger;
	this.name = "Super Minions";
	this.author = "\x1b[36mAndrews54757\u001B[1m\u001B[32m"; // Ported by Tyler3D
	this.version = "1.0.4";
	this.active = true;
}

module.exports = Super_Minions;

Super_Minions.prototype.start = function() {

	GameServer.prototype.spawnPlayer = function(player, pos) {
    if (player.disableSpawn) return;
    
    // Check for special start size(s)
    var size = this.config.playerStartSize;
    if (player.spawnmass && !player.isMi) {
        size = player.spawnmass;
    } else if (player.isMi) {
        size = (player.spawnmass != 0) ? player.spawnmass : this.config.minionStartSize;
        if (this.config.minionMaxStartSize > size) {
            size = Math.random() * (this.config.minionMaxStartSize - size) + size;
        }
    }
    // Check if can spawn from ejected mass
    var index = (this.nodesEjected.length - 1) * ~~Math.random();
    var eject = this.nodesEjected[index];
    if (Math.random() <= this.config.ejectSpawnPercent && this.nodesEjected.length 
        && !eject.isRemoved && eject.boostDistance < 1) {
        // Spawn as same color
        player.setColor(eject.color);
        // Spawn from ejected mass
        this.removeNode(eject);
        pos = {
            x: eject.position.x,
            y: eject.position.y
        };
        size = Math.max(eject._size, size);
    }
    // 10 attempts to find safe position
    for (var i = 0; i < 10 && this.willCollide(pos, size); i++) {
        pos = this.randomPos();
    }
    // Spawn player and add to world
    var cell = new Entity.PlayerCell(this, player, pos, size);
    this.addNode(cell);
    
    // Set initial mouse coords
    player.mouse = {
        x: pos.x,
        y: pos.y
    };
};

	BotLoader.prototype.addMinion = function(owner, name, special) {
    var MinionPlayer = require('../ai/MinionPlayer');
    var s = new FakeSocket(this.gameServer);
    s.playerTracker = new MinionPlayer(this.gameServer, s, owner);
    s.packetHandler = new PacketHandler(this.gameServer, s);
    try {
    s.playerTracker.spawnmass = special.m;
    s.playerTracker.customspeed = special.s;
	} catch (e) {

	}
    s.playerTracker.owner = owner;
    // Add to client list
    this.gameServer.clients.push(s);

    // Add to world & set name
    if (typeof name == "undefined" || name == "") {
        name = this.gameServer.config.defaultName;
    }
    s.packetHandler.setNickname(name);

    PlayerCell.prototype.getSpeed = function () {
        var speed = 2.1106 / Math.pow(this._size, 0.449);
        // tickStep = 40ms
        this._speed = (this.owner.customspeed > 0) ? 
        speed * 40 * this.owner.customspeed : // Set by command
        speed * 40 * this.gameServer.config.playerSpeed;
        return this._speed;
    };
};

	this.PluginHandler.addCommand("superminion", function(gameServer, split) {
		var id = parseInt(split[1]);
		var num = parseInt(split[2]);
		var mass = parseInt(split[3]);
		var speed = parseInt(split[4]);
		var name = split.slice(5, split.length).join(' ');
		var spawnmass = Math.sqrt(mass * 100);

		if (isNaN(id)) {
			console.log("\u001B[34m\u001B[1m[Super Minions] " + "\u001B[37m" + "Please Specify a valid player ID!");
			return;
		}

		for (var i in gameServer.clients) {
			var client = gameServer.clients[i].playerTracker;
			if (client.pID == id) {
                if (client.minionControl == true && isNaN(num)) {
                    client.minionControl = false;
                    client.miQ = 0;
					console.log("\u001B[34m\u001B[1m[Super Minions] " + "\u001B[37m" + "Succesfully removed minions for " + client.getFriendlyName());
				} else {
					num = (isNaN(num)) ? num = 1 : num = num;
					spawnmass = (isNaN(spawnmass)) ? spawnmass = 0 : spawnmass = spawnmass;
					speed = (isNaN(speed)) ? speed = 1 : speed = speed;
					client.minionControl = true;
					var args = {m: spawnmass, s: speed};
					console.log("\u001B[34m\u001B[1m[Super Minions] " + "\u001B[37m" + "Added " + num + " Minions for " + client.getFriendlyName());
					for (var i = 0; i < num; i++) {
						gameServer.bots.addMinion(client, name, args);
					}
				}
			}
		}

	});
	this.PluginHandler.addPlayerCommand("superminion", function(PlayerCommand, args, playerTracker, gameServer) {
		if (playerTracker.userRole != 4) {
		   this.gameServer.sendChatMessage(null, playerTracker, "ERROR: ACCESS DENIED")	
		   return;
		}
		var num = args[1];
		var mass = parseInt(args[2]);
		var speed = parseInt(args[3]);
		var id = args[4];
		var name = args.slice(5, args.length).join(' ');
		var spawnmass = Math.sqrt(mass * 100);
 		this.gameServer = gameServer;
 		if (!isNaN(parseInt(id))) {
		for (var i in this.gameServer.clients) {
			var client = this.gameServer.clients[i].playerTracker;
			if (client.pID == id) {
                if (num == "remove") {
                    client.minionControl = false;
                    client.miQ = 0;
					this.gameServer.sendChatMessage(null, playerTracker, "[Super Minions] Succesfully removed super minions for " + client.getFriendlyName())
					var text = playerTracker._name + " gave you " + add + " Super Minions.";
                    this.gameServer.sendChatMessage(null, client, text);
				} else {
					num = (isNaN(num)) ? num = 1 : num = num;
					spawnmass = (isNaN(spawnmass)) ? spawnmass = 0 : spawnmass = spawnmass;
					speed = (isNaN(speed)) ? speed = 1 : speed = speed;
					client.minionControl = true;
					var args = {m: spawnmass, s: speed};
					this.gameServer.sendChatMessage(null, playerTracker, "[Super Minions] Added " + num + " Super Minions for " + client.getFriendlyName());
					var text = playerTracker._name + " gave you " + add + " Super Minions.";
                    this.gameServer.sendChatMessage(null, client, text);
					for (var i = 0; i < num; i++) {
						this.gameServer.bots.addMinion(client, name, args);
					}
					
					}
				}
			}
		} else {
			this.gameServer.sendChatMessage(null, playerTracker, "[Super Minions] Warn: missing ID arguments. This will give you super minions!");
			if (num == "remove") {
				playerTracker.minionControl = false;
				playerTracker.miQ = 0;
			} else {
				num = parseInt(num);
				num = (isNaN(num)) ? num = 1 : num = num;
				spawnmass = (isNaN(spawnmass)) ? spawnmass = 0 : spawnmass = spawnmass;
				speed = (isNaN(speed)) ? speed = 1 : speed = speed;
				playerTracker.minionControl = true;
				var args = {m: spawnmass, s: speed};
				this.gameServer.sendChatMessage(null, playerTracker, "[Super Minions] Added " + num + " Minions for " + playerTracker._name);
				for (var i = 0; i < num; i++) {
					this.gameServer.bots.addMinion(playerTracker, name, args);
				}
			}
		}
	});
}
