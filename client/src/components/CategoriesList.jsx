import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFromServer } from "../api/ServerAPI";

// import "../css/CategoriesList.css";

export default function CategoriesList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await fetchFromServer("categories/", "GET");
        setCategories(result.categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const navigateToCouponsDisplay = (categoryId) => {
    navigate(`/CustomerHome/coupons`, { state: { categoryId } });
  };
  return (
    <div className="categories-container">
      {categories.map((cat) => (
        <div className="category-card" key={cat.id} onClick={() => navigateToCouponsDisplay(cat.id)}>
          <img
            src={`${BASE_URL}${cat.img_url}`}
            alt={cat.name}
            className="category-image"
          />
          <p className="category-name">{cat.name}</p>
        </div>
      ))}
    </div>
  );
}