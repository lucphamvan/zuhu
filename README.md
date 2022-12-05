# Insert test data

-   run api /api/generate-fixtures?amount=x to create [x] fixtures

# Reset database

```
npm run db:reset
```

# Testing

```bash
npm run test
```

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

-   access [http://localhost:8000/api/ping](http://localhost:8000/api/ping) to check api

# Solution 2 : Run locahost without database from docker

**Important: required run **mysql server** in your localhost or anywhere**

-   config **DATABASE_URL** in **.env** file

```bash
npm install
npm run db:init
npm run start:dev
```

-   access [http://localhost:8000/api/ping](http://localhost:8000/api/ping) to check api
