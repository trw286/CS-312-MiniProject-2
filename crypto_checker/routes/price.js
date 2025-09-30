import express from "express";
import axios from "axios";                     // for making HTTP requests

const router = express.Router();

// axios instance for CoinGecko API
const coinGeckoInstance = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 8000,
  headers: process.env.CG_DEMO_API_KEY
    ? { "x-cg-demo-api-key": process.env.CG_DEMO_API_KEY }
    : {}
});

// abbreviations for crypto
const symbolToID = {
  btc: "bitcoin",
  eth: "ethereum",
  sol: "solana",
  doge: "dogecoin"
}

// POST /price
router.post("/", async (req, res) => {

    // get coin and fiat from form, or fill with defaults
    const coinRaw = (req.body.coin || "bitcoin").trim();
    const fiatRaw = (req.body.fiat || "USD").trim();

    // normalize coin and fiat
    const coinID = symbolToID[coinRaw.toLowerCase()] || coinRaw.toLowerCase();
    const fiat = fiatRaw.toLowerCase();

    // call CoinGecko API
    try {
        const { data } = await coinGeckoInstance.get("/simple/price", {
            params: { ids: coinID, vs_currencies: fiat }
        });

        // extract price from response
        const val = data?.[coinID]?.[fiat];
        if (val == null) {
            throw new Error("No price found for that coin. Check that the coin is a valid CoinGecko ID.");
    }

    // render result page
    const normalized = { coin: coinID, fiat: fiatRaw, price: val };
    res.render("result", { ok: true, data: normalized });
    } catch (err) {
        res.render("result", { ok: false, error: err.message || "Request failed." });
    }
});

export default router;