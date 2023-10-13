function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === name) {
            return decodeURIComponent(cookie[1]);
        }
    }
    return "";
}

function updateWorkflowId() {
    const workflowId = document.getElementById('workflowId').value;
    setCookie('workflow_id', workflowId, 1);  // Set the cookie named 'workflow_id' with the input value
    alert('Workflow ID updated!');
}

function updateResultDatasetId() {
    const resultDatasetId = document.getElementById('resultDatasetId').value;
    setCookie('result_dataset_id', resultDatasetId, 1);  // Set the cookie named 'result_dataset_id' with the input value
    alert('Result Dataset ID updated!');
}

function updateLLMResultDatasetId() {
    const resultDatasetId = document.getElementById('llmResultDatasetId').value;
    setCookie('llm_result_dataset_id', resultDatasetId, 1);  // Set the cookie named 'result_dataset_id' with the input value
    alert('LLM Result Dataset ID updated!');
}

// // Check if there's a workflow_id cookie and display it
// window.addEventListener('DOMContentLoaded', function() {
//     const workflowId = getCookie('workflow_id');
//     if (workflowId) {
//         document.getElementById('workflowId').value = workflowId;
//     }
// });
//
// // Check if there's a result_dataset_id cookie and display it
// window.addEventListener('DOMContentLoaded', function() {
//     const resultDatasetId = getCookie('result_dataset_id');
//     if (resultDatasetId) {
//         document.getElementById('resultDatasetId').value = resultDatasetId;
//     }
// });


const n4u_url = "http://localhost:5001/";

function showHiddenItem() {
    // set iframe src
    let iframe = document.getElementsByTagName('iframe')[0];

    let wf_id = getCookie("workflow_id")
    iframe.src = n4u_url+ "runs/wf/"+wf_id+"/run";

    // When submit button is clicked, show the hidden div
    let hiddenItem = document.getElementById('n4u_task');
    hiddenItem.style.display = 'block';
}

// showing list items one by one with clicking the button
function showNextItem() {
    let list = document.getElementsByTagName('li');
    // filter list only style="display: none;"
    list = Array.prototype.filter.call(list, function (item) {
        return item.style.display === 'none';
    });
    if (list.length > 1) {
        list[0].style.display = 'block';
    } else if (list.length === 1) {
        list[0].style.display = 'block';
        let button = document.getElementById('logic_proceeding');
        button.style.display = 'none';
        let target_element = document.getElementById('fixed_results');
        plotTableFromN4UDataset(target_element, "result_dataset_id");
    }
}

function getLLMResults() {
    let target_element = document.getElementById('llm_results');
    plotTableFromN4UDataset(target_element, "llm_result_dataset_id");
}

function plotTableFromN4UDataset(target_element, id_name = "") {
    let result_dataset_id = getCookie(id_name);
    // get the fixed results form n4u API
    const url = n4u_url+"api/v1/datasets/"+result_dataset_id;
    target_element.innerHTML = "Loading...";
    fetch(url)
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
            for (let i = 0; i < results.length; i++) {
                html += "<tr>";
                for (let j = 0; j < results[i]["content"].length; j++) {
                    html += "<td>" + results[i]["content"][j] + "</td>";
                }
                html += "</tr>";
            }
            html += "</table>";
            target_element.innerHTML = html;
        });
}