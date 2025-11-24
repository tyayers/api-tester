var upstreamId = context.getVariable("request.header.x-upstream-id");

if (upstreamId && upstreamId.includes(".")) {
  var pieces = upstreamId.split(".");
  context.setVariable("upstream.testId", pieces[0]);
  context.setVariable("upstream.testCaseId", pieces[1]);
} else if (upstreamId) {
  context.setVariable("upstream.testId", upstreamId);
}