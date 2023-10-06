// this is the main file for the plot report with n4u
// Path: public/hp/report/plot_report_with_n4u.js

const n4u_url :string = "http://localhost:5000/"
const papers_dataset_id :string = ""
const clusters_dataset_id :string = ""
const description_dataset_id :string = ""

const plot_report_with_n4u = () => {
    // get the data from n4u
    const papers = get_data_from_n4u(papers_dataset_id)
    const clusters = get_data_from_n4u(clusters_dataset_id)
    const description = get_data_from_n4u(description_dataset_id)

    // plot the data
    plot_report(papers, clusters, description)
}

const get_data_from_n4u = (dataset_id :string) => {
    const data = fetch(n4u_url + dataset_id)
//     parse data into dict
    data_json = data.json()
    return data_json
}

const plot_report = (papers :any, clusters :any, description :any) => {
    // create the html
    const html = $document.createElement("html")
    const head = $document.createElement("head")
    const body = $document.createElement("body")
    const title = $document.createElement("title")
    title.innerHTML = "Report"
    head.appendChild(title)
    html.appendChild(head)
    html.appendChild(body)
//     insert papers
    const papers_div = $document.createElement("div")
    papers_div.innerHTML = papers
    body.appendChild(papers_div)
//     insert clusters
    const clusters_div = $document.createElement("div")
    clusters_div.innerHTML = clusters
    body.appendChild(clusters_div)
//     insert description
    const description_div = $document.createElement("div")
    description_div.innerHTML = description
    body.appendChild(description_div)
//     insert html
    $document.body.innerHTML = html
}