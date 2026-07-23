require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static("."));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.get("/api/products", async (req, res) => {
    try {
        const response = await axios.get(
            `${process.env.BASE_URL}/products?type=all`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.API_KEY}`,
                },
            }
        );

        console.log("Total API:", response.data.data.length);
        
        const products = response.data.data.filter(p =>
            /^(XLA|XDA|KDA|XLF)/i.test(p.code)
        );
        
        console.log("Setelah filter:", products.length);

        res.json({
            success: true,
            data: products,
        });

    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({
            success: false,
            error: err.response?.data || err.message,
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
