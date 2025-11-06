var proxy={
  "name": "Feature-TESTER-v1",
  "type": "proxy",
  "description": "Feature-TESTER-v1",
  "parameters": [],
  "endpoints": [
    {
      "name": "tester",
      "basePath": "/v1/test",
      "routes": [
        {
          "name": "default",
          "target": "tester"
        }
      ],
      "flows": [
        {
          "name": "PreFlow",
          "mode": "Request",
          "steps": [
            {
              "name": "JS-SetTestData"
            },
            {
              "name": "AM-SetPayload",
              "condition": "tester.content != null"
            }
          ]
        }
      ],
      "faultRules": []
    }
  ],
  "targets": [
    {
      "name": "tester",
      "url": "",
      "flows": [],
      "faultRules": [],
      "localTargetConnection": {
        "APIProxy": {
          "_text": "{tester.proxy}"
        },
        "ProxyEndpoint": {
          "_text": "{tester.endpoint}"
        }
      }
    }
  ],
  "policies": [
    {
      "name": "AM-SetPayload",
      "type": "AssignMessage",
      "content": {
        "AssignMessage": {
          "_attributes": {
            "continueOnError": "false",
            "enabled": "true",
            "name": "AM-SetPayload"
          },
          "DisplayName": {
            "_text": "AM-SetPayload"
          },
          "Properties": {},
          "Set": {
            "Payload": {
              "_text": "\n      {tester.content}\n    "
            }
          },
          "IgnoreUnresolvedVariables": {
            "_text": "true"
          },
          "AssignTo": {
            "_attributes": {
              "createNew": "false",
              "transport": "http",
              "type": "request"
            }
          }
        }
      }
    },
    {
      "name": "JS-SetTestData",
      "type": "Javascript",
      "content": {
        "Javascript": {
          "_attributes": {
            "continueOnError": "false",
            "enabled": "true",
            "timeLimit": "200",
            "name": "JS-SetTestData"
          },
          "DisplayName": {
            "_text": "JS-SetTestData"
          },
          "Properties": {},
          "ResourceURL": {
            "_text": "jsc://set-test.js"
          }
        }
      }
    }
  ],
  "resources": [
    {
      "name": "set-test.js",
      "type": "jsc",
      "content": "var requestObject = request.content.asJSON;\n\nif (requestObject) {\n  context.setVariable(\"tester.proxy\", requestObject[\"proxy\"]);\n  context.setVariable(\"tester.endpoint\", requestObject[\"endpoint\"]);\n  context.setVariable(\"tester.content\", requestObject[\"request\"]);\n  context.setVariable(\"request.content\", requestObject[\"request\"]);\n\n  if (requestObject[\"variables\"]) {\n    // set variables\n    for (var i=0; i<requestObject[\"variables\"].length; i++) {\n      var variable = requestObject[\"variables\"][i];\n      var equalsIndex = variable.indexOf(\"=\");\n      var variableName = variable.substring(0, equalsIndex);\n      print(\"Found variable name: \" + variableName);\n      var value = variable.substring(equalsIndex + 1);\n      print(\"Found value: \" + value);\n      context.setVariable(variableName, value);\n    }\n  }\n} else {\n  print(\"No tester configuration found!\")\n}"
    }
  ],
  "tests": []
};