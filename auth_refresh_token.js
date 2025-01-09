import axios from "axios";
import "dotenv/config";
import fs from "fs";

async function refreshToken() {
  try {
    const response = await axios.post(
      "https://api.etsy.com/v3/public/oauth/token",
      {
        grant_type: "refresh_token",
        client_id: process.env.CLIENT_ID,
        refresh_token: process.env.REFRESH_TOKEN,
        usd_token: process.env.USD_ROKEN,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const newAccessToken = response.data.access_token;
    const newRefreshToken = response.data.refresh_token;

    // Refresh .env file
    fs.writeFileSync(
      ".env",
      `CLIENT_ID=${process.env.CLIENT_ID}\n` +
        `ACCESS_TOKEN=${newAccessToken}\n` +
        `REFRESH_TOKEN=${newRefreshToken}\n` +
        `USD_ROKEN=${process.env.USD_ROKEN}`
    );

    console.log("Tokens updated successfully");
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
}

refreshToken();
// export default refreshToken;
