const form = document.getElementById("studentForm");

let students = [];

let editingRollNumber = null;

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const studentName =
        document.getElementById("studentName").value;

    const rollNumber =
        document.getElementById("rollNumber").value;

    const attendance =
        Number(document.getElementById("attendance").value);

    const internalMarks =
        Number(document.getElementById("internalMarks").value);

    const assignmentMarks =
        Number(document.getElementById("assignmentMarks").value);

    const previousMarks =
        Number(document.getElementById("previousMarks").value);

    const studyHours =
        Number(document.getElementById("studyHours").value);

    const participation =
        Number(document.getElementById("participation").value);

    const studyScore =
        Math.min((studyHours / 8) * 100, 100);

    let performanceScore =
        (attendance * 0.15) +
        (internalMarks * 0.20) +
        (assignmentMarks * 0.10) +
        (previousMarks * 0.25) +
        (studyScore * 0.20) +
        (participation * 0.10);

    let grade;

    if (performanceScore >= 90) {
        grade = "A+";
    }
    else if (performanceScore >= 80) {
        grade = "A";
    }
    else if (performanceScore >= 70) {
        grade = "B";
    }
    else if (performanceScore >= 60) {
        grade = "C";
    }
    else if (performanceScore >= 50) {
        grade = "D";
    }
    else {
        grade = "F";
    }

    let prediction;
    let riskLevel;
    let recommendation;

    if (performanceScore >= 80) {

        prediction = "Excellent";
        riskLevel = "Low";

        recommendation =
            "The student is performing very well. Continue regular study habits and maintain good attendance.";

    }
    else if (performanceScore >= 65) {

        prediction = "Good";
        riskLevel = "Low";

        recommendation =
            "The student is performing well but can improve further through consistent study and participation.";

    }
    else if (performanceScore >= 50) {

        prediction = "Average";
        riskLevel = "Medium";

        recommendation =
            "The student should increase study time, improve attendance and complete assignments regularly.";

    }
    else {

        prediction = "At Risk";
        riskLevel = "High";

        recommendation =
            "The student may need additional academic support. Focus on attendance, study hours and assignments.";

    }

    const response = await fetch("/api/predict", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            studentName: studentName,
    rollNumber: rollNumber,
            attendance: attendance,
            internalMarks: internalMarks,
            assignmentMarks: assignmentMarks,
            previousMarks: previousMarks,
            studyHours: studyHours,
            participation: participation

        })

    });

    const predictionData = await response.json();

    const pythonScore =
        predictionData.score;

    const pythonPrediction =
        predictionData.prediction;

    const pythonRiskLevel =
        predictionData.riskLevel;

    performanceScore = pythonScore;
    prediction = pythonPrediction;
    riskLevel = pythonRiskLevel;

grade = predictionData.grade;

recommendation = predictionData.recommendation;
    
const student = {
    name: studentName,
    rollNumber: rollNumber,
    attendance: attendance,
    internalMarks: internalMarks,
    assignmentMarks: assignmentMarks,
    previousMarks: previousMarks,
    studyHours: studyHours,
    participation: participation,
    score: performanceScore,
    grade: grade,
    prediction: prediction,
    riskLevel: riskLevel,
    recommendation: recommendation
};

    if (editingRollNumber !== null) {

    await fetch("/api/students/" + editingRollNumber, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            studentName: student.name,
            attendance: student.attendance,
            internalMarks: student.internalMarks,
            assignmentMarks: student.assignmentMarks,
            previousMarks: student.previousMarks,
            studyHours: student.studyHours,
            participation: student.participation,
            score: student.score,
            grade: student.grade,
            prediction: student.prediction,
            riskLevel: student.riskLevel,
            recommendation: student.recommendation
        })
    });

    const studentIndex = students.findIndex(function(student) {
        return student.rollNumber === editingRollNumber;
    });

    if (studentIndex !== -1) {
        students[studentIndex] = student;
    }

    editingRollNumber = null;

}
else {
    students.push(student);
}

updateDashboard();
updateStudentTable();
updatePerformanceChart();
updateRiskChart();
    document.getElementById("studentResult").innerText =
        studentName + " - Roll No: " + rollNumber;

    document.getElementById("scoreResult").innerText =
        performanceScore.toFixed(2) + "%";

    document.getElementById("gradeResult").innerText =
        grade;

    document.getElementById("predictionResult").innerText =
        prediction;

    document.getElementById("riskResult").innerText =
        riskLevel;

    document.getElementById("recommendationResult").innerText =
        recommendation;

    document.getElementById("result").style.display =
        "block";

    document.getElementById("result").scrollIntoView({
        behavior: "smooth"
    });

});




