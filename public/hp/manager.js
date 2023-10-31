let virtual_cookie = {};

function setCookie(name, value) {
    virtual_cookie[name] = value;
}

function getCookie(name) {
    return virtual_cookie[name];
}

function updateWorkflowId() {
    const workflowId = document.getElementById('workflowId').value;
    setCookie('workflow_id', workflowId);  // Set the cookie named 'workflow_id' with the input value
    // alert('Workflow ID updated!');
}

function updateResultDatasetId() {
    const resultDatasetId = document.getElementById('resultDatasetId').value;
    setCookie('result_dataset_id', resultDatasetId);  // Set the cookie named 'result_dataset_id' with the input value
    // alert('Result Dataset ID updated!');
}

function updateLLMResultDatasetId() {
    const resultDatasetId = document.getElementById('LLMResultDatasetId').value;
    setCookie('llm_dataset_id', resultDatasetId);  // Set the cookie named 'result_dataset_id' with the input value
    // alert('LLM Result Dataset ID updated!');
}

function updateSourceDatasetId() {
    const sourceDatasetId = document.getElementById('sourceDatasetId').value;
    setCookie('source_dataset_id', sourceDatasetId);  // Set the cookie named 'source_dataset_id' with the input value
    // alert('Source Dataset ID updated!');
}

function updateUseDummy() {
    let useDummy = document.getElementById('useDummy').value;
    let dummyFlag = useDummy !== undefined;
    setCookie('use_dummy', dummyFlag);  // Set the cookie named 'use_dummy' with the input value
    // alert('Use Dummy updated!');
}

function updateHumanDatasetId() {
    const humanDatasetId = document.getElementById('humanDatasetId').value;
    setCookie('human_dataset_id', humanDatasetId);  // Set the cookie named 'human_dataset_id' with the input value
    // alert('Human Dataset ID updated!');
}

function updateN4UURL() {
    const n4uURL = document.getElementById('n4uURL').value;
    setCookie('n4u_url', n4uURL);  // Set the cookie named 'n4u_url' with the input value
    // alert('N4U URL updated!');
}

function updateParamsByJSON() {
    const params = document.getElementById('paramsJSONArea').value;
//     load each params above from json params.
    const paramsJSON = JSON.parse(params);
//     set each params to cookie. if undefined, ignore.

    if (paramsJSON['workflow_id'] !== undefined) {
        setCookie('workflow_id', paramsJSON['workflow_id']);
        document.getElementById('workflowId').value = paramsJSON['workflow_id'];
    }
    if (paramsJSON['final_dataset_id'] !== undefined) {
        setCookie('result_dataset_id', paramsJSON['final_dataset_id']);
        document.getElementById('resultDatasetId').value = paramsJSON['final_dataset_id'];
    }
    if (paramsJSON['llm_dataset_id'] !== undefined) {
        setCookie('llm_dataset_id', paramsJSON['llm_dataset_id']);
        document.getElementById('LLMResultDatasetId').value = paramsJSON['llm_dataset_id'];
    }
    if (paramsJSON['source_dataset_id'] !== undefined) {
        setCookie('source_dataset_id', paramsJSON['source_dataset_id']);
        document.getElementById('sourceDatasetId').value = paramsJSON['source_dataset_id'];
    }
    if (paramsJSON['human_dataset_id'] !== undefined) {
        setCookie('human_dataset_id', paramsJSON['human_dataset_id']);
        document.getElementById('humanDatasetId').value = paramsJSON['human_dataset_id'];
    }
    alert('Params updated!');
}


function showHiddenItem() {
    // set iframe src
    let iframe = document.getElementsByTagName('iframe')[0];

    const n4u_url = getCookie("n4u_url");

    let wf_id = getCookie("workflow_id")
    iframe.src = n4u_url+ "runs/wf/"+wf_id+"/run";

    // When submit button is clicked, show the hidden div
    let hiddenItem = document.getElementById('n4u_task');
    hiddenItem.style.display = 'block';

    let target_element = document.getElementById('llm_results');
    if (getCookie("use_dummy")) {
        plotTableFromN4UDatasetDummy(target_element, "llm_dataset_id");
    } else {
        plotTableFromN4UDataset(target_element, "llm_dataset_id");
    }
}

// showing list items one by one with clicking the button
function showNextItem() {
    let list = document.getElementsByTagName('li');
    // filter list only style="display: none;"
    list = Array.prototype.filter.call(list, function (item) {
        return item.style.display === 'none';
    });
    let isdummy = getCookie("use_dummy");
    console.log("dummy_flag:", isdummy);
    if (list.length > 0) {
        list[0].style.display = 'block';
    }
    if (list.length === 3) {
        let target_element = document.getElementById('inconsistent_pairs');
        // if (isdummy) {
        //     plotTableFromN4UDatasetDummy(target_element, "llm_dataset_id");
        // } else {
        //     plotTableFromN4UDataset(target_element, "llm_dataset_id");
        // }
        plotInconsistentPairs(target_element, "human_dataset_id")
    }
    if (list.length === 1) {
        // let button = document.getElementById('logic_proceeding');
        // button.style.display = 'none';
        let target_element = document.getElementById('fixed_results');
        plotTableFromN4UDataset(target_element, "result_dataset_id");
    }
}

