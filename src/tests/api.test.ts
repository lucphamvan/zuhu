import application from "../application";
import request from "supertest";
import fixtureService from "../service/fixture.service";
import prisma from "../client";

describe("ZUHU API TEST", () => {
    const server = application.getServer();

    /**
     * before all test
     */
    beforeAll(async () => {
        // load app
        application.load();
        // insert 10 fixtures to database
        await fixtureService.generateFixture(10);
    });

    /**
     * after all test
     */
    afterAll(async () => {
        // delete all record
        const deleteFixture = prisma.fixture.deleteMany({});
        const deleteTeam = prisma.team.deleteMany({});
        const deleteTournament = prisma.tournament.deleteMany({});
        await prisma.$transaction([deleteFixture, deleteTeam, deleteTournament]);

        // close server
        server.close();
    });

    test("get /api/fixtures?limit=abc&offset=1 throw error 'limit is not a number'", async () => {
        const response = await request(server)
            .get("/api/fixtures?limit=abc&offset=1")
            .set("Accept", "application/json");
        expect(response.status).toEqual(400);
        expect(JSON.parse(response.text).err).toEqual("limit is not a number");
    });

    test("get /api/fixtures?limit=12&offset=abc throw error 'offset is not a number'", async () => {
        const response = await request(server)
            .get("/api/fixtures?limit=12&offset=abc")
            .set("Accept", "application/json");
        expect(response.status).toEqual(400);
        expect(JSON.parse(response.text).err).toEqual("offset is not a number");
    });

    test("get /api/fixtures return 10 records", async () => {
        const response = await request(server).get("/api/fixtures").set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.body.items.length).toEqual(10);
        expect(response.body.count).toEqual(10);
    });

    test("get /api/fixtures?offset=0&limit=4 return 4 records", async () => {
        const response = await request(server).get("/api/fixtures?offset=0&limit=4").set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.body.count).toEqual(10);
        expect(response.body.items.length).toEqual(4);
    });

    test("get /api/fixtures?date=1643648400000 (2022, Feb 1) return 1 records", async () => {
        const response = await request(server)
            .get("/api/fixtures?date=1643648400000")
            .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.body.count).toEqual(1);
        expect(response.body.items.length).toEqual(1);
    });

    test("get /api/fixtures/available-date return 10 days and first day is '2022, Feb 1'", async () => {
        const response = await request(server).get("/api/fixtures/available-date").set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(10);
        expect(response.body[0]).toEqual(new Date(2022, 1, 1).valueOf());
    });
});
