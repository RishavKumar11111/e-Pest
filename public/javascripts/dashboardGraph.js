function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.response);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
};

if (window.location.href.indexOf("aao") > -1) {
    httpGetAsync('http://localhost:3000/aao/getDashboardDetails', function (res) {
        var barChartData = JSON.parse(res);
        if (barChartData.length > 0 && barChartData[1].length > 0) {
            var totalAreaAffected = barChartData[1][0].TotalAffectedArea;
            var totalAreaTreated = barChartData[1][0].TotalTreatedArea;
        }
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Total Area Affected (in HA)', 'Total Area Treated (in HA)'],
                datasets: [{
                    backgroundColor: [
                        "#179928",
                        "#4285f4",
                    ],
                    data: [totalAreaAffected, totalAreaTreated]
                }]
            }
        });
    });
}

if (window.location.href.indexOf("jdapp") > -1) {
    httpGetAsync('http://localhost:3000/jdapp/getDashboardDetails', function (res) {
        var barChartData1 = JSON.parse(res);
        if (barChartData1.length > 0 && barChartData1[2].length > 0) {
            var totalAreaAffected = barChartData1[2][0].TotalAffectedArea;
            var totalAreaTreated = barChartData1[2][0].TotalTreatedArea;
            var adc = barChartData1[5];
            var months = [];
            for (var i = 0; i < adc.length; i++) {
                if (!months.includes(adc[i].Month)) {
                    months.push(adc[i].Month);
                }
            }
            var array1 = [];
            for (var i = 0; i < adc.length; i++) {
                var found = array1.find(j => j.PestDiseaseName == adc[i].PestDiseaseName);
                if (found != null) {
                    found.ModerateAdvisoryNo += ", " + adc[i].ModerateAdvisoryNo;
                    found.ModerateAdvisoryNo += "-" + adc[i].Month;
                }
                else {
                    array1.push({ "ModerateAdvisoryNo": adc[i].ModerateAdvisoryNo + "-" + adc[i].Month, "PestDiseaseName": adc[i].PestDiseaseName });
                }
            }
            for (var i = 0; i < months.length; i++) {
                for (var j = 0; j < array1.length; j++) {
                    if (array1[j].ModerateAdvisoryNo.indexOf(months[i]) == -1) {
                        if (months[i] == "September") {
                            array1[j].ModerateAdvisoryNo = "0-September, " + array1[j].ModerateAdvisoryNo;
                        }
                        else if (months[i] == "October") {
                            var k = array1[j].ModerateAdvisoryNo.split(", ");
                            k[1] = ", 0-October, " + k[1];
                            array1[j].ModerateAdvisoryNo = k[0].concat(k[1]);
                        }
                        else if (months[i] == "November") {
                            array1[j].ModerateAdvisoryNo = array1[j].ModerateAdvisoryNo + ", 0-November";
                        }
                    }
                }
            }
            var finalArray = [];
            for (var i = 0; i < array1.length; i++) {
                array1[i].ModerateAdvisoryNo = array1[i].ModerateAdvisoryNo.replace(/-September|-October|-November/g, "");
                array1[i].ModerateAdvisoryNo = array1[i].ModerateAdvisoryNo.split(", ");
                finalArray.push({ "data": array1[i].ModerateAdvisoryNo, "label": array1[i].PestDiseaseName, "borderColor": 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')', "fill": false });
            }
            var taa = barChartData1[6][0].TotalAffectedArea;
            var tat = barChartData1[6][0].TotalTreatedArea;
        }
        var ctx = document.getElementById('myChart1').getContext('2d');
        var myChart1 = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Total Area Affected (in HA)', 'Total Area Treated (in HA)'],
                datasets: [{
                    backgroundColor: [
                        "#a52a2a",
                        "#2aa52a"
                    ],
                    data: [totalAreaAffected, totalAreaTreated]
                }]
            }
        });
        var ctx = document.getElementById('myChart5').getContext('2d');
        var myChart5 = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: finalArray
            }
        });
        var ctx = document.getElementById('myChart6').getContext('2d');
        var myChart6 = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Total Area Affected (in HA)', 'Total Area Treated (in HA)'],
                datasets: [{
                    backgroundColor: [
                        "#a52a2a",
                        "#2aa52a"
                    ],
                    data: [taa, tat]
                }]
            }
        });
    });
}

if (window.location.href.indexOf("cdao") > -1) {
    httpGetAsync('http://localhost:3000/cdao/getDashboardDetails', function (res) {
        var barChartData2 = JSON.parse(res);
        if (barChartData2.length > 0 && barChartData2[2].length > 0) {
            var totalAreaAffected = barChartData2[2][0].TotalAffectedArea;
            var totalAreaTreated = barChartData2[2][0].TotalTreatedArea;
        }
        var ctx = document.getElementById('myChart2').getContext('2d');
        var myChart2 = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Total Area Affected (in HA)', 'Total Area Treated (in HA)'],
                datasets: [{
                    backgroundColor: [
                        "#4285f4",
                        "#db4437"
                    ],
                    data: [totalAreaAffected, totalAreaTreated]
                }]
            }
        });
    });
}

if (window.location.href.indexOf("ouat") > -1) {
    httpGetAsync('http://localhost:3000/ouat/getDashboardDetails', function (res) {
        var barChartData3 = JSON.parse(res);
        if (barChartData3.length > 0 && barChartData3[2].length > 0) {
            var totalAreaAffected = barChartData3[2][0].TotalAffectedArea;
            var totalAreaTreated = barChartData3[2][0].TotalTreatedArea;
        }
        var ctx = document.getElementById('myChart3').getContext('2d');
        var myChart3 = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Total Area Affected (in HA)', 'Total Area Treated (in HA)'],
                datasets: [{
                    backgroundColor: [
                        "#4285f4",
                        "#db4437"
                    ],
                    data: [totalAreaAffected, totalAreaTreated]
                }]
            }
        });
    });
}

if (window.location.href.indexOf("ado") > -1) {
    httpGetAsync('http://localhost:3000/ado/getDashboardDetails', function (res) {
        var barChartData3 = JSON.parse(res);
        if (barChartData3.length > 0 && barChartData3[2].length > 0) {
            var totalAreaAffected = barChartData3[2][0].TotalAffectedArea;
            var totalAreaTreated = barChartData3[2][0].TotalTreatedArea;
        }
        var ctx = document.getElementById('myChart4').getContext('2d');
        var myChart4 = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Total Area Affected (in HA)', 'Total Area Treated (in HA)'],
                datasets: [{
                    backgroundColor: [
                        "#4285f4",
                        "#db4437"
                    ],
                    data: [totalAreaAffected, totalAreaTreated]
                }]
            }
        });
    });
}