function escapeHtml(text) {
    return String(text ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatDateTime(value) {
    if (!value) return "N/A";
    const date = value instanceof Date ? value : new Date(value);
    return Number.isFinite(date.getTime()) ? date.toLocaleString() : "N/A";
}

function renderFoodCard(item) {
    const status = item?.status || "available";
    const safeName = escapeHtml(item?.name || "Untitled meal");
    const safeCategory = escapeHtml(item?.category || "N/A");
    const safeArea = escapeHtml(item?.area || "N/A");
    const safeCondition = escapeHtml(item?.condition || "N/A");
    const safeQuantity = Number.isFinite(Number(item?.quantity)) ? Number(item.quantity) : "N/A";
    const postedAt = formatDateTime(item?.postedAt);
    const deadline = formatDateTime(item?.pickupDeadline);

    return `
        <div class="food-item">
            <strong>${safeName}</strong> - <small>${safeCategory}</small><br>
            Location: ${safeArea}<br>
            Serves: ${safeQuantity} people<br>
            Condition: ${safeCondition}<br>
            Pickup by: ${deadline}<br>
            Status: <strong>${escapeHtml(status)}</strong><br>
            <span class="expiry-text">Added at: ${postedAt}</span>
        </div>
    `;
}

function renderFoodFeed(foodList) {
    const feed = document.getElementById("foodFeed");
    if (!feed) return;

    const items = Array.isArray(foodList) ? foodList : [];
    if (items.length === 0) {
        feed.innerHTML = `
            <h3>Live Feed</h3>
            <p>No meal posts yet. Be the first one to donate.</p>
        `;
        return;
    }

    const cardsHtml = items.map((item) => renderFoodCard(item)).join("");
    feed.innerHTML = `<h3>Live Feed</h3>${cardsHtml}`;
}

window.renderFoodFeed = renderFoodFeed;
