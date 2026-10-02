const form = document.getElementById("studentForm");

let students = [];

let editingRollNumber = null;

form.addEventListener("submit", function(event) {

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

    const performanceScore =
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
    riskLevel: riskLevel
};

    if (editingRollNumber !== null) {

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

    <button onclick="editStudent('${student.rollNumber}')">
        Edit
    </button>

    <button onclick="deleteStudent('${student.rollNumber}')">
        Delete
    </button>

</td>
        `;


        tableBody.appendChild(row);

    });

}


function deleteStudent(rollNumber) {

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

let performanceChart;

function updatePerformanceChart() {

    const ctx =
        document.getElementById("performanceChart");

    const labels =
        students.map(function(student) {
            return student.name;
        });

    const scores =
        students.map(function(student) {
            return student.score;
        });

    if (performanceChart) {
        performanceChart.destroy();
    }

    performanceChart = new Chart(ctx, {

        type: "bar",

        data: {
            labels: labels,

            datasets: [{
                label: "Performance Score (%)",
                data: scores
            }]
        },

        options: {
            responsive: true,

            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }

    });
}



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

