// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Button,
//   Typography,
//   Slider,
//   CircularProgress,
// } from "@mui/material";
// import CouponCard from "./CouponCard";
// import { fetchFromServer } from "../api/ServerAPI";
// import { useLocation } from "react-router-dom";

// const sortOptions = [
//   { value: "price_asc", label: "מחיר - מהנמוך לגבוה" },
//   { value: "price_desc", label: "מחיר - מהגבוה לנמוך" },
//   { value: "date_desc", label: "החדש ביותר" },
//   { value: "date_asc", label: "הישן ביותר" },
// ];

// const CouponsDisplay = () => {
//   const location = useLocation();

//   const [categoryId, setCategoryId] = useState(location.state?.categoryId || 0);
//   const [regionId, setRegionId] = useState(0);

//   const [priceRangeInput, setPriceRangeInput] = useState([0, 1000]);
//   const [minPrice, setMinPrice] = useState(0);
//   const [maxPrice, setMaxPrice] = useState(1000);

//   const [sort, setSort] = useState("date_desc");

//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");

//   const [coupons, setCoupons] = useState([]);
//   const [offset, setOffset] = useState(0);
//   const [hasMore, setHasMore] = useState(true);

//   const [loadingFilters, setLoadingFilters] = useState(true);
//   const [loadingCoupons, setLoadingCoupons] = useState(false);

//   const [categoriesList, setCategoriesList] = useState([{ id: 0, name: "כל הקטגוריות" }]);
//   const [regionsList, setRegionsList] = useState([{ id: 0, name: "כל האזורים" }]);

//   const limit = 12;

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       setSearch(searchInput);
//     }, 500);
//     return () => clearTimeout(delayDebounce);
//   }, [searchInput]);

//   const fetchCategories = async () => {
//     try{
//     const data = await fetchFromServer("/categories");
//     setCategoriesList([{ id: 0, name: "כל הקטגוריות" }, ...data.categories]);
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//   };
//   }
//   const fetchRegions = async () => {
//     try{
//     const data = await fetchFromServer("/regions");
//     setRegionsList([{ id: 0, name: "כל האזורים" }, ...data.regions]);
//   } catch (error) {
//     console.error("Error fetching regions:", error);  }
//   };

//   const fetchCoupons = useCallback(
//     async (loadMore = false) => {
//       if (loadingCoupons || (!hasMore && loadMore)) return;

//       setLoadingCoupons(true);

//       try {
//         const params = {
//           categoryId: categoryId === 0 ? undefined : categoryId,
//           regionId: regionId === 0 ? undefined : regionId,
//           minPrice,
//           maxPrice,
//           search,
//           sort,
//           limit,
//           offset: loadMore ? offset : 0,
//         };

//         Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);

//         const queryString = new URLSearchParams(params).toString();
//         const data = await fetchFromServer(`/coupons?${queryString}`);

//         if (loadMore) {
//           setCoupons((prev) => [...prev, ...data]);
//           setOffset((prev) => prev + data.length);
//         } else {
//           setCoupons(data);
//           setOffset(data.length);
//         }

//         setHasMore(data.length === limit);
//       } catch (error) {
//         console.error("Error fetching coupons:", error);
//       } finally {
//         setLoadingCoupons(false);
//       }
//     },
//     [categoryId, regionId, minPrice, maxPrice, search, sort, offset, loadingCoupons, hasMore]
//   );

//   useEffect(() => {
//     const fetchFilters = async () => {
//       setLoadingFilters(true);
//       await Promise.all([fetchCategories(), fetchRegions()]);
//       setLoadingFilters(false);
//     };
//     fetchFilters();
//   }, []);

//   useEffect(() => {
//     if (!loadingFilters) {
//       setOffset(0);
//       setHasMore(true);
//       fetchCoupons(false);
//     }
//   }, [categoryId, regionId, minPrice, maxPrice, search, sort, loadingFilters]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + window.scrollY >= document.body.offsetHeight - 150 &&
//         !loadingCoupons &&
//         hasMore
//       ) {
//         fetchCoupons(true);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [fetchCoupons, loadingCoupons, hasMore]);

