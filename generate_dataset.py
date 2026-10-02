import pandas as pd
import random


random.seed(42)

students = []

for i in range(200):

    attendance = random.randint(50, 100)
    internal_marks = random.randint(40, 100)
    assignment_marks = random.randint(40, 100)
    previous_marks = random.randint(40, 100)
    study_hours = round(random.uniform(1, 8), 1)
    participation = random.randint(40, 100)

    study_score = min((study_hours / 8) * 100, 100)

    final_score = (
        (attendance * 0.15)
        + (internal_marks * 0.20)
        + (assignment_marks * 0.10)
        + (previous_marks * 0.25)
        + (study_score * 0.20)
        + (participation * 0.10)
    )

    final_score += random.uniform(-5, 5)

    final_score = max(0, min(100, final_score))

    students.append({
        "attendance": attendance,
        "internalMarks": internal_marks,
        "assignmentMarks": assignment_marks,
        "previousMarks": previous_marks,
        "studyHours": study_hours,
        "participation": participation,
        "finalScore": round(final_score, 2)
    })


df = pd.DataFrame(students)

df.to_csv("dataset.csv", index=False)

print("Dataset created successfully!")
print("Number of students:", len(df))
print("Dataset saved as dataset.csv")

