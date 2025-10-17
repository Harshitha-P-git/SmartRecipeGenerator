import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import "/node_modules/@fortawesome/fontawesome-free/css/all.min.css";

const BACKEND_URL = "https://smartrecipegenerator-backend-1.onrender.com";

function App() {
  const [ingredients, setIngredients] = useState("");
  const [diet, setDiet] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [servings, setServings] = useState(1);
  const [recipes, setRecipes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("harshitha.perala2022@vitstudent.ac.in");

  // ---------- Generate Recipes ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setRecipes([]);

    try {
      const response = await axios.post(`${BACKEND_URL}/generate`, {
        ingredients: ingredients.split(",").map((i) => i.trim()),
        diet,
        difficulty,
        max_time: maxTime,
        servings,
      });

      if (Array.isArray(response.data)) setRecipes(response.data);
      else setError("No recipes found.");
    } catch {
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  // ---------- Substitution Suggestions ----------
  const handleSubstitute = async (ingredient) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/substitute`, {
        ingredient,
      });
      alert(
        response.data.substitutions.length
          ? `Substitutes for ${ingredient}: ${response.data.substitutions.join(", ")}`
          : `No substitutes found for ${ingredient}.`
      );
    } catch {
      alert("Error fetching substitution suggestions.");
    }
  };

  // ---------- Save Recipe ----------
  const handleSave = async (recipeName) => {
    try {
      await axios.post(`${BACKEND_URL}/save`, {
        email,
        recipe: recipeName,
      });
      alert(`${recipeName} saved to favorites!`);
    } catch {
      alert("Error saving recipe.");
    }
  };

  // ---------- Rate Recipe ----------
  const handleRate = async (recipeName, rating) => {
    try {
      await axios.post(`${BACKEND_URL}/rate`, {
        email,
        recipe: recipeName,
        rating,
      });
      alert(`You rated ${recipeName} ${rating}⭐`);
    } catch {
      alert("Error submitting rating.");
    }
  };

  // ---------- Get Recipe Suggestions ----------
  const handleSuggestions = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/suggestions`, {
        params: { email },
      });
      setSuggestions(response.data);
    } catch {
      alert("Error fetching suggestions.");
    }
  };

  return (
    <>
      {/* ---------- NAVBAR ---------- */}
      <nav className="navbar">🥘 Smart Recipe Generator</nav>

      {/* ---------- MAIN CONTAINER ---------- */}
      <div className="generator-container">
        <h1>Find Recipes Instantly</h1>
        <p className="subtitle">
          Enter your ingredients and we’ll find matching dishes for you.
        </p>

        {/* ---------- INPUT FORM ---------- */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="e.g., rice, carrot, tomato"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />

          <select value={diet} onChange={(e) => setDiet(e.target.value)}>
            <option value="">All Diets</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
          </select>

          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Any Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <input
            type="number"
            placeholder="Max Time (mins)"
            value={maxTime}
            onChange={(e) => setMaxTime(e.target.value)}
          />

          <input
            type="number"
            placeholder="Servings"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Recipes"}
          </button>

          {loading && <div className="spinner"></div>}
        </form>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>

      {/* ---------- RECIPE RESULTS ---------- */}
      {recipes.length > 0 && (
        <div className="recipes">
          {recipes.map((r, i) => (
            <div className="recipe-card" key={i}>
              <img
                src={`https://source.unsplash.com/400x300/?${r.name.replace(" ", "-")},food`}
                alt={r.name}
                className="recipe-img"
              />
              <div className="recipe-body">
                <h2 className="recipe-title">{r.name}</h2>
                <p className="recipe-details">
                  <strong>Calories:</strong> {r.calories} kcal |{" "}
                  <strong>Time:</strong> {r.time} min |{" "}
                  <strong>Difficulty:</strong> {r.difficulty}
                </p>
                <p className="recipe-details">
                  <strong>Ingredients:</strong> {r.ingredients.join(", ")}
                </p>
                <p className="instructions">{r.instructions}</p>

                {/* ---------- Substitution + Rating + Save ---------- */}
                <div className="recipe-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleSubstitute(r.ingredients[0])}
                  >
                    <i className="fas fa-exchange-alt"></i> Substitute
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => handleSave(r.name)}
                  >
                    <i className="fas fa-heart"></i> Save
                  </button>

                  <div className="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className="fas fa-star"
                        onClick={() => handleRate(r.name, star)}
                      ></i>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- SUGGESTIONS SECTION ---------- */}
      <div className="suggestions-container">
        <button className="btn-primary" onClick={handleSuggestions}>
          Show Suggested Recipes
        </button>

        {suggestions.length > 0 && (
          <div className="recipes">
            {suggestions.map((s, i) => (
              <div className="recipe-card" key={i}>
                <h2 className="recipe-title">{s.name}</h2>
                <p className="recipe-details">
                  <strong>Calories:</strong> {s.calories} kcal
                </p>
                <p className="recipe-details">
                  <strong>Ingredients:</strong> {s.ingredients.join(", ")}
                </p>
                <p className="instructions">{s.instructions}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <i className="fas fa-pencil-alt"></i>
            <p><strong>Step 1:</strong> Enter your ingredients.</p>
          </div>
          <div className="step">
            <i className="fas fa-leaf"></i>
            <p><strong>Step 2:</strong> Choose your preferences.</p>
          </div>
          <div className="step">
            <i className="fas fa-utensils"></i>
            <p><strong>Step 3:</strong> Get instant recipe ideas!</p>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="footer">
        © 2025 Smart Recipe Generator | Made with ❤️ by Harshitha
      </footer>
    </>
  );
}

export default App;
