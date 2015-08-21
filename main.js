var app = angular.module('FencingBlackjackApp', []);

app.controller('AppController', function($log) {
    $log.debug("Starting Fencing Blackjack");

    var self = this;
    self.goal = 21;

    // Actions are worth points anywhere from 1-10
    var maxPointValue = 10;
    var minPointValue = 1;

    //TODO: Load from file
    var actions = ["Attack", "Riposte", "Counterattack", "Attack in Prep", "Point in Line", "Back Flick"];
    self.terms = {};

    var minimum = {action:actions[0], value: maxPointValue};

    actions.forEach(function(action) {
        var points = getRandomInt(maxPointValue, minPointValue);
        if (points < minimum.value) {
            minimum.action = action;
            minimum.value = points;
        }
        var pointScore = points / (maxPointValue - minPointValue + 1);
        var red = Math.floor((1.1 - pointScore) * 256);
        var green = Math.floor((pointScore) * 256);
        var colorCSS = "rgb(" + red + "," + green + ",0)";
        $log.debug("Color for " + action + " is " + colorCSS);
        self.terms[action] = {
            points: points,
            color: colorCSS
        };
    });

    self.terms[minimum.action].points = 1; //We want at least one action with 1 point so there's always a chance to win

    self.fencers = [{score:0}, {score:0}];

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