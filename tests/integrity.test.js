const fc = require('fast-check');

const { Validators, KV, Model } = require("src");


const validKey = fc.string()
    .filter(s => Validators.validate_key(s))

const validValue = fc.object()
    .filter(s => Validators.validate_value(s))


test("non-existing key", async () => {
    kv = new KV({
        name: "non_existant_key"
    })
    kv_m = new Model()

    await kv.init();

    await fc.assert(
        fc.asyncProperty(
            validKey,
            async key => expect(await kv.get(key)).toBe(await kv_m.get(key))
        )
    );

    await kv.teardown();
})

test("set and get known object", async () => {
    kv = new KV({
        name: "any_key"
    })
    kv_m = new Model()

    await kv.init();

    await fc.assert(
        fc.asyncProperty(
            validKey,
            async key => {
                await kv.set(key, {});
                await kv_m.set(key, {});

                expect(await kv.get(key)).toEqual(await kv_m.get(key));
            }
        )
    );

    await kv.teardown();
})

test("set and get any object with known key", async () => {
    kv = new KV({
        name: "any_object"
    });
    kv_m = new Model()

    await kv.init();

    await fc.assert(
        fc.asyncProperty(
            fc.object(),
            async (obj) => {
                await kv.set("key", obj);
                await kv_m.set("key", obj);

                expect(await kv.get("key")).toEqual(await kv_m.get("key"));
            }
        ),
    );

    await kv.teardown();
})
