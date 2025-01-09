import axios from "axios";
import "dotenv/config";
import fs from "fs";
import { json2csv } from "json-2-csv";

async function fetchListings(shopId, offset) {
  const accessToken = process.env.ACCESS_TOKEN;
  const apiKey = process.env.CLIENT_ID;

  const paramsObj = {
    limit: 100,
    offset: offset,
  };

  const url = `https://openapi.etsy.com/v3/application/shops/${shopId}/reviews`;

  try {
    const response = await axios.get(url, {
      headers: {
        "x-api-key": apiKey,
        Authorization: `Bearer ${accessToken}`,
      },
      params: paramsObj,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching listings:", error);

    return null;
  }
}

async function saveCsvFromJson(data, filePath) {
  try {
    // Конвертируем JSON в CSV
    const csv = await json2csv(data);

    // Сохраняем CSV в файл
    fs.writeFileSync(filePath, csv);

    console.log(`CSV успешно сохранен в ${filePath}`);
  } catch (err) {
    console.error("Ошибка при конвертации JSON в CSV:", err);
  }
}

(async () => {
  const { count } = await fetchListings("19619773");
  let reviews = [];

  const countsOfIterations = Math.ceil(count / 100);

  for (let index = 0; index < countsOfIterations; index++) {
    const offset = 100 * index;

    // console.log(offset);

    const { results } = await fetchListings("19619773", offset);

    reviews = reviews.concat(results);
  }

  console.log(reviews.length);

  fs.writeFileSync("reviews.json", JSON.stringify(reviews));

  saveCsvFromJson(reviews, "output.csv");

  //   console.log(results);
})();

// export default fetchListings;

// getReviewsByListing
