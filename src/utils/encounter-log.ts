
export class encounterLog {
    encounter: string;
    log: {[key: string]: any}[];

    constructor(encounter: string) {
        this.encounter = encounter;
        this.log = [];
    }

    addTurn(round: number, activeCreature: string) {
        !this.log[round] && (this.log[round] = {});
        this.log[round][activeCreature] = []
    }

    addAction(round: number, activeCreature: string, targetsBefore: {[key: string]: any}[], targetsAfter: {[key: string]: any}[]) {

    }

}

