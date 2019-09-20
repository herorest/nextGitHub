function prefixSessionId(sid){
    return `ssid:${sid}`;
}

module.exports = class RedisSessionStore{
    constructor(client){
        this.client = client;
    }

    /**
     * 获取key
     * @param {*} sid 
     */
    async get(sid){
        const data = await this.client.get(prefixSessionId(sid));

        if(!data){
            return null;
        }

        try{
            const result = JSON.parse(data);
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * 添加key
     * @param {*} sid 
     * @param {*} value 
     * @param {*} ttl 毫秒
     */
    async set(sid, value, ttl){
        const id = prefixSessionId(sid);
        if(typeof ttl === 'number'){
            ttl = Math.ceil(ttl / 1000);
        }
        try{
            const str = JSON.stringify(value);
            if(ttl){
                await this.client.setex(id, ttl, str);
            }else{
                await this.client.set(id, str);
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * 删除key
     * @param {*} sid 
     */
    async destroy(sid){
        await this.client.del(prefixSessionId(sid));
    }
}