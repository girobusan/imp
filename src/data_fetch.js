if (!fetch.isAlreadyFixed) {
  function traceData(path, data) {
    if (!data) {
      data = window.impData;
    }
    const PA = path.split("/");
    return PA.reduce((a, e) => {
      if (!a) {
        return a;
      }
      return a[e];
    }, data);
  }
  function tryParse(d) {
    let r = d;
    try {
      r = JSON.parse(d);
    } catch {
      console.error("can not json");
      return {};
    }
    return r;
  }

  const real_fetch = fetch;
  window.fetch = function(url, opts) {
    if (url.startsWith("@")) {
      const dataId = url.substring(1);
      const data = traceData(dataId, window.impData);
      if (!data) {
        return Promise.reject("No such data");
      }
      const dataType = typeof data;
      const d = data;
      return Promise.resolve({
        ok: true,
        status: 200,
        blob: () =>
          Promise.resolve(
            new Blob([dataType == "object" ? JSON.stringify(d) : d]),
            { type: "text/plain" },
          ),
        text: () =>
          Promise.resolve(dataType == "object" ? JSON.stringify(d) : d),
        json: () => Promise.resolve(dataType == "object" ? d : tryParse(d)),
      });
    }
    return real_fetch(url, opts);
  };
  window.fetch.isAlreadyFixed = true;
}
