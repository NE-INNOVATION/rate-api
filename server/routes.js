const express = require('express')
const bodyParser = require('body-parser')
const { route } = require('./api')
const dataStore = require('./data/dataStore')
const health = require('@cloudnative/health-connect')
const { Agent } = require('https')
const Axios = require('axios')
const { response } = require('express')
const e = require('express')

const client = Axios.create({
  httpsAgent: new Agent({
    rejectUnauthorized: false
  })
});

const healthcheck = new health.HealthChecker()

module.exports = () => {
  
  const app = express()
  app.set('json-spaces', 2)
  app.use(bodyParser.json())
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
  
  app.use('/live', health.LivenessEndpoint(healthcheck))
  app.use('/ready', health.ReadinessEndpoint(healthcheck))
  app.use('/health', health.HealthEndpoint(healthcheck))

  // app.use('/api/rate_issue/rate/:id/:quoteId', async (req, res, next) => {
  //   const quoteId = req.params.quoteId
  //   const pd = req.body.pd
  //   const { data } = await client.get(`${process.env.UNDERWRITING_URL}${quoteId}/${pd}`);
  //   console.log(data)
  //   if(data.code === 'RATE_SUCCESS' || data.code === 'UWAPPR'){
  //     next();
  //   }else{
  //     res.send(data)
  //   }
  // })
  
  app.use('/api', route)
  dataStore.createDbConnection()
  
  return app; 
}