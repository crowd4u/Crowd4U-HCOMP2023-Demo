// this is the main file for the plot report with n4u
// Path: public/hp/report/plot_report_with_n4u.js

const n4u_url = "http://localhost:5001"
const n4u_api_url = n4u_url + "/api/v1"
const papers_dataset_id = "a7af795a-25b6-49d8-a4df-bb8adba77e7a"
const clusters_dataset_id = "f8e368b0-3bd8-4d4f-8248-73dd6dc41e4e"
const description_dataset_id = "b881e485-d4b5-49a9-94e5-c73a37c5f9ff"

function get_data_from_n4u(dataset_id) {
    return fetch(n4u_api_url+"/datasets/"+dataset_id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: '+response.status);
            }
            return response.json();
        });
}

async function plot_report(){
    let html = document.getElementById("report");
    //     insert papers
    let papers_div= document.createElement("div");
    papers_div.appendChild(document.createElement("h2")).innerHTML = "Papers";
    get_data_from_n4u(papers_dataset_id)
        .then(data => {
            let papers = JSON.parse(data)["dataitems"];
            for (let i = 0; i < papers.length; i++) {
                let paper = document.createElement("p");
                paper.innerHTML = papers[i]["content"];
                papers_div.appendChild(paper);
            }
        });
    html.appendChild(papers_div);

//     insert clusters
    let clusters_div = document.createElement("div");
    clusters_div.appendChild(document.createElement("h2")).innerHTML = "Clusters";
    get_data_from_n4u(clusters_dataset_id)
        .then(data => {
            let clusters = JSON.parse(data)["dataitems"];
            for (let i = 0; i < clusters.length; i++) {
                let cluster = document.createElement("p");
                cluster.innerHTML = clusters[i]["content"];
                clusters_div.appendChild(cluster);
            }
        });
    html.appendChild(clusters_div);
//     insert description
    let description_div = document.createElement("div");
    description_div.appendChild(document.createElement("h2")).innerHTML = "Description";
    get_data_from_n4u(description_dataset_id)
        .then(data => {
            let description = JSON.parse(data)["dataitems"];
            for (let i = 0; i < description.length; i++) {
                let desc = document.createElement("p");
                desc.innerHTML = description[i]["content"];
                description_div.appendChild(desc);
            }
        });
    html.appendChild(description_div);

    document.getElementById("showReport").style.display = "none"
}
