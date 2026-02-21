const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();
app.use(express.json());
app.use(cors());

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
});

app.post("/create_preference", async (req, res) => {
    try {
        // Verificamos que lleguen items
        if (!req.body.items || req.body.items.length === 0) {
            return res.status(400).json({ error: "Carrito vacío" });
        }

        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: req.body.items,
                back_urls: {
                    success: "https://auraluxuryperfumes.netlify.app",
                    failure: "https://auraluxuryperfumes.netlify.app",
                    pending: "https://auraluxuryperfumes.netlify.app"
                },
                auto_return: "approved",
            }
        });

        res.json({ id: result.id });
    } catch (error) {
        console.error("ERROR DETALLADO:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
