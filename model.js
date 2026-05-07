function generateFoodPostId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }
    return `post_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function normalizeText(value) {
    return String(value ?? "").trim();
}

function normalizeNumber(value) {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : NaN;
}

function isValidOption(value, options) {
    if (!Array.isArray(options)) return false;
    return options.includes(value);
}

function validateFoodPostInput(name, area, category, quantity, condition, pickupDeadline) {
    const messages = window.APP_MESSAGES || {};
    const cleanName = normalizeText(name);
    const cleanArea = normalizeText(area);
    const cleanCategory = normalizeText(category);
    const cleanCondition = normalizeText(condition);

    if (!cleanName) {
        return {
            valid: false,
            message: messages.ENTER_FOOD_NAME || "Please enter Food Name!"
        };
    }
    if (!cleanArea) {
        return {
            valid: false,
            message: messages.ENTER_LOCATION || "Please enter Location!"
        };
    }
    if (!cleanCategory || !isValidOption(cleanCategory, window.FOOD_CATEGORIES)) {
        return {
            valid: false,
            message: messages.SELECT_FOOD_TYPE || "Please select Food Type!"
        };
    }
    if (!cleanCondition || !isValidOption(cleanCondition, window.FOOD_CONDITIONS)) {
        return {
            valid: false,
            message: messages.SELECT_FOOD_CONDITION || "Please select food condition!"
        };
    }
    const quantityNumber = normalizeNumber(quantity);
    if (!Number.isFinite(quantityNumber) || quantityNumber <= 0) {
        return {
            valid: false,
            message: messages.ENTER_VALID_QUANTITY || "Please enter a valid quantity (number of people served)!"
        };
    }
    if (!pickupDeadline || !pickupDeadline.trim()) {
        return {
            valid: false,
            message: messages.SELECT_PICKUP_DEADLINE || "Please select pickup deadline!"
        };
    }
    const pickupDate = new Date(pickupDeadline);
    if (!Number.isFinite(pickupDate.getTime()) || pickupDate.getTime() <= Date.now()) {
        return {
            valid: false,
            message: messages.ENTER_VALID_PICKUP_DEADLINE || "Please select a valid future pickup deadline!"
        };
    }
    return { valid: true, message: "" };
}

function createFoodPost(name, area, category, quantity, condition, pickupDeadline) {
    const defaultStatus = window.FOOD_STATUS?.AVAILABLE || "available";
    const quantityNumber = normalizeNumber(quantity);

    return {
        id: generateFoodPostId(),
        name: normalizeText(name),
        area: normalizeText(area),
        category: normalizeText(category),
        quantity: quantityNumber,
        condition: normalizeText(condition),
        pickupDeadline: new Date(pickupDeadline),
        status: defaultStatus,
        postedAt: new Date(),
    };
}

window.validateFoodPostInput = validateFoodPostInput;
window.createFoodPost = createFoodPost;
