function salesman() {
    this.points = [ [0,0], [10,10], [6,6], [5,6], [3,3], [7,2] ];
    this.distance = function(a, b) {
        var x = Math.abs(a[0] - b[0]);
        var y = Math.abs(a[1] - b[1]);
        return Math. sqrt(x * x + y * y);
    };
    this.fitness = function(values) {
        var used = [this.points.length];
        var length = 0;
        var previous = values[0];
        var a = this.points[previous];
        used[previous] = 1;
        var b = 0;
        for (var i = 1; i < values.length; ++i) {
            b = this.points[values[i]];
            if (used[values[i]] == 1)
                return values.length * 1000 - i * 1000;
            length += this.distance(a, b);
            previous = values[i];
            used[previous] = 1;
            a = b;
        }
        return length;
    };
    
    // the size of values that should be passed to fitness
    this.numberOfArgs = function() { return this.points.length; };
    
    // the max value needed for the arguments
    this.maxArg = function() { return this.points.length; };
    
    // convert the current chromosome value which can have a maxValue
    // into something fitness can use.
    this.getArg = function(value, maxValue) {
        return Math.round(value * (this.points.length - 1) / maxValue);
    };
}

var generations = 10;
var populationSize = 300;
var mutationRate = 0.05;
var crossoverRate = 0.75;
run(new salesman, generations, populationSize, mutationRate, crossoverRate);
