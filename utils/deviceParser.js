function parseUserAgent(ua = "") {
  let browser = "Unknown";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = "Safari";
  let os = "Unknown";
  if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Windows/.test(ua)) os = "Windows";
  else if (/Mac OS/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";
  const deviceType = /iPad|Tablet/.test(ua) ? "Tablet" : /Mobile|Android|iPhone/.test(ua) ? "Mobile" : "Desktop";
  return { browser, os, deviceType };
}
module.exports = { parseUserAgent };