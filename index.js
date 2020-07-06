const express = require("express");
const shortid = require("shortid");

const server = express();

server.use(express.json());

let users = [
    {
        id: "a_unique_id", // hint: use the shortid npm package to generate it
        name: "Jane Doe", // String, required
        bio: "Not Tarzan's Wife, another Jane",  // String, required
    }
];

server.get("/", (req, res) => {
    res.status(200).json("<h1>testing tings</h1>");
});

server.get("/api/users", (req, res) => {
    if (users) {
        res.status(200).json(users);
    } else {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." });
    }
})

server.post("/api/users", (req, res) => {
    const newUser = req.body;
    newUser.id = shortid.generate();
    // users.push(newUser);
    if (!newUser.name || !newUser.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } else if (newUser.name && newUser.bio) {
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
    }
})

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;

    let found = users.find(user => user.id === id);

    if (found) {
        res.status(200).json(found);
    } else if (!found) {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
    } else {
        res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    }
});

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const deleted = users.find(user => user.id === id);
    if (deleted) {
        users = users.filter(user => user.id !== id);
        res.status(200).json({ message: "The user has been deleted." });
    } else if (!deleted) {
        res.status(404).json({ message: "The user with the speicfied ID does not exist." });
    } else {
        res.status(500).json({ errorMessage: "The user could not be removed" });
    }
});

server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    let found = users.find(h => h.id === id);

    if (!found) {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
    } else if (!changes.name || !changes.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } else if (found && changes.name && changes.bio) {
        Object.assign(found, changes);
        res.status(200).json(found);
    } else {
        res.status(500).json({ errorMessage: "The user information could not be modified." });
    }
});

const PORT = 8000;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
