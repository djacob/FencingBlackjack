var app = angular.module('FencingBlackjackApp', []);

app.controller('AppController', function() {
    var self = this;

    // Initialize Game Settings
    self.goal = 21;
    self.minPointValue = 1;
    self.maxPointValue = 10;
    self.terms = {};
    self.fencers = [ //TODO: Make fencer an object
        { score: 0 },
        { score: 0 }
    ];

    // TODO: Load from file?
    var actions = [
        "Attack",
        "Riposte",
        "Counterattack",
        "Attack in Prep",
        "Point in Line",
        "Back Flick"
    ];

    var minimum = {
        action: actions[0],
        value:  self.maxPointValue
    };

    actions.forEach(function(action) {
        var points = getRandomInt(self.maxPointValue, self.minPointValue);

        if (points < minimum.value) { //TODO: maybe use something else to keep track of min?
            minimum.action = action;
            minimum.value = points;
        }

        self.terms[action] = getActionDetails(points, self.minPointValue, self.maxPointValue);
    });

    // We want at least one action with 1 point so there's always a chance to win- even if a fencer has a score of 20
    self.terms[minimum.action] = getActionDetails(1, self.minPointValue, self.maxPointValue);

    /**
     * Returns the object that contains details for the action that pertain to the point value of the action
     * @param value the value the action is worth
     * @param min the maximum value any action can have
     * @param max the minimum value any action can have
     * @returns {{points: *, color: string}} the details for the action
     */
    function getActionDetails(value, min, max) {
        var details = {
            points: value,
            color: getColorCSSForValueInRange(value, min, max)
        };
        return details;
    }

    /**
     * Returns a CSS rgb color string where the color is more green for values closer to max and the color is more red
     * for values closer to min.
     * @param value the variable value
     * @param min the minimum number that value can take
     * @param max the maximum number that value can take
     * @returns {string} a CSS rgb color that is along the red-green gradient
     */
    function getColorCSSForValueInRange(value, min, max) {
        var green = getColorMagnitueForValueInRange(value, min, max);
        var red = 256 - green;
        return "rgb(" + red + "," + green + ",0)";
    }

    /**
     * Returns a value between 0 and 255 that corresponds to the ratio of the value to the min-max range
     * @param value the comparison value
     * @param min the minimum number that value can take
     * @param max the maximum number that value can take
     * @returns {number} A value between 0 and 255 that is the same ratio of value to the min-max range
     */
    function getColorMagnitueForValueInRange(value, min, max) {
        var percentOfRange = value / (max - min + 1);
        return Math.floor(percentOfRange * 255);
    }

    /**
     * Returns a random number between min and max (inclusive)
     * @param min the smallest number possible to return
     * @param max the largest number possible to return
     * @returns Integer - a random integer between min and max (inclusive)
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
});

app.controller("TimerController", function($scope) {
    var self = this;

    self.time = new Date();

    var clock, offset;
    self.interval = null;

    self.stop = function() {
        if (self.interval) {
            clearInterval(self.interval);
            self.interval = null;
        }
    };

    self.start = function() {
        if (!self.interval) {
            offset = new Date();
            self.interval = setInterval(update, 1);
        }
    };

    self.reset = function() {
        clock = 0;
        render();
    };

    function update() {
        clock += delta();
        render();
    }

    function render() {
        $scope.time = clock/1000;
        //TODO: Fix $scope.$apply already in progress error message, possibly convert to $timeout
        $scope.$apply();
    }

    function delta() {
        var now = Date.now(),
            d   = now - offset;
        offset = now;
        return d;
    }

    self.reset();
});