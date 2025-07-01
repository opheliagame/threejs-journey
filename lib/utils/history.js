let db;
const request = indexedDB.open("db", 1);

request.onupgradeneeded = (event) => {
  // Save the IDBDatabase interface
  const db = event.target.result;

  const objectStore = db.createObjectStore("history", { autoIncrement: true });
};

request.onsuccess = (event) => {
  db = event.target.result;

  const readRequest = db.transaction(["history"]).objectStore("history").get(1);

  readRequest.onsuccess = (event) => {
    if (readRequest.result == null) {
      const writeRequest = db
        .transaction(["history"], "readwrite")
        .objectStore("history")
        .add({ visited: true });
    } else {
      console.log("setting is visited to true");
      window.isVisited = true;
    }
  };

  db.onerror = (event) => {
    // Generic error handler for all errors targeted at this database's
    // requests!
    console.error(`Database error: ${event.target.error?.message}`);
  };
};
