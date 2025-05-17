// Category.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [usedCategories, setUsedCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchUsedCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/auth/api/category/categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error(`Error fetching categories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsedCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/auth/api/category/used-categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch used categories");
      const data = await response.json();
      console.log('Used Categories Data:', data); // Debug log
      setUsedCategories(data);
    } catch (error) {
      toast.error(`Error fetching used categories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warn("Category name is required!");
      return;
    }

    setLoading(true);
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:5000/auth/api/category/categories/${editId}`
      : "http://localhost:5000/auth/api/category/categories";
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({ name, description }),
      });
      if (!response.ok) throw new Error(`Failed to ${editId ? "update" : "add"} category`);
      setName("");
      setDescription("");
      setEditId(null);
      fetchCategories();
      fetchUsedCategories();
      toast.success(`Category ${editId ? "updated" : "added"} successfully!`);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setName(category.name);
    setDescription(category.description || "");
    setEditId(category.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/auth/api/category/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      if (!response.ok) throw new Error("Failed to delete category");
      fetchCategories();
      fetchUsedCategories();
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error(`Delete failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (filteredCategories.length === 0) {
      toast.warn("No categories to generate a report.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Category List", 14, 15);
    doc.autoTable({
      head: [["ID", "Name", "Description", "Created At", "Updated At"]],
      body: filteredCategories.map((category) => [
        category.id,
        category.name,
        category.description || "N/A",
        new Date(category.created_at).toLocaleString(),
        new Date(category.updated_at).toLocaleString(),
      ]),
      startY: 25,
      styles: { fontSize: 10, cellPadding: 5 },
      theme: "grid",
    });
    doc.save("category_list.pdf");
    toast.success("PDF generated successfully!");
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredUsedCategories = usedCategories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const Navbar = () => (
    <nav className="navbar">
      <button onClick={() => navigate("/login")} aria-label="Logout">
        Logout
      </button>
    </nav>
  );

  const CategoryRow = ({ category }) => (
    <tr>
      <td>{category.id}</td>
      <td>{category.name}</td>
      <td>{category.description || "N/A"}</td>
      <td>{new Date(category.created_at).toLocaleString()}</td>
      <td>{new Date(category.updated_at).toLocaleString()}</td>
      <td>
        <div className="category-buttons">
          <button onClick={() => handleEdit(category)} aria-label={`Edit ${category.name}`}>
            Edit
          </button>
          <button onClick={() => handleDelete(category.id)} aria-label={`Delete ${category.name}`}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="category-container">
      <Navbar />
      <h1>Category Management</h1>
      {loading && <div className="loader">Loading...</div>}
      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-group">
          <label htmlFor="category-name">Category Name:</label>
          <input
            id="category-name"
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
            aria-label="Category name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category-description">Description:</label>
          <textarea
            id="category-description"
            placeholder="Enter description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            aria-label="Category description"
          />
        </div>
        <button type="submit" disabled={loading} aria-label={editId ? "Update category" : "Add category"}>
          {editId ? "Update" : "Add"} Category
        </button>
      </form>
      <div className="controls">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Search categories"
        />
        <button onClick={generatePDF} className="pdf-button" disabled={loading} aria-label="Generate PDF">
         📄 Generate Report
        </button>
      </div>

      <h2>All Categories</h2>
      {filteredCategories.length === 0 && !loading ? (
        <div className="no-categories">
          {searchTerm ? "No matching categories found." : "No categories available."}
        </div>
      ) : (
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <CategoryRow key={category.id} category={category} />
            ))}
          </tbody>
        </table>
      )}

      <h2>Used Categories</h2>
      {filteredUsedCategories.length === 0 && !loading ? (
        <div className="no-categories">
          {searchTerm ? "No matching used categories found." : "No categories are currently used in tasks."}
        </div>
      ) : (
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Task Count</th>
              <th>Tasks</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsedCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description || "N/A"}</td>
                <td className="task-count">{category.task_count}</td>
                <td>{category.task_titles || "No tasks assigned"}</td>
                <td>{new Date(category.created_at).toLocaleString()}</td>
                <td>{new Date(category.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Category;