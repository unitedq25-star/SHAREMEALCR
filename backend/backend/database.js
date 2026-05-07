const posts = [];
const messages = [];

function listPosts() {
  return posts;
}

function createPost(payload) {
  const newPost = {
    id: `post_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: String(payload.name).trim(),
    area: String(payload.area).trim(),
    category: String(payload.category).trim(),
    quantity: Number(payload.quantity),
    condition: String(payload.condition).trim(),
    pickupDeadline: new Date(payload.pickupDeadline).toISOString(),
    status: "available",
    createdAt: new Date().toISOString(),
  };

  posts.unshift(newPost);
  return newPost;
}

function listMessages() {
  return messages;
}

function createMessage(payload) {
  const newMessage = {
    id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    sender: String(payload.sender || "Anonymous").trim(),
    text: String(payload.text).trim(),
    createdAt: new Date().toISOString(),
  };

  messages.push(newMessage);
  if (messages.length > 200) {
    messages.shift();
  }

  return newMessage;
}

module.exports = {
  listPosts,
  createPost,
  listMessages,
  createMessage,
};
