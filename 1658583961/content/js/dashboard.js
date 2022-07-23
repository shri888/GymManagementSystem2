/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 0.0, "KoPercent": 100.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "S01_T03_Admin_Login"], "isController": true}, {"data": [0.0, 500, 1500, "S01_T08_Admin_ClickOnAddMember"], "isController": true}, {"data": [0.0, 500, 1500, "ClickOnLogin-51"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-88"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-87"], "isController": false}, {"data": [0.0, 500, 1500, "Launch-47"], "isController": false}, {"data": [0.0, 500, 1500, "Login-54"], "isController": false}, {"data": [0.0, 500, 1500, "S01_T09_Admin_SubmitAddMember"], "isController": true}, {"data": [0.0, 500, 1500, "Login-55"], "isController": false}, {"data": [0.0, 500, 1500, "ClickOnAddMember-80"], "isController": false}, {"data": [0.0, 500, 1500, "S01_T01_Admin_Launch"], "isController": true}, {"data": [0.0, 500, 1500, "S01_T10_Admin_Logout"], "isController": true}, {"data": [0.0, 500, 1500, "S01_T02_Admin_ClickOnLogin"], "isController": true}, {"data": [0.0, 500, 1500, "SubmitAddMember-84"], "isController": false}, {"data": [0.0, 500, 1500, "SubmitAddMember-83"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9, 9, 100.0, 251.22222222222223, 240, 307, 244.0, 307.0, 307.0, 307.0, 3.938730853391685, 10.789199261487964, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["S01_T03_Admin_Login", 1, 1, 100.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 11.135194359756097, 0.0], "isController": true}, {"data": ["S01_T08_Admin_ClickOnAddMember", 1, 1, 100.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 11.41357421875, 0.0], "isController": true}, {"data": ["ClickOnLogin-51", 1, 1, 100.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 11.31924715909091, 0.0], "isController": false}, {"data": ["Logout-88", 1, 1, 100.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 11.22646644467213, 0.0], "isController": false}, {"data": ["Logout-87", 1, 1, 100.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 11.27266589506173, 0.0], "isController": false}, {"data": ["Launch-47", 1, 1, 100.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 8.922663884364821, 0.0], "isController": false}, {"data": ["Login-54", 1, 1, 100.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 11.001035391566266, 0.0], "isController": false}, {"data": ["S01_T09_Admin_SubmitAddMember", 1, 1, 100.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 11.11260775862069, 0.0], "isController": true}, {"data": ["Login-55", 1, 1, 100.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 11.27266589506173, 0.0], "isController": false}, {"data": ["ClickOnAddMember-80", 1, 1, 100.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 11.41357421875, 0.0], "isController": false}, {"data": ["S01_T01_Admin_Launch", 1, 1, 100.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 8.922663884364821, 0.0], "isController": true}, {"data": ["S01_T10_Admin_Logout", 1, 1, 100.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 11.249518737166325, 0.0], "isController": true}, {"data": ["S01_T02_Admin_ClickOnLogin", 1, 1, 100.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 11.31924715909091, 0.0], "isController": true}, {"data": ["SubmitAddMember-84", 1, 1, 100.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 11.045394405241936, 0.0], "isController": false}, {"data": ["SubmitAddMember-83", 1, 1, 100.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 11.180644132653061, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-15-207-114-137.ap-south-1.compute.amazonaws.com:5000 [ec2-15-207-114-137.ap-south-1.compute.amazonaws.com/15.207.114.137] failed: Connection refused (Connection refused)", 9, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9, 9, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-15-207-114-137.ap-south-1.compute.amazonaws.com:5000 [ec2-15-207-114-137.ap-south-1.compute.amazonaws.com/15.207.114.137] failed: Connection refused (Connection refused)", 9, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ClickOnLogin-51", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-15-207-114-137.ap-south-1.compute.amazonaws.com:5000 [ec2-15-207-114-137.ap-south-1.compute.amazonaws.com/15.207.114.137] failed: Connection refused (Connection refused)", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Logout-88", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-15-207-114-137.ap-south-1.compute.amazonaws.com:5000 [ec2-15-207-114-137.ap-south-1.compute.amazonaws.com/15.207.114.137] failed: Connection refused (Connection refused)", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Logout-87", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-15-207-114-137.ap-south-1.compute.amazonaws.com:5000 [ec2-15-207-114-137.ap-south-1.compute.amazonaws.com/15.207.114.137] failed: Connection refused (Connection refused)", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Launch-47", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-15-207-114-137.ap-south-1.compute.amazonaws.com:5000 [ec2-15-207-114-137.ap-south-1.compute.amazonaws.com/15.207.114.137] failed: Connection refused (Connection refused)", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Login-54", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-15-207-114-137.ap-south-1.compute.amazonaws.com:5000 [ec2-15-207-114-137.ap-south-1.compute.amazonaws.com/15.207.114.137] failed: Connection refused (Connection refused)", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-55", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-15-207-114-137.ap-south-1.compute.amazonaws.com:5000 [ec2-15-207-114-137.ap-south-1.compute.amazonaws.com/15.207.114.137] failed: Connection refused (Connection refused)", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["ClickOnAddMember-80", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-15-207-114-137.ap-south-1.compute.amazonaws.com:5000 [ec2-15-207-114-137.ap-south-1.compute.amazonaws.com/15.207.114.137] failed: Connection refused (Connection refused)", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["SubmitAddMember-84", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-15-207-114-137.ap-south-1.compute.amazonaws.com:5000 [ec2-15-207-114-137.ap-south-1.compute.amazonaws.com/15.207.114.137] failed: Connection refused (Connection refused)", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SubmitAddMember-83", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-15-207-114-137.ap-south-1.compute.amazonaws.com:5000 [ec2-15-207-114-137.ap-south-1.compute.amazonaws.com/15.207.114.137] failed: Connection refused (Connection refused)", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
