import sqlite3


DATABASE = "students.db"


def create_database():

    connection = sqlite3.connect(DATABASE)

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            roll_number TEXT UNIQUE NOT NULL,
            attendance REAL,
            internal_marks REAL,
            assignment_marks REAL,
            previous_marks REAL,
            study_hours REAL,
            participation REAL,
            score REAL,
            grade TEXT,
            prediction TEXT,
            risk_level TEXT,
            recommendation TEXT
        )
    """)

    connection.commit()

    connection.close()


def get_connection():

    connection = sqlite3.connect(DATABASE)

    connection.row_factory = sqlite3.Row

    return connection

