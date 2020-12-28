var alternative = [];
var tezine = [];
var kriteriji = [];
var zbrojAlternativa = [];
var brojKriterija = 0;
var brojAlternativa = 0;
var nazivPoduzeca;
var myChart;

function generirajTablicu() {
    alternative = [];
    tezine = [];

    if (myChart)
        myChart.destroy();
    document.getElementById("btnSave").disabled = true;


    var val1 = $('#kriterijInput').val();
    var val2 = $('#alternativaInput').val();
    var val3 = $('#nazivPoduzeca').val();
    if (val1 == "" || val2 == "" || val3 == "") {
        alert("Sva polja trebaju biti ispunjena!");
        return;
    }

    brojKriterija = parseInt(val1);
    brojAlternativa = parseInt(val2);
    nazivPoduzeca = val3;
    if (isNaN(brojAlternativa) || isNaN(brojKriterija)) {
        alert("Nedopuštene vrijednosti!");
        return;
    }

    var count = 0;

    var table1 = document.getElementById('tablicaDiv');
    var tbl = document.getElementById("tablica1");
    var tblBody = document.getElementById("tablicaBody");
    var tblHead = document.getElementById("tablicaHead");

    var Parent = document.getElementById("tablicaBody");
    while (Parent.hasChildNodes()) {
        Parent.removeChild(Parent.firstChild);
    }
    Parent = document.getElementById("tablicaHead");
    while (Parent.hasChildNodes()) {
        Parent.removeChild(Parent.firstChild);
    }
    Parent = document.getElementById("tablica1");
    while (Parent.hasChildNodes()) {
        Parent.removeChild(Parent.firstChild);
    }

    var headRow = document.createElement("tr");

    var tmpTh = document.createElement("th");
    tmpTh.innerText = "Kriteriji"
    tmpTh.classList.add("col-md-2");
    headRow.appendChild(tmpTh);

    var tmpTh = document.createElement("th");
    tmpTh.innerText = "Težina"
    tmpTh.classList.add("col-md-1");
    headRow.appendChild(tmpTh);

    for (var h = 0; h < brojAlternativa; h++) {
        var headTh = document.createElement("th");
        var headInput = document.createElement("input");
        headInput.type = "text";
        headInput.placeholder = "Alternativa";
        headInput.id = "f" + count;
        headTh.classList.add("col-md-2");
        headTh.appendChild(headInput);
        headRow.appendChild(headTh);
        tblHead.appendChild(headRow);
        count++;
    }

    // creating rows
    for (var r = 0; r < brojKriterija; r++) {
        var row = document.createElement("tr");

        // create cells in row
        for (var c = 0; c < brojAlternativa + 2; c++) {
            var td = document.createElement("td");
            var tdInput = document.createElement('input');
            tdInput.type = "text";
            tdInput.placeholder = "Unesi vrijednost";
            tdInput.id = "f" + count;
            td.appendChild(tdInput);
            row.appendChild(td);
            count++;
        }

        tblBody.appendChild(row); // add the row to the end of the table body
    }
    var row = document.createElement("tr");
    var x = 0;
    for (var c = 0; c < brojAlternativa + 2; c++) {
        var td = document.createElement("td");
        if (c == 1) {
            td.innerHTML = "<b>Ukupno:</b>";
        }
        if (c > 1) {
            td.id = "g" + x;
            x++;
        }
        row.appendChild(td);
    }

    tblBody.appendChild(row);
    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);
    table1.appendChild(tbl); // appends <table> into <div>
    document.getElementById("btnCalc").style.visibility = "visible";
    document.getElementById("btnSave").style.visibility = "visible";

}

