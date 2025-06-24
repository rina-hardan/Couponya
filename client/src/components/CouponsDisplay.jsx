import React, { useEffect, useState } from "react";
import { useNavigate ,useLocation} from "react-router-dom";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Slider,
  CircularProgress,
} from "@mui/material";
import CouponCard from "./CouponCard";
import { fetchFromServer } from "../api/ServerAPI";

const sortOptions = [
  { value: "price_asc", label: "מחיר - מהנמוך לגבוה" },
  { value: "price_desc", label: "מחיר - מהגבוה לנמוך" },
  { value: "date_desc", label: "החדש ביותר" },
  { value: "date_asc", label: "הישן ביותר" },
];

const CouponsDisplay = () => {
    const location = useLocation();

  const [categoryId, setCategoryId] = useState(location.state?.categoryId || 0);
  const [regionId, setRegionId] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date_desc");
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  const [categoriesList, setCategoriesList] = useState([{ id: 0, name: "כל הקטגוריות" }]);
  const [regionsList, setRegionsList] = useState([{ id: 0, name: "כל האזורים" }]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  const fetchCategories = async () => {
    try {
      const data = await fetchFromServer("/categories");
      setCategoriesList([{ id: 0, name: "כל הקטגוריות" }, ...data.categories]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchRegions = async () => {
    try {
      const data = await fetchFromServer("/regions");
      setRegionsList([{ id: 0, name: "כל האזורים" }, ...data.regions]);
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  const fetchCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const params = {
        categoryId: categoryId === 0 ? undefined : categoryId,
        regionId: regionId === 0 ? undefined : regionId,
        minPrice,
        maxPrice,
        search,
        sort,
        limit: 50,
        offset: 0,
      };

      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key]
      );

      const queryString = new URLSearchParams(params).toString();
      const data = await fetchFromServer(`/coupons?${queryString}`);
      setCoupons(data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setCoupons([]);
    }
    setLoadingCoupons(false);
  };

  useEffect(() => {
    async function fetchFilters() {
      setLoadingFilters(true);
      await Promise.all([fetchCategories(), fetchRegions()]);
      setLoadingFilters(false);
    }
    fetchFilters();
  }, []);

  useEffect(() => {
    if (!loadingFilters) {
      fetchCoupons();
    }
  }, [categoryId, regionId, minPrice, maxPrice, search, sort, loadingFilters]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        קופונים פעילים
      </Typography>

      {loadingFilters ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mb: 4,
              alignItems: "center",
            }}
          >
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel id="category-label">קטגוריה</InputLabel>
              <Select
                labelId="category-label"
                value={categoryId}
                label="קטגוריה"
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                {categoriesList.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel id="region-label">אזור</InputLabel>
              <Select
                labelId="region-label"
                value={regionId}
                label="אזור"
                onChange={(e) => setRegionId(Number(e.target.value))}
              >
                {regionsList.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {region.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ width: 200 }}>
              <Typography variant="caption" gutterBottom>
                טווח מחיר: ₪{minPrice} - ₪{maxPrice}
              </Typography>
              <Slider
                getAriaLabel={() => "טווח מחיר"}
                value={[minPrice, maxPrice]}
                onChange={(_, newValue) => {
                  const [newMin, newMax] = newValue;
                  setMinPrice(newMin);
                  setMaxPrice(newMax);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
              />
            </Box>

            <TextField
              label="חיפוש חופשי"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 200 }}
            />

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="sort-label">מיון</InputLabel>
              <Select
                labelId="sort-label"
                value={sort}
                label="מיון"
                onChange={(e) => setSort(e.target.value)}
              >
                {sortOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={() => {
                setCategoryId(0);
                setRegionId(0);
                setMinPrice(0);
                setMaxPrice(1000);
                setSearch("");
                setSort("date_desc");
              }}
            >
              איפוס סינון
            </Button>
          </Box>

          {loadingCoupons ? (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : coupons.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 5, textAlign: "center" }}>
              לא נמצאו קופונים מתאימים.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
              }}
            >
              {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default CouponsDisplay;
