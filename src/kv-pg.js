const { Client } = require("pg")

const Queries = require("./queries")
const Utilities = require("./utilities")


const makeLazyQueryRunner = initializedCursor => query => () => initializedCursor.query(query);

const makeErrorHandler = kv => handlers =>
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

    console.error(err.stack);
    console.error(`\nerror code: ${err.code}`);

    kv.teardown();

    console.error("exiting!");
    process.exit(1)
}

const recoverFromMissingTableAndThen = (kv, runQuery, continuation) =>
({
    code: "42P01",
    action: () => runQuery(kv.queries.create_table())().then(continuation),
})

const catchDuplicateKeyAndThen = continuation =>
({
    code: "23505",
    action: continuation,
})


class KV
{
    constructor()
    {
        this.queries = Utilities.mapObjectKeys(q => q("kv"), Queries)
        this.makeErrorHandler = makeErrorHandler(this);
    }

    async init()
    {
        console.log("Initializing kv store");
    }

    async get(key)
    {
        const client = new Client()
        await client.connect()
            //.catch(fatalError);

        const runQuery = makeLazyQueryRunner(client);

        const DBResponse = await runQuery(this.queries.get(key))()
            .catch(this.makeErrorHandler([
                recoverFromMissingTableAndThen(this, runQuery, runQuery(this.queries.get())),
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
        
        const runQuery = makeLazyQueryRunner(client);
            
        const DBResponse = await runQuery(this.queries.set_create(k, v))()
            .catch(this.makeErrorHandler([
                recoverFromMissingTableAndThen(this, runQuery, runQuery(this.queries.set_create(k, v))),
                catchDuplicateKeyAndThen(runQuery(this.queries.set_update(k, v))),
            ]))

        await client.end()
    }

    async remove(k)
    {
        this.set(k, null);
    }

    async teardown()
    {
        console.log("Tearing down kv store");
    }
}

module.exports = KV;