//   const resetFilters = () => {
//     setCategoryId(0);
//     setRegionId(0);
//     setPriceRangeInput([0, 1000]);
//     setMinPrice(0);
//     setMaxPrice(1000);
//     setSearchInput("");
//     setSort("date_desc");
//     setOffset(0);
//     setHasMore(true);
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
//         קופונים פעילים
//       </Typography>

//       {loadingFilters ? (
//         <Box sx={{ textAlign: "center", mt: 5 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <>
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4, alignItems: "center" }}>
//             <FormControl sx={{ minWidth: 140 }}>
//               <InputLabel id="category-label">קטגוריה</InputLabel>
//               <Select
//                 labelId="category-label"
//                 value={categoryId}
//                 label="קטגוריה"
//                 onChange={(e) => setCategoryId(Number(e.target.value))}
//               >
//                 {categoriesList.map((cat) => (
//                   <MenuItem key={cat.id} value={cat.id}>
//                     {cat.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl sx={{ minWidth: 140 }}>
//               <InputLabel id="region-label">אזור</InputLabel>
//               <Select
//                 labelId="region-label"
//                 value={regionId}
//                 label="אזור"
//                 onChange={(e) => setRegionId(Number(e.target.value))}
//               >
//                 {regionsList.map((region) => (
//                   <MenuItem key={region.id} value={region.id}>
//                     {region.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <Box sx={{ width: 200 }}>
//               <Typography variant="caption" gutterBottom>
//                 טווח מחיר: ₪{priceRangeInput[0]} - ₪{priceRangeInput[1]}
//               </Typography>
//               <Slider
//                 value={priceRangeInput}
//                 onChange={(_, newValue) => setPriceRangeInput(newValue)}
//                 onChangeCommitted={(_, newValue) => {
//                   const [newMin, newMax] = newValue;
//                   setMinPrice(newMin);
//                   setMaxPrice(newMax);
//                 }}
//                 valueLabelDisplay="auto"
//                 min={0}
//                 max={1000}
//               />
//             </Box>

//             <TextField
//               label="חיפוש חופשי"
//               variant="outlined"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               sx={{ minWidth: 200 }}
//             />

//             <FormControl sx={{ minWidth: 180 }}>
//               <InputLabel id="sort-label">מיון</InputLabel>
//               <Select
//                 labelId="sort-label"
//                 value={sort}
//                 label="מיון"
//                 onChange={(e) => setSort(e.target.value)}
//               >
//                 {sortOptions.map((opt) => (
//                   <MenuItem key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <Button variant="outlined" onClick={resetFilters}>
//               איפוס סינון
//             </Button>
//           </Box>

//           {coupons.length === 0 && !loadingCoupons ? (
//             <Typography variant="body1" sx={{ mt: 5, textAlign: "center" }}>
//               לא נמצאו קופונים מתאימים.
//             </Typography>
//           ) : (
//             <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
//               {coupons.map((coupon) => (
//                 <CouponCard key={coupon.id} coupon={coupon} />
//               ))}
//             </Box>
//           )}

//           {loadingCoupons && (
//             <Box sx={{ textAlign: "center", mt: 3 }}>
//               <CircularProgress />
//             </Box>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default CouponsDisplay;
import React, { useEffect, useState, useCallback } from "react";
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
import { useLocation } from "react-router-dom";

const sortOptions = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
];

