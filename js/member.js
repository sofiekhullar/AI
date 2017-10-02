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
        for(let i = 0; i < DNASize; i ++) {
            this.DNA[i] = commandList[Math.floor((Math.random() * commandList.length))];
        }

        console.log("Creating member with DNA: " + this.DNA);
        return this.DNA;
    };

    this.createDNA = function (parent1DNA, parent2DNA) {
        let parent1 = ["WR", "WL", "J", "JR", "JL","WR", "WL", "J", "JR", "JL"];
        let parent2 = ["WL0","WL1","WL2","WL3","WL4","WL5","WL6","WL7","WL8","WL9"];

        //possible to get the DNS from only one parent
        let random = Math.floor((Math.random() * parent1.length) + 1);
        let gene1 = parent1.slice(0, random);
        let gene2 = parent2.slice(random, 10);
        let child = gene1.concat(gene2);
        return this.addMutation(child);


    };

    this.addMutation = function(child){
        let mutantPercentage = 15;
        let random = Math.floor((Math.random() * 100) + 1);
        if(mutantPercentage >= random){
            x = Math.floor((Math.random() * child.length) + 1);
            y = Math.floor((Math.random() * child.length) + 1);
            let temp = child[x];
            child[x] = child[y];
            child[y] = temp;
            console.log("mutant" + child)
;        }
        return child;

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