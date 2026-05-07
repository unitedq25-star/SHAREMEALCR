const MAX_INBOX_MESSAGES = window.APP_CONFIG?.MAX_INBOX_MESSAGES || 100;
const MAX_MESSAGE_LENGTH = window.APP_CONFIG?.MAX_MESSAGE_LENGTH || 280;
const SEND_COOLDOWN_MS = window.APP_CONFIG?.SEND_COOLDOWN_MS || 1500;

let inboxMessages = window.loadInboxMessages?.() ?? [];
let lastMessageSentAt = 0;

function sanitizeMessage(text) {
    return String(text || "")
        .replace(/\s+/g, " ")
        .trim();
}

function escapeHtml(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function containsBlockedWords(text) {
    const words = window.BLOCKED_WORDS || [];
    const normalized = sanitizeMessage(text).toLowerCase();

    return words.some((word) => {
        const cleanWord = sanitizeMessage(word).toLowerCase();
        if (!cleanWord) return false;

        const escaped = cleanWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const pattern = new RegExp(`\\b${escaped}\\b`, "i");
        return pattern.test(normalized);
    });
}

function canSendNow() {
    const now = Date.now();
    return now - lastMessageSentAt >= SEND_COOLDOWN_MS;
}

function persistInbox() {
    window.saveInboxMessages?.(inboxMessages);
}

function renderInbox() {
    const feed = document.getElementById("inboxFeed");
    if (!feed) return;

    if (!Array.isArray(inboxMessages) || inboxMessages.length === 0) {
        feed.innerHTML = "<p class='inbox-empty'>No messages yet.</p>";
        return;
    }

    feed.innerHTML = "";
    inboxMessages.forEach((msg) => {
        const row = document.createElement("div");
        row.className = "inbox-item";

        const createdAt = msg.createdAt instanceof Date
            ? msg.createdAt.toLocaleTimeString()
            : new Date(msg.createdAt).toLocaleTimeString();

        row.innerHTML = `
            <strong>${escapeHtml(msg.sender)}</strong>: ${escapeHtml(msg.text)}
            <div class="inbox-time">${escapeHtml(createdAt)}</div>
        `;
        feed.appendChild(row);
    });

    feed.scrollTop = feed.scrollHeight;
}

function handleSendMessage() {
    const messages = window.APP_MESSAGES || {};
    const senderEl = document.getElementById("senderRole");
    const textEl = document.getElementById("inboxText");
    if (!senderEl || !textEl) return;

    const text = sanitizeMessage(textEl.value);
    if (!text) {
        alert(messages.ENTER_INBOX_MESSAGE || "Please enter a message for inbox!");
        return;
    }

    if (text.length > MAX_MESSAGE_LENGTH) {
        alert(messages.MESSAGE_TOO_LONG || `Message is too long. Max ${MAX_MESSAGE_LENGTH} characters allowed.`);
        return;
    }

    if (!canSendNow()) {
        alert(messages.MESSAGE_SEND_TOO_FAST || "Please wait a moment before sending another message.");
        return;
    }

    if (containsBlockedWords(text)) {
        alert(messages.ABUSIVE_MESSAGE_BLOCKED || "Abusive language is not allowed. Please send a respectful message.");
        return;
    }

    inboxMessages.push({
        id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        sender: senderEl.value,
        text,
        createdAt: new Date(),
    });

    if (inboxMessages.length > MAX_INBOX_MESSAGES) {
        inboxMessages = inboxMessages.slice(-MAX_INBOX_MESSAGES);
    }

    lastMessageSentAt = Date.now();
    persistInbox();
    renderInbox();
    textEl.value = "";
}

function handleInboxEnterSubmit(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handleSendMessage();
    }
}

function initInboxEvents() {
    const textEl = document.getElementById("inboxText");
    if (!textEl) return;
    textEl.addEventListener("keydown", handleInboxEnterSubmit);
}

renderInbox();
initInboxEvents();

window.handleSendMessage = handleSendMessage;
