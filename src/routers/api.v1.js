import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("VPS API v1 Endpoint is available, try /api/v1/games.");
});

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

  const matches = games
    .map((game) => {
      const table = game.tableFiles?.find((t) => t?.id === vpsId);
      if (!table) return null;

      return {
        ...game,
        table,
        tableFiles: undefined,
      };
    })
    .filter(Boolean);

  if (matches.length === 1) {
    return res.send(matches[0]);
  }

  return res.send(matches.length === 0 ? {} : matches);
});

export default router;
