let foodList = loadInitialFoodList();

function startApp() {
    renderFoodConditionOptions();
    renderFoodTypeOptions();
    setPickupDeadlineMin();
    refreshFoodFeed();
}

function loadInitialFoodList() {
    const existingPosts = window.loadFoodList?.() ?? [];
    if (existingPosts.length > 0) return existingPosts;

    const defaultCategory = window.FOOD_CATEGORIES?.[1] || window.FOOD_CATEGORIES?.[0] || "Restaurant";
    const defaultCondition = window.FOOD_CONDITIONS?.[0] || "Fresh";
    const defaultStatus = window.FOOD_STATUS?.AVAILABLE || "available";
    const defaultDeadline = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const starterPost = {
        id: "starter_post_1",
        name: "Fresh Naan",
        area: "Commercial Market",
        category: defaultCategory,
        quantity: 4,
        condition: defaultCondition,
        pickupDeadline: defaultDeadline,
        status: defaultStatus,
        postedAt: new Date(),
    };

    window.saveFoodList?.([starterPost]);
    return [starterPost];
}

function getFoodFormElements() {
    return {
        nameInput: document.getElementById("foodName"),
        areaInput: document.getElementById("location"),
        typeInput: document.getElementById("foodType"),
        quantityInput: document.getElementById("quantity"),
        conditionInput: document.getElementById("foodCondition"),
        pickupDeadlineInput: document.getElementById("pickupDeadline"),
    };
}

function handleAddFood() {
    const messages = window.APP_MESSAGES || {};
    const {
        nameInput,
        areaInput,
        typeInput,
        quantityInput,
        conditionInput,
        pickupDeadlineInput,
    } = getFoodFormElements();

    if (!nameInput || !areaInput || !typeInput || !quantityInput || !conditionInput || !pickupDeadlineInput) {
        alert(messages.REQUIRED_FIELDS || "Please fill all required fields!");
        return;
    }

    const validation = window.validateFoodPostInput?.(
        nameInput.value,
        areaInput.value,
        typeInput.value,
        quantityInput.value,
        conditionInput.value,
        pickupDeadlineInput.value
    );

    if (!validation?.valid) {
        alert(validation?.message || messages.REQUIRED_FIELDS || "Please fill all required fields!");
        return;
    }

    const newEntry = window.createFoodPost?.(
        nameInput.value,
        areaInput.value,
        typeInput.value,
        quantityInput.value,
        conditionInput.value,
        pickupDeadlineInput.value
    );

    if (!newEntry) {
        alert(messages.CREATE_POST_FAILED || "Unable to create post. Please try again.");
        return;
    }

    foodList.unshift(newEntry);
    window.saveFoodList?.(foodList);
    refreshFoodFeed();
    clearFoodForm();
}

function clearFoodForm() {
    const { nameInput, areaInput, typeInput, quantityInput, conditionInput, pickupDeadlineInput } = getFoodFormElements();
    if (nameInput) nameInput.value = "";
    if (areaInput) areaInput.value = "";
    if (typeInput) typeInput.value = "";
    if (quantityInput) quantityInput.value = "";
    if (conditionInput) conditionInput.value = "";
    if (pickupDeadlineInput) pickupDeadlineInput.value = "";
}

function refreshFoodFeed() {
    window.renderFoodFeed?.(foodList);
}

function renderFoodTypeOptions() {
    const select = document.getElementById("foodType");
    const categories = window.FOOD_CATEGORIES;
    if (!select || !Array.isArray(categories) || categories.length === 0) return;

    select.innerHTML = '<option value="">Select food category</option>';
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

function renderFoodConditionOptions() {
    const select = document.getElementById("foodCondition");
    const conditions = window.FOOD_CONDITIONS;
    if (!select || !Array.isArray(conditions) || conditions.length === 0) return;

    select.innerHTML = '<option value="">Select food condition</option>';
    conditions.forEach((condition) => {
        const option = document.createElement("option");
        option.value = condition;
        option.textContent = condition;
        select.appendChild(option);
    });
}

function setPickupDeadlineMin() {
    const pickupDeadlineInput = document.getElementById("pickupDeadline");
    if (!pickupDeadlineInput) return;

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    pickupDeadlineInput.min = now.toISOString().slice(0, 16);
}

startApp();
window.handleAddFood = handleAddFood;
