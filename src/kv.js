const { Client } = require("pg")

const Queries = require("./queries")
const Utilities = require("./utilities")
const Validators = require("./input.js")


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
    //process.exit(1)
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
    constructor(config = {})
    {
        let { name } = config;

        name = name || "kv";

        this.queries = Utilities.mapObjectKeys(q => q(name), Queries)
        this.makeErrorHandler = makeErrorHandler(this);
    }

    async init()
    {
        console.log("Initializing kv store");
        return this;
    }

    async get(key)
    {
        this.validate(key, Validators.validate_key);

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

    async set(key, value)
    {
        this.validate(key, Validators.validate_key);
        this.validate(value, Validators.validate_value);

        const client = new Client()
        await client.connect()
            //.catch(pgErrorPanicOnFailure);
        
        const runQuery = makeLazyQueryRunner(client);
            
        const DBResponse = await runQuery(this.queries.set_create(key, value))()
            .catch(this.makeErrorHandler([
                recoverFromMissingTableAndThen(this, runQuery, runQuery(this.queries.set_create(key, value))),
                catchDuplicateKeyAndThen(runQuery(this.queries.set_update(key, value))),
            ]))

        await client.end()
    }

    validate(input, fn)
    {

    }

    async remove(key)
    {
        await this.set(key, null);
    }

    async teardown()
    {
        console.log("Tearing down kv store");
    }
}

module.exports = {
    KV,
    Validators,
};
