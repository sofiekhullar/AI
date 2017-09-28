function population(){
    let members = [];
    let generationNr;
    let size = 5;

    this.createFirstPopulation = function(){
        console.log("creating first population...");

        for(let i = 0; i < size; i++){
            this.member = new member();
            this.member.createFirstMember();
            members[i] = this.member;
            //console.log(this.member.getDNA());
        }
    };

    this.createPopulation = function(){
        console.log("creating next population...");
        for(let i = 0; i < size; i++){
            this.member = new member();
            let bestParents = this.getBestParents();
            this.member.createMember("", ""); //bestParents[0], bestParents[1]);
        }
    };

    this.getBestParents = function(){
        this.sortParents();
        // sort first and then random choose from best parents
        return null;//bestParents;
    };

    this.sortParents = function () {
        // get fitness score and sort
        // this.member.getFitnessScore();
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