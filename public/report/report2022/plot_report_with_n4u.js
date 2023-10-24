// this is the main file for the plot report2022 with n4u
// Path: public/hp/report2022/plot_report_with_n4u.js

const n4u_url = "https://next.crowd4u.org"
const n4u_api_url = n4u_url + "/api/v1"
const papers_dataset_id = "b9933a81-717e-40d6-823f-b54602ccf651"
const clusters_dataset_id = "0bbe7341-4bab-4b11-beae-565a2758e68c"
const description_dataset_id = "be9fc012-90bd-462e-a60a-e756d5a55fb2"

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
    //     insert papers
    let papers = [];
    get_data_from_n4u(papers_dataset_id)
        .then(data => {
            let papers_json = JSON.parse(data)["dataitems"];
            for (let i = 0; i < papers_json.length; i++) {
                papers.push(papers_json[i]["content"]);
            }
        });
    console.log("papers (length:", papers.length, ")", papers);

//     insert clusters
    let clusters = [];
    get_data_from_n4u(clusters_dataset_id)
        .then(data => {
            let clusters_json = JSON.parse(data)["dataitems"];
            for (let i = 0; i < clusters_json.length; i++) {
                clusters.push(clusters_json[i]["content"]);
            }
        });
    console.log("clusters (length:", clusters.length, ")" ,clusters);
//     insert description
    let descriptions = []
    get_data_from_n4u(description_dataset_id)
        .then(data => {
            let desc = JSON.parse(data)["dataitems"];
            for (let i = 0; i < desc.length; i++) {
                let desc = document.createElement("p");
                descriptions.push(desc);
            }
        });
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
        let cluster = document.createElement("div", {className: "cluster"});
        let cluster_name = clusters[i][0];
        let desc = descriptions[i][1];
        let papers_id_in_cluster = clusters[i];
        let cluster_name_tag = document.createElement("h2");
        cluster_name_tag.innerText = cluster_name;
        cluster.appendChild(cluster_name_tag);
        let cluster_desc = document.createElement("p", {className: "cluster-description"});
        cluster_desc.innerText = desc;
        cluster.appendChild(cluster_desc);

        let papers = document.createElement("div", {className: "papes"});
        for (let j = 0; j < papers_id_in_cluster.length; j++) {
            if (j === papers[1]) {
                let paper = document.createElement("div", {className: "paper"});
                let paper_title = document.createElement("span", {className: "paper-title"});
                let title = papers[1];
                let doi = papers[4];
                // title with a link to doi
                let title_link = document.createElement("a", {href: doi});
                title_link.innerText = title;
                paper_title.appendChild(title_link);
                paper.appendChild(paper_title);

                let paper_author = document.createElement("span", {className: "paper-author"});
                paper_author.innerText = papers[2];
                paper.appendChild(paper_author);

                papers.appendChild(paper);
            }
        }
        cluster.appendChild(papers);
        console.log("cluster", cluster, "papers", papers);
        html.appendChild(cluster);
    }

    document.getElementById("showReport").style.display = "none"
}
