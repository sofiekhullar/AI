function member(){

     let DNA = [];
     let fitnessScore;
     let ID;
     let mutantChance = 0.05;
     let DNASize = 10;

     // create random member DNA
     this.createFirstMember = function(){
         console.log("Creating first member..");
         this.createFirstDNA();
        // call create DNA
    };

    // create Child DNA from two parents
    this.createMember = function(parent1, parent2){
        // call create DNA
        this.createDNA("","");//parent1DNA, parent2DNA);

    };

    // Possible genes is WR, WL, J, JR, JL
    this.createFirstDNA = function(){
        // long random string with commands
        for(let i = 0; i < DNASize; i ++){
            DNA[i] = "WR";
        }
        console.log("Creating member with DNA: " + DNA);
        return DNA;
    };

    this.createDNA = function (parent1DNA, parent2DNA) {
        // Add mutation here!
        this.addMutation();
    };

    this.addMutation = function(){

    };

    this.getDNA = function () {
        return DNA;
    };

    // calculate distance to door
    this.calcFitnessScore = function(){
        // Get last position and time  (+coins)
        return fitnessScore;
    };

    this.getFitnessScore = function(){
        return fitnessScore;
    };

    this.getID = function () {
        return ID;
    };
}