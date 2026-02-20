const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();
app.use(express.json());
app.use(cors());

// CONFIGURACIÓN DE MERCADO PAGO
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
});

app.post("/create_preference", async (req, res) => {
    try {
        const preference = new Preference(client);
        const response = await preference.create({
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

        // IMPORTANTE: Devolvemos solo el ID
        res.json({ id: response.id });
    } catch (error) {
        console.error("Error en MP:", error);
        res.status(500).json({ error: "No se pudo crear el pago", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
