import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle


# Load dataset
data = pd.read_csv("dataset.csv")


# Create risk labels from final scores
def get_risk(score):

    if score >= 65:
        return "Low"
    elif score >= 50:
        return "Medium"
    else:
        return "High"


data["riskLevel"] = data["finalScore"].apply(get_risk)


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
y = data["riskLevel"]


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# Create risk prediction model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


# Train model
model.fit(X_train, y_train)


# Check model accuracy
accuracy = model.score(X_test, y_test)


print("Risk model training completed!")
print("Risk model accuracy:", round(accuracy * 100, 2), "%")


# Save model
with open("risk_model.pkl", "wb") as file:
    pickle.dump(model, file)


print("Risk model saved as risk_model.pkl")

