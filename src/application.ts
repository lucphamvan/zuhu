import express, { Express } from "express";
import cors from "cors";
import cookie from "cookie-parser";
import client from "./client";
import routers from "./routers";
import morgan from "morgan";
import http from "http";

import swaggerUi from "swagger-ui-express";
import swaggerFile from "swagger/swagger.json";

const app = express();
const PORT = 8000;
/** main class for run app */
class Application {
    constructor(private app: Express) {
        this.initialize();
    }

    /**
     * initialize server
     */
    private initialize() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(cookie());
        this.app.use(morgan("dev"));
        app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
    }

    /**connect all router */
    private connectRouter() {
        routers.forEach((router) => {
            this.app.use("/api", router);
        });
    }

    /**
     * load
     */
    public async load() {
        try {
            // connect database
            await client.$connect();
            // connect router
            this.connectRouter();
            // start listen on port 8000
        } catch (error: any) {
            console.log("[app start error] : ", error.message);
            await client.$disconnect();
        }
    }

    /**
     * start
     */
    public start() {
        this.app.listen(PORT, () => {
            console.log(`check at http://localhost:${PORT}/api/ping`);
        });
    }

    public getServer() {
        return http.createServer(app);
    }
}

export default new Application(app);
