const server=require('./server.js');
const request=require('supertest');




describe('test api endpoint', ()=>{
    describe('test the endpoint api/auth', ()=>{
        it('it should return status code of 200', async ()=>{
            const res= await request(server).get('/api/auth');
            expect(res.status).toEqual(200);
        })
        it('calling get to api/auth should return all the users', async ()=>{
            const res=await request(server).get('/api/auth');
            expect(res.body).toHaveLength(3);
        })
    })
    describe('test hte endpoint api/auth/register', ()=>{
        it('it should return the status code of 403 if there is no username provided', async ()=>{
            const res=await request(server).post('/api/auth/register');
            expect(res.status).toBe(403);
        })
        it('it should return a message saying that we are missing a username', async ()=>{
            const res=await request(server).post('/api/auth/register');
            expect(res.body).toBe(`Please provide a username`)
        })
    })
})