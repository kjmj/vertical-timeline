fetch('https://spreadsheets.google.com/feeds/list/1X1Sl-Ju4xaL6z6rp7Cua6dOoUKyPfPHbuRCo_-V7jaA/od6/public/values?alt=json').then(response => {
  return response.json();
}).then(json => {
  let data = json.feed.entry;
  // \// Listen for user to change filter/sort selection, then construct the timeline
  document.getElementById("my-filter").onchange = function() {
    let filteredAndSorted = filterAndSort(data);
    document.getElementsByClassName("cd-timeline__container")[0].innerHTML = "";
    constructTimeline(filteredAndSorted);
  };

  document.getElementById("my-year").onchange = function() {
    let filteredAndSorted = filterAndSort(data);

    document.getElementsByClassName("cd-timeline__container")[0].innerHTML = "";
    constructTimeline(filteredAndSorted);
  };

  document.getElementById("my-sort").onchange = function() {
    let filteredAndSorted = filterAndSort(data);

    document.getElementsByClassName("cd-timeline__container")[0].innerHTML = "";
    constructTimeline(filteredAndSorted);
  };

  document.getElementsByClassName("cd-timeline__container")[0].innerHTML = "";
  constructTimeline(filterAndSort(data));

}).catch(err => {
  console.log(err);
});

/**
 * Construct the timeline from the data passed in
 * @param data A JSON string containing the data used for the timeline
 */
function constructTimeline(data) {
  // Process data
  for(key in data) {

    if(data.hasOwnProperty(key)) {

      // Icon
      let category = data[key].gsx$category.$t;
      let iconElement = document.createElement("img");
      if(category === "IQP_Award") {
        iconElement.src = "img/cd-icon-star.png";
      } else if (category === "Milestone") {
        iconElement.src = "img/cd-icon-towers.png";
      } else if (category === "Publication") {
        iconElement.src = "img/cd-icon-publication.png";
      } else if (category === "Application") {
        iconElement.src = "img/cd-icon-application.png";
      }

      // Title
      let title = data[key].gsx$title.$t;
      let titleElement = document.createElement("h2");
      titleElement.innerHTML = title;

      // Description
      let description = data[key].gsx$description.$t;
      let descriptionElement = document.createElement("p");
      descriptionElement.innerHTML = description;

      // Date
      let date = data[key].gsx$date.$t;
      let dateElement = document.createElement("span");
      dateElement.className = "cd-timeline__date";
      dateElement.innerHTML = date;

      // Read More button
      let readMoreLink = data[key].gsx$readmorelink.$t;
      let readMoreElement = document.createElement("a");
      readMoreElement.href= readMoreLink;
      readMoreElement.target = "_blank";
      readMoreElement.className = "cd-timeline__read-more";
      readMoreElement.innerHTML = "Read More";

      // Youtube Video
      let youtubeLink = data[key].gsx$youtubelink.$t;
      let youtubeElement = document.createElement("iframe");
      youtubeElement.src = youtubeLink;
      youtubeElement.allowFullscreen = true;

      // Image
      let imageLink = data[key].gsx$imagelink.$t;
      let imageElement = document.createElement("img");
      imageElement.src = imageLink;

      // Create elements for the timeline block
      let div1 = document.createElement("div");
      div1.className = "cd-timeline__block js-cd-block";

      let div2 = document.createElement("div");
      div2.className = "cd-timeline__img cd-timeline__img--" + category + " js-cd-img";

      let div3 = document.createElement("div");
      div3.className = "cd-timeline__content js-cd-content";

      // Construct the timeline block
      div2.appendChild(iconElement);
      div3.appendChild(titleElement);

      if(imageLink !== '') {
        div3.appendChild(imageElement);
      }

      if(youtubeLink !== '') {
        div3.appendChild(youtubeElement);
      }

      div3.appendChild(descriptionElement);

      if(readMoreLink !== '') {
        div3.appendChild(readMoreElement);
      }

      div3.appendChild(dateElement);

      div1.append(div2);
      div1.append(div3);

      document.getElementsByClassName("cd-timeline__container")[0].appendChild(div1);
    }
  }
}

/**
 * Filter data by the field specified
 * @param data
 * @param filterBy The field to filter by
 * @returns {*}
 */
function filterData(data, filterBy) {
  if (filterBy.length == 0){
    filterBy[0] === "All";
  }
  if(filterBy[0] === "All") {
    return data;
  } else{
    
    return data.filter(x => filterBy.includes(x.gsx$category.$t) );
  }
}

/**
 * Sort the data according to the specified method
 * @param data
 * @param method The method to sort the data by
 * @returns {*}
 */
function sortData(data, method) {
  if(method === "Old to New") {
    data.sort(function (a, b) {
      return a.gsx$date.$t.localeCompare(b.gsx$date.$t);
    });
  } else if (method === "New to Old") {
    data.sort(function (a, b) {
      return b.gsx$date.$t.localeCompare(a.gsx$date.$t);
    });
  };

  return data;
}

function sortYears(data, year){
  if (year.length == 0){
    year[0] === "All Time";
  }
  if(year[0] === "All Time") {
    return data;
  } else{
    console.log("YEAR", year)
    return data.filter(x => year.includes(x.gsx$date.$t));
  }
}

/**
 * Get the categories of items in the timeline data
 * @param data
 * @returns {Array}
 */
function getCategories(data) {
  let categories = [];

  for(key in data) {
    if (data.hasOwnProperty(key)) {
      let category = data[key].gsx$category.$t;

      if(!categories.includes(category)) {
        categories.push(category);
      }
    }
  }

  return categories;
}

/**
 * Filter and sort the data
 * @param data
 */
function filterAndSort(data) {
  var filterBy = $('#my-filter').val();
  var sortBy = document.getElementById("my-sort").value;
  var years = $('#my-year').val();
  filteredData = filterData(data, filterBy);
  sortedYearData = sortYears(filteredData, years);
  sortedData = sortData(sortedYearData, sortBy);
  //sortedData = sortData(filteredData, sortBy);
  return sortedData;
}
