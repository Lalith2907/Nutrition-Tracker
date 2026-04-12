
import { useState, useEffect } from "react";
import axios from "axios";

function Meal({ userId }) {
  const [mealName, setMealName] = useState("");
  const [mealId, setMealId] = useState("");
  const [foodId, setFoodId] = useState("");
  const [foodName, setFoodName] = useState("");
  const [newFoodName, setNewFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [calorieTarget, setCalorieTarget] = useState("");
  const [proteinTarget, setProteinTarget] = useState("");
  const [carbTarget, setCarbTarget] = useState("");
  const [fatTarget, setFatTarget] = useState("");
  const [newFoodCalories, setNewFoodCalories] = useState("");
  const [modal, setModal] = useState({ open: false, text: '', isError: false });
  const [foodList, setFoodList] = useState([]);
  const [mealList, setMealList] = useState([]);
  // Fetch food and meal list on mount
  const fetchMeals = () => {
    axios.get(`http://localhost:8080/meal/user/${userId}`)
      .then(res => {
        if (Array.isArray(res.data)) setMealList(res.data);
        else setMealList([]);
      })
      .catch(() => setMealList([]));
  };
  useEffect(() => {
    axios.get("http://localhost:8080/food/all")
      .then(res => setFoodList(res.data))
      .catch(() => setFoodList([]));
    fetchMeals();
  }, [userId]);

  const cardStyle = {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    padding: 32,
    margin: "32px auto",
    maxWidth: 420,
    minWidth: 320,
    display: "flex",
    flexDirection: "column",
    gap: 24
  };
  const sectionStyle = { marginBottom: 24 };
  const labelStyle = { fontWeight: 600, marginBottom: 8, display: "block" };
  const inputStyle = {
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #bbb",
    marginRight: 12,
    marginBottom: 8,
    width: "calc(100% - 120px)",
    fontSize: 16
  };
  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: 6,
    border: "none",
    background: "#1976d2",
    color: "#fff",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    marginBottom: 8
  };
  const msgStyle = { color: '#1976d2', fontWeight: 500, minHeight: 24, marginTop: 8 };

  const createMeal = async () => {
    if (!mealName.trim()) {
      setModal({ open: true, text: "Meal name cannot be blank", isError: true });
      return;
    }
    try {
      const meal = { mealType: mealName, member: { userId: userId } };
      const res = await axios.post(
        "http://localhost:8080/meal/create",
        meal,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMealId(res.data.mealId || "");
      setModal({ open: true, text: `Meal created! #${res.data.userMealNumber || '?'}: ${res.data.mealType || ''}`, isError: false });
      fetchMeals(); // Refresh meal list after creating a meal
    } catch (err) {
      let backendMsg = '';
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          backendMsg = err.response.data;
        } else if (err.response.data.message) {
          backendMsg = err.response.data.message;
        }
      }
      if (backendMsg.toLowerCase().includes('meal with this name already exists')) {
        setModal({ open: true, text: "Meal with this name already exists", isError: true });
      } else {
        setModal({ open: true, text: "Meal creation failed", isError: true });
      }
    }
  };

  const addEntry = async () => {
    // Frontend validation for blank fields
    if (!mealId || !foodId || !quantity.trim()) {
      setModal({ open: true, text: "All fields are required for meal entry", isError: true });
      return;
    }
    try {
      await axios.post(`http://localhost:8080/meal/addEntry?mealId=${mealId}&foodId=${foodId}&quantity=${quantity}`);
      setModal({ open: true, text: "Entry added to meal!", isError: false });
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === 'string' && err.response.data.toLowerCase().includes('meal entry for this food already exists')) {
        setModal({ open: true, text: "Meal entry for this food already exists in this meal", isError: true });
      } else {
        setModal({ open: true, text: "Add entry failed", isError: true });
      }
    }
  };

  const setUserGoal = async () => {
    if (!calorieTarget.trim()) {
      setModal({ open: true, text: "Calorie target is required", isError: true });
      return;
    }
    try {
      const goal = {
        calorieTarget: parseFloat(calorieTarget) || 0
      };
      await axios.post(`http://localhost:8080/goal/set?userId=${userId}`, goal, { headers: { 'Content-Type': 'application/json' } });
      setModal({ open: true, text: "Goal set successfully!", isError: false });
    } catch (err) {
      setModal({ open: true, text: "Goal set failed", isError: true });
    }
  };

  return (
    <>
      <div style={cardStyle}>
        <h2 style={{textAlign: "center", marginBottom: 32}}>Meal & Goal Tracking</h2>
        <div style={sectionStyle}>
          <span style={labelStyle}>Create Meal</span>
          <input style={inputStyle} placeholder="Meal Name" value={mealName} onChange={e => setMealName(e.target.value)} />
          <button style={buttonStyle} onClick={createMeal}>Create Meal</button>
        </div>
        <div style={sectionStyle}>
          <span style={labelStyle}>Add Entry to Meal</span>
          <select
            style={{ ...inputStyle, width: '100%' }}
            value={mealId}
            onChange={e => {
              setMealId(e.target.value);
            }}
          >
            <option value="">Select Meal</option>
            {Array.isArray(mealList) && mealList.length > 0 ? mealList.map(meal => (
              <option key={meal.mealId} value={meal.mealId}>
                {meal.mealType || meal.name || `Meal ${meal.mealId}`}
              </option>
            )) : <option disabled>No meals found</option>}
          </select>
          <select
            style={{ ...inputStyle, width: '100%' }}
            value={foodId}
            onChange={e => {
              setFoodId(e.target.value);
              const selected = foodList.find(f => String(f.foodId) === e.target.value);
              setFoodName(selected ? selected.name : "");
            }}
          >
            <option value="">Select Food</option>
            {foodList.map(food => (
              <option key={food.foodId} value={food.foodId}>{food.name}</option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: 0, alignItems: 'center', marginBottom: 8 }}>
            <input style={{ ...inputStyle, flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0, marginBottom: 0 }} placeholder="Food Name" value={newFoodName} onChange={e => setNewFoodName(e.target.value)} />
            <input 
              style={{ ...inputStyle, width: '100px', borderRadius: 0, marginBottom: 0, borderLeft: 'none' }} 
              placeholder="Calories" 
              type="text" 
              value={newFoodCalories} 
              onChange={e => {
                const val = e.target.value;
                if (val === '' || /^[0-9\b]+$/.test(val)) {
                  setNewFoodCalories(val);
                }
              }} 
            />
            <button style={{
              ...buttonStyle,
              minWidth: 120,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              marginLeft: -1,
              marginBottom: 0,
              height: 40
            }}
              onClick={async () => {
                if (!newFoodName.trim() || !newFoodCalories.trim()) {
                  setModal({ open: true, text: "Food name and calories are required", isError: true });
                  return;
                }
                try {
                  const res = await axios.post("http://localhost:8080/food/add", { name: newFoodName, calories: parseFloat(newFoodCalories) });
                  setFoodList([...foodList, res.data]);
                  setNewFoodName("");
                  setNewFoodCalories("");
                  setModal({ open: true, text: "Food added!", isError: false });
                } catch (err) {
                  if (err.response && err.response.data && typeof err.response.data === 'string' && err.response.data.toLowerCase().includes('food with this name already exists')) {
                    setModal({ open: true, text: "Food with this name already exists", isError: true });
                  } else {
                    setModal({ open: true, text: "Failed to add food", isError: true });
                  }
                }
              }}
            >Add Food</button>
          </div>
          {/* Removed duplicate Food Name field as requested */}
          <input style={inputStyle} placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
          <button style={buttonStyle} onClick={addEntry}>Add Entry</button>
        </div>
        <div style={sectionStyle}>
          <span style={labelStyle}>Set Goal</span>
          <input style={inputStyle} type="number" placeholder="Calorie Target" value={calorieTarget} onChange={e => setCalorieTarget(e.target.value)} />
          <button style={buttonStyle} onClick={setUserGoal}>Set Goal</button>
        </div>
      </div>
      {modal.open && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
            padding: 32,
            minWidth: 280,
            maxWidth: 340,
            textAlign: 'center',
            color: modal.isError ? '#d32f2f' : '#1976d2',
            fontWeight: 600,
            fontSize: 18
          }}>
            {modal.text}
            <div style={{marginTop: 24}}>
              <button style={{
                padding: '8px 24px',
                borderRadius: 6,
                border: 'none',
                background: modal.isError ? '#d32f2f' : '#1976d2',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer'
              }} onClick={() => setModal({ ...modal, open: false })}>OK</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Meal;
