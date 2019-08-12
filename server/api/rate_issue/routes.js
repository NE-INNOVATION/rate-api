const express = require('express')
let rn = require('random-number');
const router = express.Router({mergeParams: true})
const dataStore = require('../../data/dataStore')

let polGen = rn.generator({
  min:  100000000
, max:  999999999
, integer: true
})

let covGen = rn.generator({
  min:  100000000
, max:  999999999
, integer: true
})

let policyNumGen = rn.generator({
  min:  100000000000
, max:  999999999000
, integer: true
})


router.route('/rate/:id/:quoteId')
  .get(async (req, res, next) => {
    res.send(JSON.stringify(await getCoverageInfo(req.params.id, req.params.quoteId)))
  })
  .post(async (req, res, next) => {
    res.send(JSON.stringify(await saveCoverageInfo(req.body, req.params.quoteId)))
  })

router.route('/issue/:id/:quoteId')
  .get(async (req, res, next) => {
    res.send(JSON.stringify(await getPolicyInfo(req.params.id, req.params.quoteId)))
  })
  .post(async (req, res, next) => {
    res.send(JSON.stringify(await savePolicyInfo(req.body, req.params.quoteId)))
  })

  let getCoverageInfo = async (id, quoteId) => {
    console.log('Returning Coverage #', id)
    let coverage = await dataStore.findCoverage(quoteId)
    return coverage
  }
  
  let saveCoverageInfo = async (data, quoteId) => {
    let coverage = '';
    if(data.id !== ''){
      coverage = await dataStore.findCoverage(quoteId)
    }else{
      coverage = {};
      coverage.quoteId = quoteId
    }
    
    coverage.bi = data.bi
    coverage.pd = data.pd
    coverage.med = data.med
    coverage.comp = data.comp
    coverage.col = data.col
    coverage.rerim = data.rerim
    coverage.premium = (Math.random() * (10.00 - 1.00 + 1.00) + 1.00).toFixed(2)
    
    if(data.id === '') {
      coverage.id = covGen().toString()
    }

    dataStore.addCoverage(coverage)
    
    return {
      coverageId : coverage.id,
      premium : coverage.premium
    }
  }

  let getPolicyInfo = async (id, quoteId) => {
    console.log('Returning Policy #', id)
    let policy = await dataStore.findPolicy(quoteId)
    return policy
  }
  
  let savePolicyInfo = async (data, quoteId) => {
    let policy = '';
    if(data.id !== ''){
      policy = await dataStore.findPolicy(quoteId)
    }else{
      policy = {};
      policy.quoteId = quoteId
    }
    
    policy.confirmEmail = data.confirmEmail
    policy.confirmContactNum = data.confirmContactNum
    policy.bankName = data.bankName
    policy.accountNum = data.accountNum
    
    if(data.id === '') {
      policy.id = polGen().toString()
      policy.policyNum = policyNumGen().toString()
    }

    dataStore.addPolicy(policy)
  
    return {policyId: policy.id, policyNumber: policy.policyNum};
  }

module.exports = router;