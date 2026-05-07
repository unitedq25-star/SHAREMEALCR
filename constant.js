const FOOD_STATUS = {
    AVAILABLE: "available",
    RESERVED: "reserved",
    COLLECTED: "collected",
    EXPIRED: "expired",
};

const FOOD_CATEGORIES = [
    "Home Made",
    "Restaurant",
    "Packaged",
];

const FOOD_CONDITIONS = [
    "Fresh",
    "Good",
    "Needs quick pickup",
];

const APP_MESSAGES = {
    REQUIRED_FIELDS: "Please fill all required fields!",
    CREATE_POST_FAILED: "Unable to create post. Please try again.",
    ENTER_FOOD_NAME: "Please enter Food Name!",
    ENTER_LOCATION: "Please enter Location!",
    SELECT_FOOD_TYPE: "Please select Food Type!",
    ENTER_VALID_QUANTITY: "Please enter a valid quantity (number of people served)!",
    SELECT_FOOD_CONDITION: "Please select food condition!",
    SELECT_PICKUP_DEADLINE: "Please select pickup deadline!",
    ENTER_VALID_PICKUP_DEADLINE: "Please select a valid future pickup deadline!",
    ENTER_INBOX_MESSAGE: "Please enter a message for inbox!",
    ABUSIVE_MESSAGE_BLOCKED: "Abusive language is not allowed. Please send a respectful message.",
    MESSAGE_TOO_LONG: "Message is too long. Max 280 characters allowed.",
    MESSAGE_SEND_TOO_FAST: "Please wait a moment before sending another message.",
};

const BLOCKED_WORDS = [
    "idiot",
    "stupid",
    "hate",
    "haramzada",
    "kutta",
    "kamina",
    "loser",
    "gadha",
    "pagal",
    "Fuck",
    "ass",
];

const APP_CONFIG = {
    MAX_INBOX_MESSAGES: 100,
    MAX_MESSAGE_LENGTH: 280,
    SEND_COOLDOWN_MS: 1500,
};

window.FOOD_STATUS = FOOD_STATUS;
window.FOOD_CATEGORIES = FOOD_CATEGORIES;
window.FOOD_CONDITIONS = FOOD_CONDITIONS;
window.APP_MESSAGES = APP_MESSAGES;
window.BLOCKED_WORDS = BLOCKED_WORDS;
window.APP_CONFIG = APP_CONFIG;
