const KV = require("./src")

async function setgetlog(kv, key, value)
{
    await kv.set(key, value) 

    const v = await kv.get(key)

    console.log(v);
}

async function main()
{
    const kv = new KV({
        name: "keyvalue"
    }); 
    await kv.init()

    await setgetlog(kv, "siemano", {do_kogo: "mordo"}) 
    await setgetlog(kv, "siemano", {do_kogo: "typie"}) 

    await kv.remove("siemano") 

    const val = await kv.get("siemano")
    console.log(val);

    await setgetlog(kv, "none", undefined) 

    await setgetlog(kv, "empty", {}) 

    const value = await kv.get("this-key-does-not-exists")
    console.log(value);

    await kv.teardown()
}

main()
