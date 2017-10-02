function member(){

     this.DNA = [];
     this.fitnessScore = 0;
     let ID;
     let mutantChance = 0.05;
     let DNASize = 10;
     let commandList = ["WR", "WL", "J", "JR", "JL"];

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
        for(let i = 0; i < DNASize; i ++){
            this.DNA[i] = commandList[Math.floor((Math.random() * 5))];
        }
        console.log("Creating member with DNA: " + this.DNA);
        return this.DNA;
    };

    this.createDNA = function (parent1DNA, parent2DNA) {
        // Add mutation here!
        this.addMutation();
    };

    this.addMutation = function(){

    };

    this.getDNA = function () {
        return this.DNA;
    };

    // calculate distance to door
    this.calcFitnessScore = function(){
        // Get last position and time  (+coins)
        return this.fitnessScore;
    };

    this.setFitnessScore = function (fitnessScore) {
         this.fitnessScore = fitnessScore;
    };
    
    this.getFitnessScore = function(){
        return this.fitnessScore;
    };

    this.getID = function () {
        return ID;
    };
}