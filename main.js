const KV = require("./src/kv-pg")


async function main()
{
   const kv = new KV(); 
   await kv.init()

   await kv.set("siemano", {do_kogo: "mordo"}) 

   const va = await kv.get("siemano")
   console.log(va);

   await kv.set("siemano", {do_kogo: "typie"}) 

   const val = await kv.get("siemano")
   console.log(val);

   await kv.set("none", undefined) 
   
   const v = await kv.get("none")
   console.log(v);

   await kv.set("empty", {}) 
   
   const valuev = await kv.get("empty")
   console.log(valuev);

   const value = await kv.get("this-key-does-not-exists")
   console.log(value);

   await kv.teardown()
}

main()
