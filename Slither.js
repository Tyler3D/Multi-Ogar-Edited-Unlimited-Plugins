var PlayerTracker = require('../PlayerTracker');
var Entity = require('../Entity');

function Slither (gameServer, PluginHandler, Logger) {
	this.gameServer = gameServer;
	this.name = "Slither";
	this.author = "Tyler3D";
	this.version = "1.0.1";
	this.Logger = Logger;
	this.active = true;
}

module.exports = Slither;

Slither.prototype.slitherEject = function (client) {
    if (!this.gameServer.canEjectMass(client) || client.frozen)
        return;
    for (var i = 0; i < client.cells.length; i++) {
        var cell = client.cells[i];
        
        if (!cell || cell._size < this.gameServer.config.playerMinSplitSize) {
            continue;
        }
        
        var dx = -client.mouse.x - -cell.position.x;
        var dy = -client.mouse.y - -cell.position.y;
        var dl = dx * dx + dy * dy;
        if (dl > 1) {
            dx /= Math.sqrt(dl);
            dy /= Math.sqrt(dl);
        } else {
            dx = 1;
            dy = 0;
        }
        
        // Remove mass from parent cell first
        var sizeLoss = 10
        var sizeSquared = cell._sizeSquared - sizeLoss * sizeLoss;
        cell.setSize(Math.sqrt(sizeSquared));
        // Get starting position
        var pos = {
            x: cell.position.x + dx * cell._size,
            y: cell.position.y + dy * cell._size
        };
        var angle = Math.atan2(dx, dy);
        if (isNaN(angle)) angle = Math.PI / 2;
        
        // Randomize angle
        angle += (Math.random() * 0.6) - 0.3;
        
        // Create cell
        var mass = (Math.random() * (8 - 4)) + 4;
        var food = new Entity.Food(this.gameServer, null, pos, mass);
        food.setColor(cell.color);
        food.setBoost(780, angle);
        this.gameServer.addNode(food);
    }
};
Slither.prototype.start = function () {
   this.gameServer.movePlayer = function(cell1, client) {
    	if (client.socket.isConnected == false || client.frozen)
        	return;
    	// TODO: use vector for distance(s)
    	// get distance
    	var dx = ~~(client.mouse.x - cell1.position.x);
    	var dy = ~~(client.mouse.y - cell1.position.y);
    	var squared = dx * dx + dy * dy;
    	if (squared < 1 || isNaN(dx) || isNaN(dy)) {
        	return;
    	}
    	// get movement speed
    	var d = Math.sqrt(squared);
    	if (client.slither) {
    		var speed = cell1.getSpeed(d) * 2;
        	this.PluginHandler.plugins.Slither.slitherEject(client);
  		} else speed = cell1.getSpeed(d);
  		if (!speed) return; // avoid shaking

    	// move player cells
    	cell1.position.x += dx / d * speed;
    	cell1.position.y += dy / d * speed;
    	cell1.checkBorder(this.border);
	};

	PlayerTracker.PlayerTracker = (function(gameServer, socket) {
    var cached_function = PlayerTracker.PlayerTracker;

    return function() {
        var result = cached_function.apply(this, arguments); // use .apply() to call it

        this.slither = false;

        return result;
    };
})();

	PlayerTracker.prototype.pressQ = (function() {
    var cached_function = PlayerTracker.prototype.pressQ;

    return function() {
        
        this.slither = !this.slither;

        var result = cached_function.apply(this, arguments);
        return result;
    };
})();

}
