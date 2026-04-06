import pytest
from app import app, db


@pytest.fixture
def client():
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    with app.app_context():
        db.drop_all()
        db.create_all()

        with app.test_client() as client:
            yield client

        db.session.remove()
        db.drop_all()


def test_home_route(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.get_json()["message"] == "Backend is running"


def test_summarize_requires_notes(client):
    response = client.post(
        "/summarize",
        json={"title": "Test Project", "notes": ""}
    )

    assert response.status_code == 400
    assert response.get_json()["error"] == "Notes are required"


def test_summarize_rejects_long_notes(client):
    long_notes = "a" * 5001

    response = client.post(
        "/summarize",
        json={"title": "Long Notes", "notes": long_notes}
    )

    assert response.status_code == 400
    assert response.get_json()["error"] == "Notes too long (max 5000 characters)"


def test_projects_route_returns_list(client):
    response = client.get("/projects")
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)