function updateDashboard() {

    const totalStudents =
        students.length;

    let totalScore = 0;

    students.forEach(function(student) {
        totalScore += student.score;
    });

    let averagePerformance = 0;

    if (totalStudents > 0) {
        averagePerformance =
            totalScore / totalStudents;
    }

    let atRiskStudents = 0;

    students.forEach(function(student) {

        if (student.riskLevel === "High") {
            atRiskStudents++;
        }

    });

    document.getElementById("totalStudents").innerText =
        totalStudents;

    document.getElementById("averagePerformance").innerText =
        averagePerformance.toFixed(2) + "%";

    document.getElementById("atRiskStudents").innerText =
        atRiskStudents;
}


function updateStudentTable() {

    const tableBody =
        document.getElementById("studentTableBody");

    tableBody.innerHTML = "";

    students.forEach(function(student) {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${student.rollNumber}</td>
            <td>${student.name}</td>
            <td>${student.score.toFixed(2)}%</td>
            <td>${student.grade}</td>
            <td>${student.prediction}</td>
            <td>${student.riskLevel}</td>
            <td>

<button onclick="viewStudent('${student.rollNumber}')">
    View
</button>

    <button onclick="editStudent('${student.rollNumber}')">
        Edit
    </button>

    <button onclick="deleteStudent('${student.rollNumber}')">
        Delete
    </button>

    <button onclick="generateReport('${student.rollNumber}')">
        Report
    </button>
</td>
        `;


        tableBody.appendChild(row);

    });

}


async function deleteStudent(rollNumber) {

    await fetch("/api/students/" + rollNumber, {
        method: "DELETE"
    });

    students = students.filter(function(student) {
        return student.rollNumber !== rollNumber;
    });

    updateDashboard();
    updateStudentTable();
    updatePerformanceChart();
    updateRiskChart();
}

    


function editStudent(rollNumber) {

    const student = students.find(function(student) {
        return student.rollNumber === rollNumber;
    });

    if (!student) {
        return;
    }

    editingRollNumber = student.rollNumber;

    document.getElementById("studentName").value =
        student.name;

    document.getElementById("rollNumber").value =
        student.rollNumber;

    document.getElementById("attendance").value =
        student.attendance;

    document.getElementById("internalMarks").value =
        student.internalMarks;

    document.getElementById("assignmentMarks").value =
        student.assignmentMarks;

    document.getElementById("previousMarks").value =
        student.previousMarks;

    document.getElementById("studyHours").value =
        student.studyHours;

    document.getElementById("participation").value =
        student.participation;

    document.getElementById("studentName").focus();

    document.getElementById("studentForm").scrollIntoView({
        behavior: "smooth"
    });
}




function viewStudent(rollNumber) {

    const student = students.find(function(student) {
        return student.rollNumber === rollNumber;
    });

    if (!student) {
        return;
    }

    document.getElementById("studentName").value =
        student.name;

    document.getElementById("rollNumber").value =
        student.rollNumber;

    document.getElementById("attendance").value =
        student.attendance;

    document.getElementById("internalMarks").value =
        student.internalMarks;

    document.getElementById("assignmentMarks").value =
        student.assignmentMarks;

    document.getElementById("previousMarks").value =
        student.previousMarks;

    document.getElementById("studyHours").value =
        student.studyHours;

    document.getElementById("participation").value =
        student.participation;

    document.getElementById("studentForm").scrollIntoView({
        behavior: "smooth"
    });
}



let performanceChart;




let riskChart;

function updateRiskChart() {

    const ctx =
        document.getElementById("riskChart");

    let lowRisk = 0;
    let mediumRisk = 0;
    let highRisk = 0;

    students.forEach(function(student) {

        if (student.riskLevel === "Low") {
            lowRisk++;
        }

        else if (student.riskLevel === "Medium") {
            mediumRisk++;
        }

        else if (student.riskLevel === "High") {
            highRisk++;
        }

    });

    if (riskChart) {
        riskChart.destroy();
    }

    riskChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: [
                "Low Risk",
                "Medium Risk",
                "High Risk"
            ],

            datasets: [{
                data: [
                    lowRisk,
                    mediumRisk,
                    highRisk
                ]
            }]

        },

        options: {
            responsive: true
        }

    });

}

async function loadStudents() {

    const response =
        await fetch("/api/students");

    const data =
        await response.json();

    students = data.map(function(student) {

        return {
            name: student.name,
            rollNumber: student.rollNumber,
            attendance: student.attendance,
            internalMarks: student.internalMarks,
            assignmentMarks: student.assignmentMarks,
            previousMarks: student.previousMarks,
            studyHours: student.studyHours,
            participation: student.participation,
            score: student.score,
            grade: student.grade,
            prediction: student.prediction,
            riskLevel: student.riskLevel,
            recommendation: student.recommendation
        };

    });

    updateDashboard();
    updateStudentTable();
    updatePerformanceChart();
    updateRiskChart();
}

loadStudents();


function updatePerformanceChart() {

    const canvas = document.getElementById("performanceChart");

    if (!canvas) {
        return;
    }

    if (performanceChart) {
        performanceChart.destroy();
        performanceChart = null;
    }

    const labels = students.map(function(student) {
        return student.name;
    });

    const scores = students.map(function(student) {
        return Number(student.score);
    });

    performanceChart = new Chart(canvas, {
        type: "bar",

        data: {
            labels: labels,

            datasets: [{
                label: "Performance Score (%)",
                data: scores,
                backgroundColor: "#2563eb",
                borderColor: "#1d4ed8",
                borderWidth: 2
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,

            scales: {
                x: {
                    display: true
                },

                y: {
                    beginAtZero: true,
                    max: 100,
                    display: true
                }
            }
        }
    });
}

function generateReport(rollNumber) {

    const student = students.find(function(student) {
        return student.rollNumber === rollNumber;
    });

    if (!student) {
        return;
    }

    const reportWindow = window.open("", "_blank");

    reportWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Student Performance Report</title>

            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    background: #f5f7fa;
                }

                .report {
                    max-width: 800px;
                    margin: auto;
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                }

                h1 {
                    text-align: center;
                    margin-bottom: 10px;
                }

                .subtitle {
                    text-align: center;
                    color: #666;
                    margin-bottom: 30px;
                }

                h2 {
                    margin-top: 30px;
                    border-bottom: 2px solid #ddd;
                    padding-bottom: 8px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }

                th, td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }

                th {
                    background: #f0f2f5;
                }

                .recommendation {
                    background: #f8f9fa;
                    padding: 20px;
                    margin-top: 15px;
                    border-radius: 8px;
                }

                .print-button {
                    display: block;
                    margin: 30px auto 0;
                    padding: 12px 25px;
                    background: #2563eb;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                }

                @media print {
                    .print-button {
                        display: none;
                    }

                    body {
                        background: white;
                    }

                    .report {
                        box-shadow: none;
                    }
                }
            </style>
        </head>

        <body>

            <div class="report">

                <h1>Student Performance Report</h1>

                <p class="subtitle">
                    Smart Student Performance Analysis and Prediction
                </p>

                <h2>Student Information</h2>

                <table>
                    <tr>
                        <th>Name</th>
                        <td>${student.name}</td>
                    </tr>

                    <tr>
                        <th>Roll Number</th>
                        <td>${student.rollNumber}</td>
                    </tr>
                </table>

                <h2>Academic Performance</h2>

                <table>
                    <tr>
                        <th>Performance Score</th>
                        <td>${student.score.toFixed(2)}%</td>
                    </tr>

                    <tr>
                        <th>Grade</th>
                        <td>${student.grade}</td>
                    </tr>

                    <tr>
                        <th>Prediction</th>
                        <td>${student.prediction}</td>
                    </tr>

                    <tr>
                        <th>Risk Level</th>
                        <td>${student.riskLevel}</td>
                    </tr>
                </table>

                <h2>Performance Factors</h2>

                <table>
                    <tr>
                        <th>Attendance</th>
                        <td>${student.attendance}%</td>
                    </tr>

                    <tr>
                        <th>Internal Marks</th>
                        <td>${student.internalMarks}</td>
                    </tr>

                    <tr>
                        <th>Assignment Marks</th>
                        <td>${student.assignmentMarks}</td>
                    </tr>

                    <tr>
                        <th>Previous Marks</th>
                        <td>${student.previousMarks}</td>
                    </tr>

                    <tr>
                        <th>Study Hours</th>
                        <td>${student.studyHours}</td>
                    </tr>

                    <tr>
                        <th>Participation</th>
                        <td>${student.participation}%</td>
                    </tr>
                </table>

                <h2>Recommendation</h2>

                <div class="recommendation">
                    ${getRecommendation(student)}
                </div>

                <button
                    class="print-button"
                    onclick="window.print()">
                    Print / Save as PDF
                </button>

            </div>

        </body>
        </html>
    `);

    reportWindow.document.close();
}


function getRecommendation(student) {

    if (student.score >= 80) {

        return "The student is performing very well. Continue regular study habits and maintain good attendance.";

    }
    else if (student.score >= 65) {

        return "The student is performing well but can improve further through consistent study and participation.";

    }
    else if (student.score >= 50) {

        return "The student should increase study time, improve attendance and complete assignments regularly.";

    }
    else {

        return "The student may need additional academic support. Focus on attendance, study hours and assignments.";

    }
}

