fetch('https://spreadsheets.google.com/feeds/list/1X1Sl-Ju4xaL6z6rp7Cua6dOoUKyPfPHbuRCo_-V7jaA/od6/public/values?alt=json').then(response => {
    return response.json();
}).then(data => {
    for(var key in data.feed.entry) {

        if(data.feed.entry.hasOwnProperty(key)) {

            let title = data.feed.entry[key].gsx$title.$t;
            let description = data.feed.entry[key].gsx$desctiption.$t;
            let date = data.feed.entry[key].gsx$date.$t;
            let imageLink = data.feed.entry[key].gsx$imagelink.$t;
            //let icon = data.feed.entry[0].gsx$icon.$t;
            let type = data.feed.entry[key].gsx$type.$t;
            let readMoreLink = data.feed.entry[key].gsx$readmorelink.$t;

            //Create the timeline block here
            let div1 = document.createElement("div");
            div1.className = "cd-timeline__block js-cd-block";

            let div2 = document.createElement("div");
            div2.className = "cd-timeline__img cd-timeline__img--" + type + " js-cd-img";

            let icon = document.createElement("img");
            if(type.localeCompare("IQP_Award")) {
                icon.src = "img/cd-icon-flag.png";
                icon.alt = "Flag";
            } else if (type.localeCompare("Other")) {
                icon.src = "img/cd-icon-star.png";
                icon.alt = "IQP Award";
            } else {
            }

            let div3 = document.createElement("div");
            div3.className = "cd-timeline__content js-cd-content";

            let h2 = document.createElement("h2");
            h2.innerHTML = title;

            let p = document.createElement("p");
            p.innerHTML = description;

            let span = document.createElement("span");
            span.className = "cd-timeline__date";
            span.innerHTML = date;


            let a = document.createElement("a");
            a.href = readMoreLink;
            a.target = "_blank";
            a.className = "cd-timeline__read-more";
            a.innerHTML = "Read More";

            //TODO add image handling functionality
            // let img = document.createElement("img");
            // img.alt = "Flag";
            // img.src = imageLink;

            div2.appendChild(icon);
            // div2.appendChild(img);

            div3.appendChild(h2);
            div3.appendChild(p);
            div3.appendChild(a);
            div3.appendChild(span);


            div1.append(div2);
            div1.append(div3);

            document.getElementsByClassName("cd-timeline__container")[0].appendChild(div1);
        }
    }

}).catch(err => {
    console.log(err);
});




