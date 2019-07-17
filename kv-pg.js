const { Client } = require("pg")

const Queries = require("./queries")


const mapObjectKeys = (fn, obj) => Object.assign(...Object.entries(obj).map(([k, v]) => ({[k]: fn(v)})));

const makeQueryRunner = initializedCursor => query => initializedCursor.query(query);

const makeErrorHandler = handlers =>
    err =>
{
    for (const handler of handlers)
    {
        if (err.code !== handler.code)
        {
            continue
        }
        else
        {
            return handler.action()
        }
    }

    consle.error(`Unhandled error: ${err.code}`);
    console.error(err.stack);
    consle.error("exiting!");
    process.exit(1)
}


class KV
{
    constructor()
    {
        this.queries = mapObjectKeys(q => q("kv"), Queries)
    }

    async init()
    {
        
    }

    async get(key)
    {
        const client = new Client()
        await client.connect()
            //.catch(fatalError);

        const runQuery = makeQueryRunner(client);

        const recoverFromMissingTableAndThen = continuation =>
        ({
            code: "42P01",
            action: () => runQuery(this.queries.create_table()).then(continuation),
        })

        const DBResponse = await runQuery(this.queries.get(key))
            .catch(makeErrorHandler([
                recoverFromMissingTableAndThen(() => runQuery(this.queries.get())),
            ]))

        const value = DBResponse.rows[0] ?
            DBResponse.rows[0].value
            : null

        await client.end()
        return value
    }

    async set(k, v)
    {
        const client = new Client()
        await client.connect()
            //.catch(pgErrorPanicOnFailure);
        
        const runQuery = makeQueryRunner(client);
            
        const recoverFromMissingTableAndThen = continuation =>
        ({
            code: "42P01",
            action: () => runQuery(this.queries.create_table()).then(continuation),
        })

        const catchDuplicateKeyAndThen = continuation =>
        ({
            code: "23505",
            action: continuation,
        })

        const DBResponse = await runQuery(this.queries.set_create(k, v))
            .catch(makeErrorHandler([
                recoverFromMissingTableAndThen(() => runQuery(this.queries.set_create(k, v))),
                catchDuplicateKeyAndThen(() => runQuery(this.queries.set_update(k, v))),
            ]))

        await client.end()
    }

    async teardown()
    {

    }
}

module.exports = KV;
