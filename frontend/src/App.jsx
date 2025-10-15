import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import "/node_modules/@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [ingredients, setIngredients] = useState("");
  const [diet, setDiet] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setRecipes([]);

    
    try {
      const response = await axios.post("https://smartrecipegenerator-backend.onrender.com/generate", {
        ingredients: ingredients.split(",").map((i) => i.trim()),
        diet,
      });

      if (Array.isArray(response.data)) setRecipes(response.data);
      else setError("No recipes found.");
    } catch {
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      {/* ---------- NAVBAR ---------- */}
      <nav className="navbar">🥘 Smart Recipe Generator</nav>

      {/* ---------- MAIN CARD ---------- */}
      <div className="generator-container">
        <h1>Find Recipes Instantly</h1>
        <p className="subtitle">
          Enter your ingredients and we’ll find matching dishes for you.
        </p>

        {/* ---------- TEXT INPUT FORM ---------- */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="e.g., rice, carrot, tomato"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />

          <select value={diet} onChange={(e) => setDiet(e.target.value)}>
            <option value="">No Preference</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
          </select>

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
                src={`https://source.unsplash.com/400x300/?${r.name.replace(
                  " ",
                  "-"
                )},food`}
                alt={r.name}
                className="recipe-img"
              />
              <div className="recipe-body">
                <h2 className="recipe-title">{r.name}</h2>
                <p className="recipe-details">
                  <strong>Calories:</strong> {r.calories} kcal |{" "}
                  <strong>Time:</strong> {r.time} min
                </p>
                <p className="recipe-details">
                  <strong>Ingredients:</strong> {r.ingredients.join(", ")}
                </p>
                <p className="instructions">{r.instructions}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <i className="fas fa-pencil-alt"></i>
            <p>
              <strong>Step 1:</strong> Enter your ingredients.
            </p>
          </div>
          <div className="step">
            <i className="fas fa-leaf"></i>
            <p>
              <strong>Step 2:</strong> Choose diet preference.
            </p>
          </div>
          <div className="step">
            <i className="fas fa-utensils"></i>
            <p>
              <strong>Step 3:</strong> Get instant recipe ideas!
            </p>
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIAL ---------- */}
      <div className="testimonial">
        “This is a game-changer for busy weeknights!  
        I finally know what to do with the random vegetables in my fridge.”
        <strong>– A Happy Home Cook</strong>
      </div>

      {/* ---------- FOOTER ---------- */}
      <footer className="footer">
        © 2025 Smart Recipe Generator | Made with ❤️ by Harshitha
      </footer>
    </>
  );
}

export default App;
