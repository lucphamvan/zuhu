import { Prisma, Team } from "@prisma/client";
import prisma from "client";
import namor from "namor";

const logo =
    "https://upload.wikimedia.org/wikipedia/vi/thumb/9/91/FC_Barcelona_logo.svg/1200px-FC_Barcelona_logo.svg.png";

/**
 * Team service help CRUD and another function for team
 */
class TeamService {
    /**
     * create team
     * @param input
     * @returns team
     */
    public async create(input: Prisma.TeamCreateArgs): Promise<Team> {
        const team = await prisma.team.create(input);
        return team;
    }

    /**
     * generate random team
     * @returns team
     */
    public async generateRandomTeam() {
        const input: Prisma.TeamCreateArgs = {
            data: {
                name: namor.generate(),
                logo,
            },
        };
        const team = await this.create(input);
        return team;
    }
}

export default new TeamService();
