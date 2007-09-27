/**
 * Copyright (c) 2007, Benjamin C. Meyer
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the Benjamin Meyer nor the names of its contributors
 *    may be used to endorse or promote products derived from this software
 *    without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

function Chromosome(bitsPerValue, numberOfValues) {
    this.bitString = new String();
    this.fitnessValue = 0;
    this.numberOfValues = numberOfValues;
    this.bitsPerValue = bitsPerValue;
    this.maxInRange = Math.pow(2, bitsPerValue);
    this.args = [];
    // init with a random value
    for (var i = 0; i < bitsPerValue * numberOfValues; ++i) {
        this.bitString += (Math.random() > 0.5) ? "1" : "0";
    }
    
    // Take the binary string 01010110, get the decimal value and then put it between the ranges
    this.value = function(value, fitness) {
        var str = this.bitString.substring(value * this.bitsPerValue,
                                     (value + 1) * this.bitsPerValue);
        var intValue = parseInt(str, 2);
        return fitness.getArg(intValue, this.maxInRange);
    };

    this.computeFitness = function(fitness) {
        for (var i = 0; i < this.numberOfValues; ++i) {
            this.args[i] = this.value(i, fitness);
        }
        return fitness.fitness(this.args);
    };

    this.mutate = function() {
        var flipPoint = Math.floor(Math.random() * this.bitString.length);
        var end = this.bitString.substring(flipPoint + 1);
        var flip = ((this.bitString.charAt(flipPoint) == "1") ? "0" : "1"); // QScript 1 -> "1"
        this.bitString = this.bitString.substring(0, flipPoint);
        this.bitString += flip;
        this.bitString += end;
    };

    this.crossover = function(other) {
        var crossoverPoint = Math.random() * this.bitString.length;
        this.bitString = this.bitString.substring(0, crossoverPoint)
                      + other.bitString.substring(crossoverPoint);
    };
}

function Population(size, fitness, mutationRate, crossoverRate)
{
    this.people = [size];
    this.fitness = fitness;
    this.mutationRate = mutationRate;
    this.crossoverRate = crossoverRate;

    //var bits = fitness.maxArg().toString(2).length + 1; // QScript toString(radix)
    //print(bits, Math.pow(2, bits));
    //print(typeof(fitness.maxArg()), fitness.maxArg().toString(2));
    var bits = 1;
    while (Math.pow(2, bits) < fitness.maxArg())
        bits++;
    bits++;
    for (var i = 0; i < size; ++i) {
        this.people[i] = new Chromosome(bits, fitness.numberOfArgs());
    }

    this.comparePeople = function(a, b){ return a.fitnessValue - b.fitnessValue; };
    this.buildNextGeneration = function() {
        var peopleSize = this.people.length;
        // Calculate the fitness values of all the items and then sort by rank
        for (var i = 0; i < peopleSize; ++i) {
            this.people[i].fitnessValue = this.people[i].computeFitness(this.fitness);
        }
        this.people.sort(this.comparePeople);
        
        // replace those that get crossovered or mutated
        var loosers = this.crossoverRate + this.mutationRate;
        var remaining = Math.round(peopleSize * (1 - loosers));
        for (var i = remaining; i < peopleSize; ++i) {
            this.people[i].bitString = this.people[peopleSize - i].bitString;
            if ((Math.random() * loosers) > this.mutationRate) {
                this.people[i].mutate();
            } else {
                var choice = Math.round(Math.random() * remaining);
                this.people[i].crossover(this.people[choice]);
            }
        }
    };
}

function run(fitness, generations, populationSize, mutationRate, crossoverRate)
{
    // Check args
    if (crossoverRate > 1 || mutationRate > 1 || crossoverRate + mutationRate > 1 ) {
        print("cross over and mutation rate combined need to be smaller then 1.0");
        return;
    }
    if (populationSize * crossoverRate + mutationRate < 1) {
        print("populationSize * crossoverRate + mutationRate needs to be smaller then 1.0");
        return;
    }

    var population = new Population(populationSize, fitness, mutationRate, crossoverRate);

    var log = [];
    var logStr = [];
    try {
        for (var i = 0; i < generations; ++i)
        {
            population.buildNextGeneration();
            if (log[log.length - 1] != population.people[0].fitnessValue) {
                log[log.length] = population.people[0].fitnessValue;
                logStr[logStr.length] = "Generation " + i +": " + population.people[0].fitnessValue;
                print(logStr[logStr.length - 1]);
            }
        }
    } catch (e) {
        print("Error: When executing function:" + e.message);
        return;
    }

    var best = population.people[0];
    var result = "";
    for (var i = 0; i < fitness.numberOfArgs(); ++i)
        result += best.value(i, fitness) + "; ";
    print("result:", result);
    print("best:", best.fitnessValue);
 
    delete fitness;
    delete population;
}
