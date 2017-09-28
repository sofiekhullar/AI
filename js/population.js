function population(){
    let members = [];
    let generationNr;
    let size;

    this.createFirstPopulation = function(){
        // Call create member xSize
        // Generation 0 from random
    };

    this.createPopulation = function(){
        // Call create member xSize
        // Next gen from parents
    };

    this.getBestParents = function(){
        // sort first and then random choose from best parents
    };

    this.sortParents = function () {
        // get fitness score and sort
    };

    this.getPopulation = function () {
        return members;
    };

    this.getGerationNr = function () {
        return generationNr;
    };

    this.setSize = function (size) {
        this.size = size;
    }
}