
const container = document.getElementById("container");
const status = document.getElementById("status");

const apiUrls = {
  shamail: "https://api.islamicdesk.com/api/seerathon/corpus/shamail",
  courses: "https://api.islamicdesk.com/api/seerathon/corpus/courses",
  timeline: "https://api.islamicdesk.com/api/seerathon/corpus/timeline"
};

// Object se readable text nikalne ke liye
function getText(value) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return "";
}

// Card create karne ka function
function createCard(item, category) {
  const card = document.createElement("div");
  card.className = "card";

  const urdu = item?.ur || {};
  const title =
    getText(urdu.title) ||
    getText(item?.title) ||
    getText(item?.name) ||
    getText(item?.en?.title) ||
    category;

  const heading = document.createElement("h3");
  heading.textContent = title;
  card.appendChild(heading);

  // Shamail ka Urdu tarjuma
  const description =
    getText(urdu.hadeesTarjama) ||
    getText(urdu.description) ||
    getText(item?.description) ||
    getText(item?.content) ||
    getText(item?.en?.description);

  if (description) {
    const paragraph = document.createElement("p");
    paragraph.className = "urdu";
    paragraph.textContent = description;
    card.appendChild(paragraph);
  }

  // Agar doosre API fields bhi hon to unhein show karein
  const excluded = ["ur", "en", "title", "name", "description", "content"];

  Object.entries(item || {}).forEach(([key, value]) => {
    if (excluded.includes(key)) return;
    if (value === null || value === undefined) return;

    if (typeof value === "string" || typeof value === "number") {
      const paragraph = document.createElement("p");
      paragraph.textContent = `${key}: ${value}`;
      card.appendChild(paragraph);
    }
  });

  // Agar item mein details na hon
  if (card.children.length === 1) {
    const paragraph = document.createElement("p");
    paragraph.textContent = "More details are not available.";
    card.appendChild(paragraph);
  }

  return card;
}

// API se data fetch karna
async function loadData(category = "shamail") {
  container.replaceChildren();
  status.textContent = "Loading data...";

  document.querySelectorAll(".controls button").forEach(button => {
    button.disabled = true;
  });

  try {
    const response = await fetch(apiUrls[category]);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    console.log("Data from API =>", data);

    const items = data?.data?.items;

    if (!Array.isArray(items) || items.length === 0) {
      status.textContent = "No items found in the API response.";
      return;
    }

    console.log(`${category} =>`, items);

    items.forEach(item => {
      const card = createCard(item, category);
      container.appendChild(card);
    });

    status.textContent =
      `${category.toUpperCase()}: ${items.length} items loaded successfully.`;

  } catch (error) {
    console.error("Error fetching API:", error);

    status.textContent =
      "Data load nahi hua. Internet, API server ya browser console check karein.";
  } finally {
    document.querySelectorAll(".controls button").forEach(button => {
      button.disabled = false;
    });
  }
}

// Page open hote hi Shamail load karein
loadData("shamail");

console.log("Checking synchronous code");
