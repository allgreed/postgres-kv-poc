const KV = require("./src/kv-pg")


async function main()
{
   const kv = new KV(); 
   await kv.init()

   await kv.set("siemano", "mordo") 

   const va = await kv.get("siemano")
   console.log(va);

   await kv.set("siemano", "typie") 

   const val = await kv.get("siemano")
   console.log(val);
   

   await kv.teardown()
}

main()
