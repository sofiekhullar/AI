function population(generationNr){
    this.members = [];
    this.membersLastGen = [];
    this.generationNr = generationNr;
    this.size = 40;

    this.createFirstPopulation = function(){
        console.log("creating first population...");

        for(let i = 0; i < this.size; i++){
            this.member = new member();
            this.member.createFirstMember();
            this.members[i] = this.member;
        }
    };

    this.createPopulation = function(membersLastGen){
        console.log("creating next population nr " + this.generationNr);
        this.membersLastGen = membersLastGen;

        for(let i = 0; i < this.size; i++){
            // TODO check if same parent
            let bestParent1 = this.getBestParents();
            let bestParent2 = this.getBestParents();

            this.member = new member();
            this.member.createMember(bestParent1.DNA, bestParent2.DNA);
            this.members[i] = this.member;
        }
        console.log("Best in prev generation during : " + this.membersLastGen[0].minDistance);
        console.log("Best Y  in prev generation during : " + this.membersLastGen[0].minDistanceY);
    };

    this.getBestParents = function() {
        // sort first and then random choose from best parents
        this.membersLastGen.sort(function (a,b) {
           return a.propFitnessScore - b.propFitnessScore;
        });

        let random = Math.floor((Math.random() *101));
        let startValue = 100 * this.membersLastGen[0].propFitnessScore;

        for(let i = 0; i < this.size; i++){
            if(random <= startValue){
                return this.membersLastGen[i];
            }
            // TODO bug when membersLastGen propFitness score, check this!
            if(this.membersLastGen[i+1]) {
                startValue += 100 * this.membersLastGen[i + 1].propFitnessScore;
            }else return this.membersLastGen[i];
        }
    };

    this.mapFitnessScoreMembers = function(){
        let totalScore = 0;
        for(let i = 0; i < this.members.length; i++){

            totalScore += (this.members[i].platformScore + this.members[i].platformScore * ((this.members[i].DNASize - this.members[i].platformCommandIndex) * 0.01));
        }
        for(let i = 0; i <this.members.length; i++){
            //this.members[i].propFitnessScore = ((1/(1+this.members[i].minDistance + this.members[i].platformScore) / totalScore));
            //this.members[i].totaltFitnessScore = this.members[i].minDistance + this.members[i].platformScore;
            this.members[i].propFitnessScore =  ((this.members[i].platformScore + this.members[i].platformScore* ((this.members[i].DNASize - this.members[i].platformCommandIndex) * 0.01)) / totalScore);
            this.members[i].totaltFitnessScore = (this.members[i].platformScore + this.members[i].platformScore* ((this.members[i].DNASize - this.members[i].platformCommandIndex) * 0.01));
            console.log("After run : " + this.members[i].totaltFitnessScore);
        }
    };

    this.setSize = function (size) {
        this.size = size;
    };

    this.getMember = function(index) {
        return this.members[index];
    };
}