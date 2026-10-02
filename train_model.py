import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import pickle


# Load dataset
data = pd.read_csv("dataset.csv")


# Input features
X = data[
    [
        "attendance",
        "internalMarks",
        "assignmentMarks",
        "previousMarks",
        "studyHours",
        "participation"
    ]
]


# Target value
y = data["finalScore"]


# Split dataset into training and testing data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Create machine learning model
model = LinearRegression()


# Train the model
model.fit(X_train, y_train)


# Check model accuracy
accuracy = model.score(X_test, y_test)


print("Model training completed!")
print("Model accuracy:", round(accuracy * 100, 2), "%")


# Save trained model
with open("student_model.pkl", "wb") as file:
    pickle.dump(model, file)


print("Model saved as student_model.pkl")

