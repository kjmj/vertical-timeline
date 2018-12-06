fetch('https://spreadsheets.google.com/feeds/list/1X1Sl-Ju4xaL6z6rp7Cua6dOoUKyPfPHbuRCo_-V7jaA/od6/public/values?alt=json').then(response => {
    return response.json();
}).then(json => {
    let data = json.feed.entry;
    let filteredData = [];
    let sortedData = [];

    // Dropdown menus
    let sortDropdown = createSortDropdown();
    document.getElementById("dropdown").append(sortDropdown);

    let filterDropdown = createFilterDropdown(getProjectTypes(data));
    document.getElementById("dropdown").append(filterDropdown);

    document.getElementById("filterDropdown").onchange = function() {
        // var index = this.selectedIndex;
        // var inputText = this.children[index].innerHTML.trim();

        let value = this.value;
        let sortValue = document.getElementById("sortDropdown").value;

        filteredData = filterData(data, value);
        sortedData = sortData(filteredData, sortValue);
        document.getElementsByClassName("cd-timeline__container")[0].innerHTML = "";
        // document.getElementsByClassName("cd-timeline__container")[0].appendChild(sortDropdown);
        // document.getElementsByClassName("cd-timeline__container")[0].appendChild(filterDropdown);

        constructPage(filteredData);
    };

    document.getElementById("sortDropdown").onchange = function() {
        // var index = this.selectedIndex;
        // var inputText = this.children[index].innerHTML.trim();

        let value = this.value;
        let filterValue = document.getElementById("filterDropdown").value;

        filteredData = filterData(data, filterValue);
        sortedData = sortData(filteredData, value);
        document.getElementsByClassName("cd-timeline__container")[0].innerHTML = "";
        // document.getElementsByClassName("cd-timeline__container")[0].appendChild(sortDropdown);
        // document.getElementsByClassName("cd-timeline__container")[0].appendChild(filterDropdown);

        constructPage(sortedData);
    };

}).catch(err => {
    console.log(err);
});

function createSortDropdown() {
    let dropdown = document.createElement("select");
    dropdown.id = "sortDropdown";

    let defaultOption = document.createElement("option");
    defaultOption.selected = "selected";
    defaultOption.disabled = "disabled";
    defaultOption.innerHTML = "--- Sort By ---";

    let option1 = document.createElement("option");
    option1.value = "A to Z";
    option1.text = "A to Z";

    let option2 = document.createElement("option");
    option2.value = "Z to A";
    option2.text = "Z to A";

    let option3 = document.createElement("option");
    option3.value = "Old to New";
    option3.text = "Old to New";

    let option4 = document.createElement("option");
    option4.value = "New to Old";
    option4.text = "New to Old";

    dropdown.options.add(defaultOption);
    dropdown.options.add(option1);
    dropdown.options.add(option2);
    dropdown.options.add(option3);
    dropdown.options.add(option4);

    return dropdown;
}

/**
 *
 * @param filterItems An array of strings containing the items the user can filter by
 * @returns {HTMLElement}
 */
function createFilterDropdown(filterItems) {
    let dropdown = document.createElement("select");
    // dropdown.selectionDisabled = "--- Filter By ---";
    dropdown.id = "filterDropdown";

    let defaultOption = document.createElement("option");
    defaultOption.selected = "selected";
    defaultOption.disabled = "disabled";
    defaultOption.innerHTML = "--- Filter By ---";
    dropdown.add(defaultOption);

    let option = document.createElement("option");
    option.value = "All";
    option.textContent = "All";
    dropdown.options.add(option);

    for(item in filterItems) {
        let option = document.createElement("option");
        option.value = filterItems[item];
        option.textContent = filterItems[item];
        dropdown.options.add(option);
    }

    return dropdown;
}

function sortData(data, method) {

    if(method == "Old to New") {
        data.sort(function (a, b) {
            return a.gsx$date.$t.localeCompare(b.gsx$date.$t);
        });
    } else if (method == "New to Old") {
        data.sort(function (a, b) {
            return b.gsx$date.$t.localeCompare(a.gsx$date.$t);
        });
    } else if (method == "A to Z") {
        data.sort(function (a, b) {
            return a.gsx$title.$t.localeCompare(b.gsx$title.$t);
        });
    } else if (method == "Z to A") {
        data.sort(function (a, b) {
            return b.gsx$title.$t.localeCompare(a.gsx$title.$t);
        });
    }

    return data;
}

function constructPage(data) {
    // Process data
    for(var key in data) {

        if(data.hasOwnProperty(key)) {
            // Icon
            let icon = document.createElement("img");
            let type = data[key].gsx$type.$t;
            if(type == "IQP_Award") {
                icon.src = "img/cd-icon-star.png";
            } else if (type == "Other") {
                icon.src = "img/cd-icon-towers.png";
            } else if (type == "Publication") {
                icon.src = "img/cd-icon-pub.png";
            }else if (type == "Application") {
                icon.src = "img/cd-icon-application.png";
            }

            // Title
            let title = data[key].gsx$title.$t;
            let h2 = document.createElement("h2");
            h2.innerHTML = title;

            // Description
            let description = data[key].gsx$desctiption.$t;
            let p = document.createElement("p");
            p.innerHTML = description;
            p.id = key;

            if(title === "The Pioneer Team Project") {
                console.log(description);
            }

            // Date
            let date = data[key].gsx$date.$t;
            let span = document.createElement("span");
            span.className = "cd-timeline__date";
            span.innerHTML = date;

            // Read More button
            let readMoreLink = data[key].gsx$readmorelink.$t;
            let a = document.createElement("a");
            a.href= readMoreLink;
            a.target = "_blank";
            a.className = "cd-timeline__read-more";
            a.innerHTML = "Read More";

            // Youtube Video
            let youtubeLink = data[key].gsx$youtubelink.$t;
            let iframe = document.createElement("iframe");
            iframe.src = youtubeLink;
            iframe.allowFullscreen = true;

            // Image
            let imageLink = data[key].gsx$imagelink.$t;
            let img = document.createElement("img");
            img.src = imageLink;

            // Show/Hide Button
            // let button = document.createElement("button");
            // button.innerHTML = "Show/Hide";
            // button.onclick = showAndHideBlock(p.id);

            // Create elements for the timeline block
            let div1 = document.createElement("div");
            div1.className = "cd-timeline__block js-cd-block";

            let div2 = document.createElement("div");
            div2.className = "cd-timeline__img cd-timeline__img--" + type + " js-cd-img";

            let div3 = document.createElement("div");
            div3.className = "cd-timeline__content js-cd-content";

            // Construct the timeline block
            div2.appendChild(icon);

            div3.appendChild(h2);
            // div3.appendChild(button);
            if(img.src !== '') {
                div3.appendChild(img);
            }
            if(youtubeLink !== '') {
                div3.appendChild(iframe);
            }
            div3.appendChild(p);
            if(readMoreLink !== '') {
                div3.appendChild(a);
            }
            div3.appendChild(span);

            div1.append(div2);
            div1.append(div3);

            document.getElementsByClassName("cd-timeline__container")[0].appendChild(div1);
        }
    }
}

function filterData(data, filterBy) {
    if(filterBy == "All") {
        return data;
    } else{
        let filtered = data.filter(x => x.gsx$type.$t === filterBy);
        return filtered;
    }
}

function getProjectTypes(data) {
    let types = [];
    for(var key in data) {
        if (data.hasOwnProperty(key)) {
            let type = data[key].gsx$type.$t;
            if(!types.includes(type)) {
                types.push(type);
            }
        }
    }
    return types;
}
