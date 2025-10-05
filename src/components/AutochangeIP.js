const serverList = [
  "bedrock.mcfallout.net",
  "jpb.mcfallout.net",
  "na.mcfallout.net",
  "sg.mcfallout.net"
];
const port = 19132;

let currentIndex = 0;

function getCurrentHost() {
  return serverList[currentIndex];
}

function getCurrentPort() {
  return port;
}

function switchToNextHost() {
  currentIndex = (currentIndex + 1) % serverList.length;
  return getCurrentHost();
}
function handleErrorLog(log) {
  if (
    log.includes("Failed to start bot: Connect timed out") &&
    log.includes("Logger.js:54")
  ) {
    switchToNextHost();
    return true; 
  }
  return false; 
}

module.exports = {
  getCurrentHost,
  getCurrentPort,
  switchToNextHost,
  handleErrorLog
};
