// this is the main file for the plot report2022 with n4u
// Path: public/hp/report2022/plot_report_with_n4u.js

const n4u_url = "https://next.crowd4u.org"
const n4u_api_url = n4u_url + "/api/v1"
const papers_dataset_id = "2c497f4f-e941-42ba-b029-7fd6111be420";
const clusters_dataset_id = "30e46615-23f9-4815-8f68-5562f881faab";
const description_dataset_id = "5934fe62-de7a-49c9-a21e-6a10774769f3";

async function get_data_from_n4u(dataset_id) {
    return await fetch(n4u_api_url+"/datasets/"+dataset_id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: '+response.status);
            }
            return response.json();
        });
}

async function plot_report(){
    let html = document.getElementById("report");
    // remove all children
    while (html.firstChild) {
        html.removeChild(html.firstChild);
    }

    //     insert papers
    let papers = [];
    let papers_raw = await get_data_from_n4u(papers_dataset_id)
    let papers_json = JSON.parse(papers_raw)["dataitems"];
    for (let i = 0; i < papers_json.length; i++) {
        papers.push(papers_json[i]["content"]);
    }
    console.log("papers (length:", papers.length, ")", papers);

//     insert clusters
    let clusters = [];
    let raw_cluster = await get_data_from_n4u(clusters_dataset_id)
    let clusters_json = JSON.parse(raw_cluster)["dataitems"];
    for (let i = 0; i < clusters_json.length; i++) {
        clusters.push(clusters_json[i]["content"]);
    }
    console.log("clusters (length:", clusters.length, ")" ,clusters);
//     insert description
    let descriptions = [];
    let raw_desc = await get_data_from_n4u(description_dataset_id);
    let desc_json = JSON.parse(raw_desc)["dataitems"];
    for (let i = 0; i < desc_json.length; i++) {
        let desc = desc_json[i]["content"];
        descriptions.push(desc);
    }
    console.log("descriptions (length:", descriptions.length, ")", descriptions);

    // compose html like below
    /**
    <h1>Cluster Visualization</h1>
    <div className="cluster-container">
        <div className="cluster">
            <h2>Cluster 'foo'</h2>
            <p className="cluster-description">The cluster 'cluster[0]' at HCOMP2022 focuses on various topics related to human computation and crowdsourcing. The papers within this cluster address different aspects of these fields, such as bias mitigation strategies in algorithmic models, the inclusion of sign language as an input modality in microtask crowdsourcing, the human-centric perspective on model monitoring, the use of gestures as an alternative input modality in microtask crowdsourcing, and the performance comparison between paid and volunteer image labeling in citizen science projects. Collectively, these papers highlight the importance of considering bias, inclusivity, human-centeredness, and the potential health benefits in the design and deployment of human computation and crowdsourcing systems.</p>
            <div className="papers">
                <div className="paper">
                    <span className="paper-title">Paper 11:</span> When More Data Lead Us Astray: Active Data Acquisition in the Presence of Label Bias
                </div>
                <!-- Include other papers in this cluster -->
            </div>
        </div>
        <div className="cluster">
            <h2>Cluster 'hoge'</h2>
            <p className="cluster-description">The 'hoge' cluster at HCOMP2022 focuses on various aspects of human-computer interaction and collaboration. The cluster includes papers on topics such as decision-making assistance using machine learning algorithms, concept-level explanations in artificial intelligence, algorithmic explanations in legal decision-making, strategyproofing peer assessment, eliciting soft labels for machine learning, and optimizing reviewer assignments in paper reviewing and conference experiments. These papers explore different challenges and opportunities in improving human-algorithm collaborations, providing insights into designing more effective and fair human-computer systems.</p>
            <div className="papers">
                <!-- Include papers in this cluster -->
            </div>
        </div>
    </div>
     **/
    for (let i = 0; i < clusters.length; i++) {
        let cluster = document.createElement("div");
        cluster.className = "cluster-container";
        let cluster_name = clusters[i][0];
        // slice of clusters from 1 to end is cluster_paper_id_list
        let cluster_paper_id_list = clusters[i].slice(1);
        // find description which has the same cluster name
        let desc = "";
        for (let j = 0; j < descriptions.length; j++) {
            if (descriptions[j][0] === cluster_name) {
                desc = descriptions[j][1];
                break;
            }
        }

        let cluster_name_tag = document.createElement("h2", {className: "cluster-name"});
        cluster_name_tag.innerText = cluster_name;
        cluster.appendChild(cluster_name_tag);
        let cluster_desc = document.createElement("p");
        cluster_desc.className = "cluster-description";
        cluster_desc.innerText = desc;
        cluster.appendChild(cluster_desc);
        let papers_container = document.createElement("div");
        papers_container.className = "papers";
        let papers_html = document.createElement("ul");
        papers_html.className = "references";
        for (let j = 0; j < cluster_paper_id_list.length; j++) {
            let paper_id = cluster_paper_id_list[j];
            for (let k = 0; k < papers.length; k++) {
                if (paper_id === papers[k][0]) {
                    let paper = document.createElement("div");
                    paper.className = "paper";
                    let paper_title = document.createElement("li");
                    paper_title.className = "paper-title";
                    let title = papers[k][1];
                    let doi = papers[k][4];
                    // title with a link to doi
                    let title_link = document.createElement("a");
                    title_link.innerText = title;
                    title_link.href = doi;
                    paper_title.appendChild(title_link);
                    paper.appendChild(paper_title);

                    papers_html.appendChild(paper);
                }
            }
        }
        papers_html.style.display = "none";
        let switcher = document.createElement("p");
        switcher.innerText = "Papers";
        switcher.className = "toggle-button";
        switcher.addEventListener('click', () => {
            papers_html.style.display = papers_html.style.display === 'block' ? 'none' : 'block';
        });
        papers_container.appendChild(switcher);
        papers_container.appendChild(papers_html);
        cluster.appendChild(papers_container);
        console.log("cluster", cluster, "papers", papers);
        html.appendChild(cluster);
    }

}
