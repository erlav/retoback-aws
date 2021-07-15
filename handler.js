"use strict";

const AWS = require("aws-sdk");
const swapi = require('swapi-node');
const uuid = require("uuid")
const ajs = require("ajv")
const utils = require('./utils')

const s1 = require("./models/crearPersonaRequest.json")
const v1 = new ajs().compile(s1)

const personTable = process.env.PERSON_TABLE;
const dynamo = new AWS.DynamoDB.DocumentClient();


module.exports.obtenerPersona = async(event, context, callback)=> {
  const id = event.pathParameters.id

  try {
    const person = await swapi.getPerson(parseInt(id))
    if (person){
      const persona = utils.mapearPersona(person)
      callback(null, {
        statusCode:200, 
        body:JSON.stringify((persona)?persona:{msg:`No existe persona con ID ${id}`})
      });
    }
    
  }catch(err){
    callback(err);
  }
}

module.exports.crearPersona = async(body)=> {

  return {statusCode: 200, body:{event_json: JSON.stringify(body), type:typeof(body), event_raw: body, validator:v1(JSON.stringify(body))}}
}

module.exports.listarPersonas = async(event, context, callback) =>{
  try {
    const res = await dynamo.scan({
      TableName: personTable
    }).promise()

    //callback(null, {statusCode:200, body: JSON.stringify(res.Items.map((e)=>{return utils.mapearPersona(e)}))})
    callback(null, {statusCode:200, body: JSON.stringify(res.Items)})
  }catch (err){
    callback(err);
  }
}


