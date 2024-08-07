let dataCache = null;

function fetchData() {
  if (dataCache) {
    return Promise.resolve(dataCache);
  }
  return fetch("/data.json")
    .then((response) => response.json())
    .then((data) => {
      dataCache = data;
      return data;
    });
}

const previousTime = {
  daily: "Yesterday",
  weekly: "Last Week",
  monthly: "Last Month",
};

let chosenTimeFrame = "weekly"; // Set default time frame

// Function to update cards with the given time frame
function updateCards(timeFrame) {
  fetchData()
    .then((data) => {
      // Transform the data into an object with titles as keys
      const results = data.reduce((acc, item) => {
        const { title, timeframes } = item;
        acc[title.toLocaleLowerCase()] = {
          timeFrameData: timeframes[timeFrame],
        };
        return acc;
      }, {});

      console.log(results);

      const cards = document.querySelectorAll(".card__bg"); // gets all the activity cards
      cards.forEach((card) => {
        const cardId = card.id.replace(/-/g, " ");
        const cardData = results[cardId.toLowerCase()]; // Ensure the cardId is in lowercase

        if (cardData) {
          const cardCurrent = card.querySelector(".card__content__current");
          const cardPrevious = card.querySelector(".card__content__previous");
          if (cardCurrent) {
            cardCurrent.textContent = cardData.timeFrameData.current + "hrs";
          }
          if (cardPrevious) {
            cardPrevious.textContent =
              previousTime[timeFrame] +
              " - " +
              cardData.timeFrameData.previous +
              "hrs";
          }
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// Event listeners for time frame selection
const elements = document.querySelectorAll(".choose_time");
elements.forEach((element) => {
  element.addEventListener("click", function () {
    chosenTimeFrame = this.textContent.trim().toLowerCase(); // Update the variable with the text content of the clicked element
    updateCards(chosenTimeFrame);

    elements.forEach((el) => {
      el.classList.remove("header__nav__list__active");
      el.classList.add("header__nav__list__inactive");
    });

    element.classList.remove("header__nav__list__inactive");
    element.classList.add("header__nav__list__active");
  });
});

// Set initial state on page load
updateCards(chosenTimeFrame);
