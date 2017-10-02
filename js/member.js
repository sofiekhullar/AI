function member(){

     let DNA = [];
     let fitnessScore;
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
            DNA[i] = commandList[Math.floor((Math.random() * DNASize) )];
        }
        console.log("Creating member with DNA: " + DNA);
        return DNA;
    };

    this.createDNA = function (parent1DNA, parent2DNA) {
        let parent1 = ["WR", "WL", "J", "JR", "JL","WR", "WL", "J", "JR", "JL"];
        let parent2 = ["WL0","WL1","WL2","WL3","WL4","WL5","WL6","WL7","WL8","WL9"];

        //possible to get the DNS from only one parent
        let random = Math.floor((Math.random() * parent1.length) + 1);
        let gene1 = parent1.slice(0, random);
        let gene2 = parent2.slice(random, 10);
        let child = gene1.concat(gene2);
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