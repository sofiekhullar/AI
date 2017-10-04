function population(generationNr){
    this.members = [];
    this.membersLastGen = [];
    this.generationNr = generationNr;
    this.size = 5;

    this.createFirstPopulation = function(){
        console.log("creating first population...");

        for(let i = 0; i < this.size; i++){
            this.member = new member();
            this.member.createFirstMember();
            this.members[i] = this.member;
        }
    };

    this.createPopulation = function(membersLastGen){
        console.log("creating next population...");
        this.membersLastGen = membersLastGen;

        for(let i = 0; i < this.size; i++){
            let bestParent1 = this.getBestParents();
            let bestParent2 = this.getBestParents();
            console.log("best parent " + bestParent1.DNA  + " + "  + bestParent2.DNA);
            this.member = new member();
            this.member.createMember(bestParent1.DNA, bestParent2.DNA); //bestParents[0], bestParents[1]);
            this.members[i] = this.member;
        }
    };

    this.getBestParents = function(){
        // sort first and then random choose from best parents
        this.membersLastGen.sort(function (a,b) {
           return a.fitnessScore - b.fitnessScore;
        });

        let random = Math.floor((Math.random() *101));
        let startValue = 100 * this.membersLastGen[0].propFitnessScore; // Best member
        console.log(startValue + ", random " + random);

        for(let i = 0; i < this.size; i++){
            if(random <= startValue){
                return this.membersLastGen[i];
            }
            startValue += 100*this.membersLastGen[i+1].propFitnessScore;
        }
    };

    this.mapFitnessScoreMembers = function(){
        let totalScore = 0;

        for(let i = 0; i < this.members.length; i++){
            totalScore += 1/(1 + this.members[i].getFitnessScore());
        }
        for(let i = 0; i <this.members.length; i++){
            this.members[i].setPropFitnessScore((1/(1+this.members[i].fitnessScore) / totalScore));
        }

    };

    this.getPopulation = function () {
        return this.members;
    };

    this.getGeneration = function () {
        return this.generationNr;
    };

    this.addGeneration = function () {
        this.generationNr++;
    };

    this.setSize = function (size) {
        this.size = size;
    };

    this.getMember = function(index) {
        return this.members[index];
    };
}