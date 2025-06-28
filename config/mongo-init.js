db = db.getSiblingDB("streamedge");

db.createUser({
    user: "admin",
    pwd: "admin",
    roles: [{ role: "readWrite", db: "streamedge" }]
});

db.createCollection("videos");
db.createCollection("views");
