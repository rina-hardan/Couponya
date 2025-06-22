import React, { useEffect, useState } from "react";
import { fetchFromServer } from "../api/ServerAPI";
// import "../css/CategoriesList.css";

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await fetchFromServer("categories/", "GET");
        setCategories(result.categories);
        console.log("Categories fetched successfully:", result.categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="categories-container">
      {categories.map((cat) => (
        <div className="category-card" key={cat.id}>
          <img
            alt={cat.name}
            className="category-image"
          />
          <p className="category-name">{cat.name}</p>
        </div>
      ))}
    </div>
  );
}