# Swagger

[https://api-zuhu.denojs.info/swagger/](https://api-zuhu.denojs.info/swagger/)

# database

Describle in following folder

-   **diagram**
-   **prisma/schema.prisma**

# Solution 1 : Run localhost with database from docker

**Important : required install **docker-compose** to run mysql in docker**

```bash
docker-compose up --build -d
```

-   wait 1-2 minutes for MySQL running

```bash
npm install
npm run db:init
npm run start:dev
```

-   access [http://localhost:8000/swagger/](http://localhost:8000/swagger/) to check api

# Solution 2 : Run locahost without database from docker

**Important: required run **mysql server** in your localhost or anywhere**

-   config **DATABASE_URL** in **.env** file

```bash
npm install
npm run db:init
npm run start:dev
```

-   access [http://localhost:8000/swagger/](http://localhost:8000/swagger/) to check api

# Insert fixtures for manual test

-   POST **/api/generate-fixtures?amount=x** with x is amount of fixtures will create

# Delete fixtures

-   DELETE **/api/fixtures**

# Reset database

```
npm run db:reset
```

# Testing

```bash
npm run test
```
