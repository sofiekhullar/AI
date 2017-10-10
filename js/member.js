function member(){

     this.DNA = [];
     this.fitnessScore = 0;
     this.propFitnessScore = 0;
     let ID;
     this.mutantChance = 5;
     this.DNASize = 10;
     let commandList = ["WR", "WL", "J", "JR", "JL"];
     this.win = false;

     // create random member DNA
     this.createFirstMember = function(){
         //console.log("Creating first member..");
         this.createFirstDNA();
        // call create DNA
    };

    // create Child DNA from two parents
    this.createMember = function(parent1, parent2){
        // call create DNA
        this.createDNA(parent1,parent2);//parent1DNA, parent2DNA);
    };

    // Possible genes is WR, WL, J, JR, JL
    this.createFirstDNA = function(){
        for(let i = 0; i < this.DNASize; i ++) {
            this.DNA[i] = commandList[Math.floor((Math.random() * commandList.length))];
        }
        return this.DNA;
    };

    this.createDNA = function (parent1, parent2) {
        //possible to get the DNS from only one parent
        let random = Math.floor((Math.random() * parent1.length) + 1);
        let gene1 = parent1.slice(0, random);
        let gene2 = parent2.slice(random, this.DNASize);
        let child = gene1.concat(gene2);
        this.DNA = this.addMutation(child);
    };

    this.addMutation = function(child){
        // TODO check value for mutation
        let random = Math.floor((Math.random() * 100) + 1);
        if(this.mutantChance >= random){
            x = Math.floor((Math.random() * child.length) + 1);
            y = Math.floor((Math.random() * child.length) + 1);
            let temp = child[x];
            child[x] = child[y];
            child[y] = temp;
        }
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

    this.setPropFitnessScore = function (propFitnessScore) {
        this.propFitnessScore = propFitnessScore;
    };
    this.setWin = function (){
        this.win = true;
    }
}