import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CircularProgress,
} from "@mui/material";
import { fetchFromServer } from "../api/ServerAPI";

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [adding, setAdding] = useState(false);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await fetchFromServer("/categories");
            setCategories(data.categories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!name) return alert("נא להזין שם קטגוריה");
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        setAdding(true);
        try {
            const response = await fetchFromServer("/categories/create", "POST", formData);

            if (response?.id) {
                setCategories((prev) => [...prev, response]); 
                setName("");
                setImage(null);
            } else {
                console.error("Failed to add category:", response?.error || "Unknown error");
                alert(response?.error || "שגיאה בהוספת הקטגוריה");
            }
        } catch (error) {
            console.error("Error adding category:", error);
            alert(error.message || "שגיאה בהוספת הקטגוריה");
        } finally {
            setAdding(false);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                ניהול קטגוריות
            </Typography>

            <Box component="form" onSubmit={handleAddCategory} sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                        <TextField
                            label="שם קטגוריה"
                            fullWidth
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button variant="contained" component="label" fullWidth>
                            העלאת תמונה
                            <input
                                type="file"
                                name="img_url"
                                id="img_url"
                                accept="image/*"
                                hidden
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </Button>
                        {image && (
                            <Typography variant="caption" display="block" mt={1}>
                                {image.name}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={adding}
                        >
                            {adding ? "מוסיף..." : "הוסף קטגוריה"}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {loading ? (
                <Box sx={{ textAlign: "center", mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {categories.map((cat) => (
                        <Grid item xs={12} sm={6} md={4} key={cat.id}>
                            <Card>
                                {cat.img_url && (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={`${BASE_URL}${cat.img_url}`}
                                        alt={cat.name}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6">{cat.name}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default ManageCategories;
