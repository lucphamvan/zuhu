import { Fixture, Prisma } from "@prisma/client";
import prisma from "client";
import teamService from "./team.service";
import tournamentService from "./tournament.service";
import moment from "moment";

/**
 * Fixture service help CRUD and another function for fixtures
 */
class FixtureService {
    /**
     *  Get list fixtures
     * @param offset
     * @param limit
     * @param date filter fixtures occurs in this date. Time in miliseconds
     * @returns
     */
    public async getList(offset?: string, limit?: string, date?: string): Promise<FixturesResponseType> {
        // include relation to hometeam, awayteam, tourament
        let inputArgs: Prisma.FixtureFindManyArgs = {
            include: {
                HomeTeam: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    },
                },
                AwayTeam: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    },
                },
                Tournament: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                setupTime: "asc",
            },
        };

        // pagination with limit, offset
        if (offset && limit) {
            inputArgs = {
                ...inputArgs,
                skip: Number(offset) * Number(limit),
                take: Number(limit),
            };
        }

        // condition search with date
        if (date !== undefined) {
            const dateObj = new Date(Number(date));
            const day = dateObj.getDate();
            const month = dateObj.getMonth();
            const year = dateObj.getFullYear();
            const minTime = new Date(year, month, day);
            const maxTime = new Date(year, month, day, 23, 59, 59, 999);
            inputArgs.where = {
                setupTime: { gte: minTime, lte: maxTime },
            };
        }

        //find
        const itemPromise = prisma.fixture.findMany(inputArgs);
        const countPromise = prisma.fixture.count({ where: inputArgs.where });
        const [items, count] = await Promise.all([itemPromise, countPromise]);
        const result = { items, count };

        return result;
    }

    /**
     * get list date have fixtures
     */
    public async getAvailableDate() {
        // set of date have fixtures (in miliseconds)
        const listDate: Set<number> = new Set();
        // get all setupTime of fixtures
        const records = await prisma.fixture.findMany({
            select: {
                setupTime: true,
            },
        });

        // loop and add add with dd/mm/yy 0h:0m:0s to listDate
        records?.forEach((record) => {
            const datetime = moment(record.setupTime).startOf("day").valueOf();
            listDate.add(datetime);
        });

        return listDate;
    }

    /**
     * generate fixtures for testing
     * @param amount
     */
    public async generateFixture(amount: number) {
        // array input to create fixtures
        const fixtureCreateManyInput: Prisma.FixtureCreateManyInput[] = [];

        // create tournament
        const tournament_1 = await tournamentService.generateRandomTournament();
        const tournament_2 = await tournamentService.generateRandomTournament();

        // config this to unit test
        const setupTimeConst = new Date(2022, 1, 1);

        // random generate fixture
        for (let i = 0; i < amount; i++) {
            const homeTeam = await teamService.generateRandomTeam();
            const awayTeam = await teamService.generateRandomTeam();
            const fixture: Prisma.FixtureCreateManyInput = {
                homeTeamId: homeTeam.id,
                awayTeamId: awayTeam.id,
                status: "NOT_START",
                tournamentId: i % 2 === 0 ? tournament_1.id : tournament_2.id,
                setupTime: i === 0 ? setupTimeConst : moment().add(i, "days").toDate(),
            };

            fixtureCreateManyInput.push(fixture);
        }
        // create fixtures
        await prisma.fixture.createMany({
            data: fixtureCreateManyInput,
            skipDuplicates: true,
        });
    }
}

type FixturesResponseType = {
    items: Fixture[];
    count: number;
};

export default new FixtureService();
