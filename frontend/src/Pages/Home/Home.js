import "./home.css";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Table, Form, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa"; // ✅ Import trash icon
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  // 💰 Financial Summary States
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // 📝 Transaction Form State
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: "",
    type: "expense",
    date: "",
  });

  const categoryOptions = [
    "Salary", "Food", "Rent", "Shopping", "Health", "Entertainment",
    "Bonuses", "Investments", "Groceries", "Insurance", "Gifts received", "Books"
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (!user._id) {
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
      fetchTransactions(user._id);
    } catch (error) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const fetchTransactions = async (userId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/transactions/user/${userId}`);
      setTransactions(data.transactions);
      setTotalIncome(data.totalIncome || 0);
      setTotalExpenses(data.totalExpense || 0);
      setTotalBalance(data.totalBalance || 0);
    } catch (err) {
      toast.error("Failed to fetch transactions.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser._id) {
      toast.error("User not found. Please log in again.");
      return;
    }

    try {
      const newTransaction = { ...formData, userId: storedUser._id };
      await axios.post("http://localhost:5000/api/transactions/add", newTransaction);
      toast.success("Transaction added successfully!");
      setFormData({ category: "", description: "", amount: "", type: "expense", date: "" });
      fetchTransactions(storedUser._id);
    } catch (error) {
      toast.error("Error adding transaction.");
    }
  };

  const handleDelete = async (transactionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${transactionId}`);
      toast.success("Transaction deleted successfully!");
      setTransactions((prev) => prev.filter((transaction) => transaction._id !== transactionId));

      const updatedTransactions = transactions.filter((transaction) => transaction._id !== transactionId);
      const income = updatedTransactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
      const expense = updatedTransactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
      setTotalIncome(income);
      setTotalExpenses(expense);
      setTotalBalance(income - expense);
      
    } catch (error) {
      toast.error("Error deleting transaction.");
    }
  };

  return (
    <>
      <Header />
      <Container className="mt-3">
        {/* 💰 Financial Summary Section */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="p-3 text-white bg-dark">
              <h5>Total Balance</h5>
              <h2>₹{totalBalance}</h2>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="p-3 text-white bg-success">
              <h5>Total Income</h5>
              <h2>+₹{totalIncome}</h2>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="p-3 text-white bg-danger">
              <h5>Total Expenses</h5>
              <h2>-₹{totalExpenses}</h2>
            </Card>
          </Col>
        </Row>

        {/* 📝 Add Transaction Form */}
        <Card className="p-4 mb-4">
          <h4>Add Transaction</h4>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="category" onChange={handleChange} value={formData.category} required>
                    <option value="">Select Category</option>
                    {categoryOptions.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" onChange={handleChange} value={formData.description} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control type="number" name="amount" onChange={handleChange} value={formData.amount} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Type</Form.Label>
                  <Form.Select name="type" onChange={handleChange} value={formData.type} required>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" name="date" onChange={handleChange} value={formData.date} required />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="mt-3">Add Transaction</Button>
          </Form>
        </Card>

        {/* 📜 Transaction Table */}
        <Card className="p-3">
          <h4 className="text-center">Transaction History</h4>
          {transactions.length === 0 ? (
            <p className="text-center text-light">No transactions yet.</p>
          ) : (
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.description}</td>
                    <td>₹{transaction.amount}</td>
                    <td>{transaction.type}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(transaction._id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <ToastContainer />
      </Container>
    </>
  );
};

export default Home;
