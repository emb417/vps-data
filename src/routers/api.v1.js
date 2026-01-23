import express from "express";

const router = express.Router();

router.get("/games", (req, res) => {
  const games = req.vpsDb;
  res.send(games);
});

router.get("/games/:name", (req, res) => {
  const games = req.vpsDb;
  const name = req.params.name;

  const regex = new RegExp(`.*${name?.toLowerCase()}.*`, "i");
  const filtered = games.filter((g) => g.name?.toLowerCase().match(regex));

  res.send(filtered);
});

router.get("/games/tables/:vpsId", (req, res) => {
  const games = req.vpsDb;
  const vpsId = req.params.vpsId;

  const filtered = games.filter((g) =>
    g.tableFiles?.some((t) => t?.id === vpsId),
  );

  if (filtered.length === 1) {
    const game = filtered[0];
    game.table = game.tableFiles?.find((t) => t.id === vpsId);
    delete game.tableFiles;
    return res.send(game);
  }

  res.send(filtered.length === 0 ? {} : filtered);
});

export default router;