function plotInconsistentPairs(target_element, id_name = "") {
    const n4u_url = getCookie("n4u_url");

    let result_dataset_id = getCookie(id_name);
    // get the fixed results form n4u API
    const baseurl = n4u_url+"api/v1/datasets/";
    target_element.innerHTML = "Loading...";
    fetch(baseurl+result_dataset_id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: '+response.status);
            }
            return response.json();
        })
        .then(data => {
            data = JSON.parse(data);
            let items = [];
            for (let i = 0; i < data["dataitems"].length; i++) {
                items.push(data["dataitems"][i]["content"]);
            }
            let html = "<ul>";
            for (let i = 0; i < items.length; i++) {
                html += "<li>";
                html += "<p>" + items[i][0] + " : "+ items[i][1] + "</p>";
                html += "<p>" + items[i][2] + " : "+ items[i][3] + "</p>";
                html += "<p>" + items[i][4] + " : "+ items[i][5] + "</p>";
                html += "</li>";
            }
            html += "</ul>";
            target_element.innerHTML = html;
        });
}

function plotTableFromN4UDatasetDummy(target_element, id_name = "") {
    console.log("plot tables with dummy data");
    let dummy_result = "";
    if(id_name === "llm_dataset_id") {
        dummy_result = "[[None, False, True],[None, None, True],[None, None, None]]";
    }
    if(id_name === "result_dataset_id") {
        dummy_result = "[[None, False, True],[None, None, False],[None, None, None]]";
    }
    const cleanedStr = dummy_result.replace(/None/g, 'null').replace(/True/g, 'true').replace(/False/g, 'false');
    console.log("cleaned dummy str:",cleanedStr);
    let result_list = JSON.parse(cleanedStr);
    target_element.innerHTML = tableFromList(result_list);
}

function tableFromList(data_list) {
    let labels = getLabels();
    let html = "<table>";
    let first_row = "<tr><th>Titles</th>";
    for (let i = 0; i < labels.length; i++) {
        first_row += "<th style='font-weight: normal;'>" + labels[i] + "</th>";
    }
    first_row += "</tr>";
    html += first_row;
    for (let i = 0; i < data_list.length; i++) {
        html += "<tr>";
        html += "<td>" + labels[i] + "</td>";
        for (let j = 0; j < data_list[i].length; j++) {
            if (i < j) {
                if (data_list[i][j] === true) {
                    html += "<td>" + "Same" + "</td>";
                } else {
                    html += "<td>" + "Different" + "</td>";
                }
            } else {
                html += "<td>-</td>";
            }
        }
        html += "</tr>";
    }
    html += "</table>";
    return html;
}

function plotTableFromN4UDataset(target_element, id_name = "") {
    const n4u_url = getCookie("n4u_url");

    let result_dataset_id = getCookie(id_name);
    target_element.innerHTML = "Loading...";
    let label_list = getLabels();
    // get the fixed results form n4u API
    const baseurl = n4u_url+"api/v1/datasets/";
    fetch(baseurl+result_dataset_id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: '+response.status);
            }
            return response.json();
        })
        .then(data => {
            data = JSON.parse(data);
            console.log('Data received:', data);
            let results = data["dataitems"];
            let html = "<table>";
            let first_row = "<tr><th>Titles</th>";
            for (let i = 0; i < label_list.length; i++) {
                first_row += "<th style='font-weight: normal;'>" + label_list[i] + "</th>";
            }
            first_row += "</tr>";
            html += first_row;
            let result_raw = results[0]["content"][0];
            console.log("result_raw:", result_raw);
            const cleanedStr = result_raw.replace(/None/g, 'null').replace(/True/g, 'true').replace(/False/g, 'false');
            let result_list = JSON.parse(cleanedStr);
            for (let i = 0; i < result_list.length; i++) {
                html += "<tr>";
                html += "<td>" + label_list[i] + "</td>";
                for (let j = 0; j < result_list[i].length; j++) {
                    if (i < j) {
                        if (result_list[i][j] === true) {
                            html += "<td>" + "Same" + "</td>";
                        } else {
                            html += "<td>" + "Different" + "</td>";
                        }
                    } else {
                        html += "<td>-</td>";
                    }
                }
                html += "</tr>";
            }
            html += "</table>";
            target_element.innerHTML = html;
        });
}

async function getLabels() {
    const n4u_url = getCookie("n4u_url");

    let source_dataset_id = getCookie("source_dataset_id");
    const baseurl = n4u_url+"api/v1/datasets/";
    let label_list = [];
    let rawdata = await fetch(baseurl+source_dataset_id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.json()
        });
    let data = JSON.parse(rawdata);
    console.log('Source Data received:', data);
    let results = data["dataitems"];
    for (let i = 0; i < results.length; i++) {
        label_list.unshift(results[i]["content"][0]);
    }
    return label_list;
}

function showSetParamUI() {
    let hiddenItem = document.getElementById('setParams');
    if (hiddenItem.style.display === 'block') {
        hiddenItem.style.display = 'none';
    } else {
        hiddenItem.style.display = 'block';
    }
}