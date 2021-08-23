function GetQueries(search) {
  if (!search.startsWith("?")) {
    return false;
  }
  search = search.substr(1, search.length - 1);
  var queries = {};
  search.split("&").forEach((q) => {
    var keyValues = q.split("=");
    if (keyValues.length === 2) {
      queries[keyValues[0]] = keyValues[1];
    } else {
      queries[keyValues[0]] = true;
    }
  });
  return queries;
}

function GetQuery(qName) {
  var queries = GetQueries(window.location.search);
  return queries[qName];
}

function DecodeURI(encoded) {
  if (typeof encoded !== "string") return "";
  return decodeURIComponent(encoded);
}

export default {
  GetQueries,
  GetQuery,
  DecodeURI,
};