const CouponsDisplay = () => {
  const location = useLocation();
  const limit = parseInt(import.meta.env.VITE_DEFAULT_LIMIT_COUPON, 10);
  const specialOnly = location.state?.specialOnly || false;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [categoryId, setCategoryId] = useState(location.state?.categoryId || 0);
  const [regionId, setRegionId] = useState(0);
  const [priceRangeInput, setPriceRangeInput] = useState([0, 1000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sort, setSort] = useState("date_desc");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [categoriesList, setCategoriesList] = useState([{ id: 0, name: "All Categories" }]);
  const [regionsList, setRegionsList] = useState([{ id: 0, name: "All Regions" }]);


  useEffect(() => {
    const delayDebounce = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

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

  const fetchCoupons = useCallback(
    async (loadMore = false) => {
      if (loadingCoupons || (!hasMore && loadMore)) return;

      setLoadingCoupons(true);
      try {
        const params = {
          categoryId: categoryId === 0 ? undefined : categoryId,
          regionId: regionId === 0 ? undefined : regionId,
          minPrice,
          maxPrice,
          search,
          sort,
          page: loadMore ? page + 1 : 1,
        };

        Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);
        const queryString = new URLSearchParams(params).toString();
        const data = await fetchFromServer(`/coupons?${queryString}`);

        if (loadMore) {
          setCoupons((prev) => {
            const existingIds = new Set(prev.map(c => c.id));
            const newCoupons = data.filter(c => !existingIds.has(c.id));
            return [...prev, ...newCoupons];
          });
          setPage((prev) => prev + 1);
        } else {
          setCoupons(data);
          setPage(1);
        }

        setHasMore(data.length === limit);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoadingCoupons(false);
      }
    },
    [categoryId, regionId, minPrice, maxPrice, search, sort, loadingCoupons, hasMore]
  );

  const fetchSpecialCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const params = {
        birth_date: currentUser.birth_date,
        region_id: currentUser.region_id
      }
      const data = await fetchFromServer("/coupons/recommendedCoupons", "POST", params);
      setCoupons(data.recommended);
      setHasMore(false);
    } catch (error) {
      console.error("Error fetching special coupons:", error);
    } finally {
      setLoadingCoupons(false);
    }
  };

  useEffect(() => {
    const fetchFilters = async () => {
      setLoadingFilters(true);
      await Promise.all([fetchCategories(), fetchRegions()]);
      setLoadingFilters(false);
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    if (!loadingFilters) {
      if (specialOnly) {
        fetchSpecialCoupons();
      } else {
        setHasMore(true);
        fetchCoupons(false);
      }
    }
  }, [categoryId, regionId, minPrice, maxPrice, search, sort, loadingFilters, specialOnly]);

  useEffect(() => {
    if (specialOnly) return; // אין scroll אינסופי למומלצים
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 150 &&
        !loadingCoupons &&
        hasMore
      ) {
        fetchCoupons(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchCoupons, loadingCoupons, hasMore, specialOnly]);

  const resetFilters = () => {
    setCategoryId(0);
    setRegionId(0);
    setPriceRangeInput([0, 1000]);
    setMinPrice(0);
    setMaxPrice(1000);
    setSearchInput("");
    setSort("date_desc");
    setPage(1);
    setHasMore(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        {specialOnly ? "קופונים מומלצים במיוחד בשבילך" : "קופונים פעילים"}
      </Typography>

      {loadingFilters ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {(
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4, alignItems: "center" }}>
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
                  טווח מחיר: ₪{priceRangeInput[0]} - ₪{priceRangeInput[1]}
                </Typography>
                <Slider
                  value={priceRangeInput}
                  onChange={(_, newValue) => setPriceRangeInput(newValue)}
                  onChangeCommitted={(_, newValue) => {
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
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

              <Button variant="outlined" onClick={resetFilters}>
                איפוס סינון
              </Button>
            </Box>
          )}

          {coupons.length === 0 && !loadingCoupons ? (
            <Typography variant="body1" sx={{ mt: 5, textAlign: "center" }}>
              No matching coupons found.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
              {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </Box>
          )}

          {loadingCoupons && (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {!hasMore && (
            <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "gray" }}>
              All coupons loaded.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default CouponsDisplay;
