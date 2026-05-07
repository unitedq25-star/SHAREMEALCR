const STORAGE_KEY = "rizqshare_food_posts_v1";
const INBOX_STORAGE_KEY = "rizqshare_inbox_messages_v1";

function normalizeStoredFoodPost(item) {
  const defaultStatus = window.FOOD_STATUS?.AVAILABLE || "available";
  const defaultCategory = window.FOOD_CATEGORIES?.[0] || "Home Made";
  const defaultCondition = window.FOOD_CONDITIONS?.[0] || "Fresh";

  const quantityNumber = Number(item?.quantity);
  const quantity = Number.isFinite(quantityNumber) && quantityNumber > 0 ? quantityNumber : 1;

  const postedAt = item?.postedAt ? new Date(item.postedAt) : new Date();
  const pickupDeadline = item?.pickupDeadline ? new Date(item.pickupDeadline) : new Date(Date.now() + 60 * 60 * 1000);

  return {
    id: item?.id || `post_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    name: String(item?.name ?? "").trim() || "Untitled meal",
    area: String(item?.area ?? "").trim() || "Unknown area",
    category: String(item?.category ?? "").trim() || defaultCategory,
    quantity,
    condition: String(item?.condition ?? "").trim() || defaultCondition,
    pickupDeadline,
    status: String(item?.status ?? "").trim() || defaultStatus,
    postedAt,
  };
}

function loadFoodList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => normalizeStoredFoodPost(item))
      .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  } catch {
    return [];
  }
}

function saveFoodList(foodList) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foodList));
  } catch {
    // ignore quota / disabled storage errors
  }
}

function loadInboxMessages() {
  try {
    const raw = localStorage.getItem(INBOX_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        id: item?.id || `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        sender: String(item?.sender ?? "Donor"),
        text: String(item?.text ?? "").trim(),
        createdAt: item?.createdAt ? new Date(item.createdAt) : new Date(),
      }))
      .filter((item) => item.text);
  } catch {
    return [];
  }
}

function saveInboxMessages(messages) {
  try {
    localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // ignore quota / disabled storage errors
  }
}

// Expose for meal.js (non-module setup)
window.loadFoodList = loadFoodList;
window.saveFoodList = saveFoodList;
window.loadInboxMessages = loadInboxMessages;
window.saveInboxMessages = saveInboxMessages;

