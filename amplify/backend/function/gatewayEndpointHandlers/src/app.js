/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "availability";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const captainCIID = "captainCIID";
const partitionKeyType = "S";
const sortKeyName = "startTime";
const sortKeyType = "S";
const hasSortKey = sortKeyName !== "";
const path = "/availability";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + captainCIID;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************
 * HTTP Get method for list objects *
 ********************************/

// GET /availability
app.get(path, function(req, res) {
  var condition = {}
  condition[captainCIID] = {
    ComparisonOperator: 'EQ'
  }

  if (userIdPresent && req.apiGateway) {
    condition[captainCIID]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
  } else {
    try {
      condition[captainCIID]['AttributeValueList'] = [ convertUrlType(req.params[captainCIID], partitionKeyType) ];
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let queryParams = {
    TableName: tableName,
    KeyConditions: condition
  }

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/


// GET /availability/mine/:startTime
app.get(path + '/mine' + sortKeyPath, function(req, res) {
  var conditions = {};
  conditions[captainCIID] = {};
  conditions[sortKeyName] = {};
  
  if (req.apiGateway) {
    conditions[captainCIID]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH];
  } else {
    // res.statusCode = 401;
    res.status(401).json({error: 'Must be logged in as captain'})
    return
  }
    // conditions[captainCIID] = req.params[captainCIID];
    // try {
    //   conditions[captainCIID] = convertUrlType(req.params[captainCIID], partitionKeyType);
    // } catch(err) {
    //   res.statusCode = 500;
    //   res.json({error: 'Wrong column type ' + err});
    // }
  // }
  
  // Get sortKey from params
  try {
    conditions[sortKeyName]['AttributeValueList'] = [convertUrlType(req.params[sortKeyName], sortKeyType)];
  } catch(err) {
    res.status(400).json({error: 'Must provide startTime: ' + err});
  }

  // condition[captainCIID] = {
  //   ComparisonOperator: 'EQ'
  // }

  conditions[captainCIID]['ComparisonOperator'] = 'EQ'
  conditions[sortKeyName]['ComparisonOperator'] = 'GE'

  let queryParams = {
    TableName: tableName,
    KeyConditions: conditions
  }

  dynamodb.query(queryParams,(err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({
        errorMessage: "Could not load items"
        // errors: [
        //   {
        //     message: 'Could not load items: ' + err
        //   }
        // ]
      });
    } else {
      res.status(200).json(data.Items);
      // if (data.Items) {
      //   res.status(200).json(data.Items);
      // } else {
      //   res.status(404).json({error: `No availablity found after this startTime`})
      // }
    }
  });
});


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, function(req, res) {

  if (req.apiGateway) {
    req.body[captainCIID] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    res.status(401).json({error: 'Must be logged in as captain'})
    return
  }

  // Add checks for body content

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'Availability added!', url: req.url, data: data})
    }
  });
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'post call succeed!', url: req.url, data: data})
    }
  });
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[captainCIID] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[captainCIID] = req.params[captainCIID];
     try {
      params[captainCIID] = convertUrlType(req.params[captainCIID], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }
  dynamodb.delete(removeItemParams, (err, data)=> {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url});
    } else {
      res.json({url: req.url, data: data});
    }
  });
});
app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
