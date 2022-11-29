
function printJobHook(inputs, actions) {
  var maxMins = 1;
  if (!inputs.job.isAnalysisComplete) {
    return;
  };
  var date = new Date(inputs.job.date);
  var YYYY = date.getFullYear();
  var MM = date.getMonth() + 1;
  var DD = date.getDate();
  var hh = date.getHours();
  var mm = date.getMinutes();
  var ss = date.getSeconds();
  var currentDocName = inputs.job.documentName;
  var lastDocName = inputs.user.getProperty("lastDocName");
  var lastTime1 = inputs.user.getProperty("lastTime");
  var lastTime2 = new Date(lastTime1);
  var elapsedTime = date - lastTime2;
  var match = lastDocName === currentDocName;
  var mins = Math.trunc(elapsedTime / 60000);
  
  if (isNaN(elapsedTime)) {
    lastTime2 = date;
    elapsedTime = date - lastTime2;
    lastDocName = null;
    lastTime1 = YYYY + "/" + MM + "/" + DD + "/" + hh + ":" + mm + ":" + ss;
  };
  
  if (mins > maxMins) {
    lastDocName = null;
    lastTime1 = YYYY + "/" + MM + "/" + DD + "/" + hh + ":" + mm + ":" + ss;
    mins = 0;
  };
  
  actions.log.info("currentDocName:" + currentDocName + "," + "lastDocName:" + lastDocName + "," + match);
  if (match) {
    actions.job.cancelAndLog(mins + "分以内に" + currentDocName +  "という名前のジョブが印刷されました。"
                             + maxMins + "分以内に同じドキュメント名のジョブは印刷しないでください。");
  }
  actions.user.onCompletionSaveProperty("lastTime", lastTime1, {
    'saveWhenCancelled': true
  });
  actions.user.onCompletionSaveProperty("lastDocName", currentDocName, {
    'saveWhenCancelled': true
  });
};