function izracunaj() {
    for (var i = 0; i < (brojAlternativa + 2) * brojKriterija + brojAlternativa; i++) {
        if (document.getElementById("f" + i).value == "") {
            alert("Sva polja moraju biti popunjena!");
            return;
        }
    }
    zbrojAlternativa = [];
    alternative = [];
    tezine = [];
    kriteriji = [];
    for (var i = 0; i < brojAlternativa; i++) {
        zbrojAlternativa.push(0);
    }
    for (var i = 0; i < brojAlternativa; i++) {
        alternative.push(document.getElementById("f" + i).value)
    }
    for (var i = brojAlternativa; i < (brojAlternativa + 2) * brojKriterija + brojAlternativa; i++) {
        if (i % (brojAlternativa + 2) == brojAlternativa + 1) {
            var tmp = parseFloat(document.getElementById("f" + i).value);
            if (isNaN(tmp)) {
                alert("Težina ima nedopuštenu vrijednost!");
                return;
            }
            
            tezine.push(tmp);
            kriteriji.push(document.getElementById("f" + (i-1).value));
        }
    }
    var c = 0;
    var x = 0;
    var start = brojAlternativa + 2;
    var end = start + brojAlternativa;

    for (var i = start; i < (brojAlternativa + 2) * brojKriterija + brojAlternativa; i++) {
        if (i >= start && i < end) {
            var val = parseFloat(document.getElementById("f" + i).value);
            if (isNaN(val)) {
                alert("Nedopuštena vrijednost unešena u tablicu! (" + document.getElementById("f" + i).value + ")");
                return;
            }
            zbrojAlternativa[c] += (val * tezine[x]);
            zbrojAlternativa[c] = Math.round(zbrojAlternativa[c] * 1000)/1000;
            c++;
        }
        if (i == end) {
            c = 0;
            start += brojAlternativa + 2;
            end = start + brojAlternativa;
            x++;
        }
    }

    var max = zbrojAlternativa.reduce(function (a, b) {
        return Math.max(a, b);
    });
    for (var i = 0; i < brojAlternativa; i++) {
        document.getElementById("g" + i).innerHTML = "<b>" + zbrojAlternativa[i] + "</b>";
        if (zbrojAlternativa[i] == max) {
            document.getElementById("g" + i).style.backgroundColor = "#81ff75";
        }
        else {
            document.getElementById("g" + i).style.backgroundColor = "white";
        }
    }
    drawChart();
    document.getElementById("btnSave").disabled = false;
}



function drawChart() {
    var ctx = document.getElementById('myChart').getContext('2d');
    if (myChart)
        myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: alternative,
            datasets: [{
                label: 'Ponderirane sume',
                data: zbrojAlternativa,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    }
                }]
            },
        }
    });
    myChart.resize();
}


// Function to download data to a file
function spremi() {
    var data = "";
    data += brojKriterija;
    data += ",";
    data += brojAlternativa;
    data += ",";
    data += nazivPoduzeca;
    data += "\n";

    for (var i = 0; i < (brojAlternativa + 2) * brojKriterija + brojAlternativa; i++) {
        data += document.getElementById("f" + i).value;
        data += ",";
    }
    data = data.slice(0, -1);


    var file = new Blob([data], { type: "txt" });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, nazivPoduzeca);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = nazivPoduzeca;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
    document.getElementById("btnSave").disabled = true;
}

function ucitaj() {
    $('#file-input').trigger('click');
}

function readFile(file) {
    return new Promise((resolve, reject) => {
        let fr = new FileReader();
        fr.onload = x=> resolve(fr.result);
        fr.readAsText(file);
    })
}

async function read(input) {
    var x = await readFile(input.files[0]);
    var line1 = x.split("\n")[0];
    var line2 = x.split("\n")[1];
    
    if (myChart) myChart.destroy();
    var parts = line1.split(",");
    brojKriterija = parts[0];
    brojAlternativa = parts[1];
    nazivPoduzeca = parts[2];
    document.getElementById("kriterijInput").value = brojKriterija;
    document.getElementById("alternativaInput").value = brojAlternativa;
    document.getElementById("nazivPoduzeca").value = nazivPoduzeca;

    parts = line2.split(",");
    generirajTablicu();

    for (var i = 0; i < parts.length; i++) {
        document.getElementById("f" + i).value = parts[i];
    }
    izracunaj();

  }
