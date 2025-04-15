// src/pages/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/auth/LogoutButton';
import RoleSwitcher from '../components/RoleSwitcher';
import '../styles/auth.css';
import AuthContext from '../context/AuthContext';
import ActiveRoleContext from '../context/ActiveRoleContext';
import { Grid, Card, CardContent, Typography, Chip, Button, Box, CircularProgress } from '@mui/material';
import CashierPage from './CashierPage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const { token } = useContext(AuthContext);
  const { activeRole } = useContext(ActiveRoleContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

    // fetching the three most recent transactions for the dashboard
    useEffect(() => {
        // Only run if a token is available
        if (!token) return;
        setLoading(true);

        fetch(`${BACKEND_URL}/users/me/transactions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (response) => {
                // Read the response as text first
                const text = await response.text();
                // If text is not empty, parse it as JSON; otherwise return an empty object with a default structure.
                return text ? JSON.parse(text) : { results: [] };
            })
            .then((data) => {
                const allTransactions = data.results || [];
                const recentTransactions = allTransactions.slice(-3).reverse();
                setTransactions(recentTransactions);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching transactions:', error);
            }
        )
    }, [token]);   

    // getting the user name and role
    useEffect(() => {
        if (!token) return;
        setLoading(true);

        fetch(`${BACKEND_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (response) => {
                const text = await response.text();
                return text ? JSON.parse(text) : { results: [] };
            })
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, [token]);

  const chipColour = (type) => {
    switch (type) {
      case 'purchase': return 'success';
      case 'adjustment': return 'error';
      case 'redemption': return 'warning';
      case 'transfer': return 'info';
      case 'event': return 'primary';
      case 'promotion': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1 className="dashboard-title">Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              to="/perks"
              style={{ marginRight: '20px', textDecoration: 'none', color: '#c48f8f', fontWeight: 'bold' }}
            >
              What's New
            </Link>
            <RoleSwitcher />
                        <Link to="/profile" style={{ marginRight: '20px', textDecoration: 'none', color: '#c48f8f', fontWeight: 'bold' }}>
                            Profile
                        </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Main Body */}
      <div className="dashboard-main">
        {/* Welcome Message */}
        {!loading ? (
          <>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Welcome back, {user.name}!
            </Typography>
            <Typography variant="h5" sx={{ mb: 2 }}>
              This is your {activeRole} dashboard.
            </Typography>
          </>
        ) : (
          <Typography variant="h5" sx={{ mb: 2 }}>
            <CircularProgress />
          </Typography>
        )}

        {/* Recent Transactions Section */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Your Recent Transactions
        </Typography>
        {transactions.length > 0 && !loading ? (
          <Grid container spacing={3} sx={{ mb: 2 }}>
            {transactions.map((transaction) => (
              <Grid item xs={12} sm={6} md={4} key={transaction.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">
                      Transaction ID: {transaction.id}
                      <Chip label={transaction.type} color={chipColour(transaction.type)} size="small" sx={{ ml: 1 }} />
                    </Typography>
                    <Typography variant="body2">
                      <strong>Spent:</strong> {transaction.spent || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Amount:</strong> {transaction.amount}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Promotions:</strong> {transaction.promotions || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Remark:</strong> {transaction.remark || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Created by:</strong> {transaction.createdBy}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : transactions.length === 0 && !loading ? (
          <Typography sx={{ mb: 2 }}>No recent transactions available.</Typography>
        ) : (
          <Typography sx={{ mb: 2 }}>
            <CircularProgress />
          </Typography>
        )}

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          <Link
            to="/users/me/transactions?page=1&limit=10&orderBy=id&order=desc"
            style={{ textDecoration: 'none', color: '#c48f8f', fontWeight: 'bold' }}
          >
            View All of Your Transactions
          </Link>
          {activeRole && ['manager', 'superuser'].includes(activeRole) && (
            <Link
              to="/transactions?page=1&limit=10&orderBy=id&order=desc"
              style={{ textDecoration: 'none', color: '#c48f8f', fontWeight: 'bold' }}
            >
              View All Transactions
            </Link>
          )}
          <Link
            to="/promotions"
            style={{ textDecoration: 'none', color: '#c48f8f', fontWeight: 'bold' }}
          >
            View All Promotions
          </Link>
          <Link
            to="/events"
            style={{ textDecoration: 'none', color: '#c48f8f', fontWeight: 'bold' }}
          >
            View All Events
          </Link>
          {activeRole && ['manager', 'superuser'].includes(activeRole) && (
          <Link
            to="/users?page=1&limit=10&orderBy=id&order=asc"
            style={{ textDecoration: 'none', color: '#c48f8f', fontWeight: 'bold' }}
          >
            View All Users
          </Link>
        )}

        <Link to="/transfer" style={{ textDecoration: 'none', color: '#c48f8f', fontWeight: 'bold'}}>
            Transfer Points
        </Link>

        </Box>

        {/* If the active role is cashier, render the cashier functions */}
        {activeRole === 'cashier' && <CashierPage />}
      </div>

    </div>
  );
};

export default Dashboard;
