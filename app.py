from flask import Flask, send_from_directory, request
import pickle
import numpy as np
from database import create_database, get_connection

app = Flask(__name__)

create_database()

# Load trained performance model
with open("student_model.pkl", "rb") as file:
    model = pickle.load(file)


# Load trained risk model
with open("risk_model.pkl", "rb") as file:
    risk_model = pickle.load(file)


@app.route("/")
def home():
    return send_from_directory(".", "login.html")


@app.route("/<path:filename>")
def serve_file(filename):
    return send_from_directory(".", filename)


@app.route("/api/predict", methods=["POST"])
def predict():

    data = request.get_json()

    attendance = float(data["attendance"])
    internal_marks = float(data["internalMarks"])
    assignment_marks = float(data["assignmentMarks"])
    previous_marks = float(data["previousMarks"])
    study_hours = float(data["studyHours"])
    participation = float(data["participation"])


    # Prepare input for ML models
    features = np.array([[
        attendance,
        internal_marks,
        assignment_marks,
        previous_marks,
        study_hours,
        participation
    ]])


    # Predict performance score
    performance_score = model.predict(features)[0]


    # Determine prediction category
    if performance_score >= 80:
        prediction = "Excellent"
    elif performance_score >= 65:
        prediction = "Good"
    elif performance_score >= 50:
        prediction = "Average"
    else:
        prediction = "At Risk"


    # Predict risk level using ML model
    risk_prediction = risk_model.predict(features)[0]
    risk_level = risk_prediction


    # Determine grade
    if performance_score >= 90:
        grade = "A+"
    elif performance_score >= 80:
        grade = "A"
    elif performance_score >= 70:
        grade = "B"
    elif performance_score >= 60:
        grade = "C"
    elif performance_score >= 50:
        grade = "D"
    else:
        grade = "F"


    # Generate recommendation
    if performance_score >= 80:
        recommendation = (
            "The student is performing very well. "
            "Continue regular study habits and maintain good attendance."
        )
    elif performance_score >= 65:
        recommendation = (
            "The student is performing well but can improve further "
            "through consistent study and participation."
        )
    elif performance_score >= 50:
        recommendation = (
            "The student should increase study time, improve attendance "
            "and complete assignments regularly."
        )
    else:
        recommendation = (
            "The student may need additional academic support. "
            "Focus on attendance, study hours and assignments."
        )

 # Save student record to database
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        INSERT OR REPLACE INTO students (
            name,
            roll_number,
            attendance,
            internal_marks,
            assignment_marks,
            previous_marks,
            study_hours,
            participation,
            score,
            grade,
            prediction,
            risk_level,
            recommendation
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("studentName", "Unknown"),
        data.get("rollNumber", "Unknown"),
        attendance,
        internal_marks,
        assignment_marks,
        previous_marks,
        study_hours,
        participation,
        float(performance_score),
        grade,
        prediction,
        risk_level,
        recommendation
    ))

    connection.commit()

    connection.close()

    return {
        "score": round(float(performance_score), 2),
        "prediction": prediction,
        "riskLevel": risk_level,
        "grade": grade,
        "recommendation": recommendation
    }


def get_students():

    connection = get_connection()



@app.route("/api/students/<roll_number>", methods=["DELETE"])
def delete_student(roll_number):

    connection = get_connection()

    connection.execute(
        "DELETE FROM students WHERE roll_number = ?",
        (roll_number,)
    )

    connection.commit()
    connection.close()

    return {
        "message": "Student deleted successfully"
    }

@app.route("/api/students/<roll_number>", methods=["PUT"])
def update_student(roll_number):

    data = request.get_json()

    connection = get_connection()

    connection.execute("""
        UPDATE students
        SET
            name = ?,
            attendance = ?,
            internal_marks = ?,
            assignment_marks = ?,
            previous_marks = ?,
            study_hours = ?,
            participation = ?,
            score = ?,
            grade = ?,
            prediction = ?,
            risk_level = ?,
            recommendation = ?
        WHERE roll_number = ?
    """, (
        data["studentName"],
        data["attendance"],
        data["internalMarks"],
        data["assignmentMarks"],
        data["previousMarks"],
        data["studyHours"],
        data["participation"],
        data["score"],
        data["grade"],
        data["prediction"],
        data["riskLevel"],
        data["recommendation"],
        roll_number
    ))

    connection.commit()
    connection.close()

    return {
        "message": "Student updated successfully"
    }

@app.route("/api/students", methods=["GET"])
def get_students():

    connection = get_connection()

    rows = connection.execute(
        "SELECT * FROM students ORDER BY id"
    ).fetchall()

    connection.close()

    students = []

    for row in rows:

        students.append({
            "name": row["name"],
            "rollNumber": row["roll_number"],
            "attendance": row["attendance"],
            "internalMarks": row["internal_marks"],
            "assignmentMarks": row["assignment_marks"],
            "previousMarks": row["previous_marks"],
            "studyHours": row["study_hours"],
            "participation": row["participation"],
            "score": row["score"],
            "grade": row["grade"],
            "prediction": row["prediction"],
            "riskLevel": row["risk_level"],
            "recommendation": row["recommendation"]
        })

    return students

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)


