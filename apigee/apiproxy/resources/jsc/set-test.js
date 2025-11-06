var upstreamId = context.getVariable("upstream.testId");
var testCaseId = context.getVariable("upstream.testCaseId");
var testContent = context.getVariable("upstreamResponse.content");
var pathSuffix = context.getVariable("proxy.pathsuffix");
var requestVerb = context.getVariable("request.verb");

if (upstreamId && testContent) {
  var testCases = JSON.parse(testContent);
  if (testCases) {
    var testCase = findTest(testCaseId, testCases, pathSuffix, requestVerb, request.content);
    if (testCase) {
      context.setVariable("upstream.testCase", JSON.stringify(testCase));
      // request
      if (testCase.request)
        context.setVariable("request.content", testCase.request);
      
      // variables
      if (testCase.variables) {
        // set variables
        for (var i=0; i<testCase["variables"].length; i++) {
          var variable = testCase["variables"][i];
          var equalsIndex = variable.indexOf("=");
          var variableName = variable.substring(0, equalsIndex);
          print("Found variable name: " + variableName);
          var value = variable.substring(equalsIndex + 1);
          print("Found value: " + value);
          context.setVariable(variableName, value);
        }
      }
    }
  }
}

function findTest(testId, testCases, requestPath, requestVerb, requestContent) {
  print("Finding test with requestPath: " + requestPath + " and requestVerb " + requestVerb);
  var result = undefined;

  if (testCases && testCases.tests && testCases.tests.length > 0) {
    var filteredArray = testCases.tests.filter((x) => x.name == testId);
    if (filteredArray.length > 0) {
      print("Found test case using name: " + testId);
      result = filteredArray[0];
    }
    else if (!Number.isNaN(testId) && Number(testId) < testCases.tests.length) {
      print("Found test case using position: " + testId);
      result = testCases.tests[Number(testId)];
    } else {
      filteredArray = testCases.tests.filter((x) => (x.verb == requestVerb && x.path == requestPath));
      if (filteredArray.length > 0) {
        print("Found test case using path and verb: " + requestVerb + " - " + requestPath);
        result = filteredArray[0];
      } else {
        filteredArray = testCases.tests.filter((x) => x.request == requestContent);
        if (filteredArray.length > 0) {
          print("Found test case using content: " + requestContent);
          result = filteredArray[0];
        }
        else if (testCases.tests.length > 0) {
          print("Did not find test case, taking first one.");
          result = testCases.tests[0];
        }
      }
    }
  }

  return result;
}
