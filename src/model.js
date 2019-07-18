class KV
{
    constructor()
    {
        this.storage = {};
    }

    async init(){ return this; }
    async teardown(){}

    async get(key)
    {
        const value = this.storage[key];

        return (typeof(value) === "undefined")
            ? null
            : value
    }

    async set(key, value)
    {
        this.storage[key] = value;
    }

    async remove(key)
    {
        this.set(key, null);
    }
}

module.exports = KV;
