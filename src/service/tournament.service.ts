import { Prisma } from "@prisma/client";
import prisma from "client";
import namor from "namor";

/**
 * Tournament service help CRUD and another function for tournament
 */
class TournamentService {
    /**
     * create tournament
     */
    public async create(input: Prisma.TournamentCreateArgs) {
        const tournament = await prisma.tournament.create(input);
        return tournament;
    }

    /**
     *
     * @returns generate random tournament
     */
    public generateRandomTournament() {
        const input: Prisma.TournamentCreateArgs = {
            data: {
                name: namor.generate({ separator: " " }),
            },
        };
        return this.create(input);
    }
}

export default new TournamentService();
