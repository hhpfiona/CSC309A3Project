import { useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";
import LogoutButton from "../../components/auth/LogoutButton";
import "../../styles/auth.css";
import TransactionTable from "../../components/TransactionTable";
import { Container } from "@mui/material";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const PastTransactions = () => {
    const { token } = useContext(AuthContext);
    
    const fetchTransactions = async (filters) => {
        // reset the filters
        // window.history.pushState(null, '', `/users/me/transactions?`); 
        
        // build the query string from filters
        const queryString = {};
        Object.keys(filters).forEach(key => {
            if (filters[key] !== '') {
                queryString[key] = filters[key];
            }
        });
        const query = new URLSearchParams(queryString).toString();
        // window.history.pushState(null, '', `/users/me/transactions?${query}`); 

        const newUrl = `/users/me/transactions?${query ? `${query}` : ''}`;

        if (window.location.pathname + window.location.search !== newUrl) {
            window.history.pushState(null, '', newUrl);
        }

        // fetch the transactions with the filters applied
        const response = await fetch(`${BACKEND_URL}/users/me/transactions?${query}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            console.error(response);
            throw new Error('Failed to fetch transactions');
        }

        return await response.json();
    }; 

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-content">
                    <h1 className="dashboard-title">Past Transactions</h1>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/dashboard" style={{ marginRight: '20px', textDecoration: 'none', color: '#c48f8f', fontWeight: 'bold' }}>
                        Dashboard
                        </Link>
                        <Link to="/perks" style={{ marginRight: '20px', textDecoration: 'none', color: '#c48f8f', fontWeight: 'bold' }}>
                        What's New
                        </Link>
                        <LogoutButton />
                    </div>
                </div>
            </nav>

            <Container maxWidth="lg" sx={{ padding: 1 }}>
                <TransactionTable
                    fetchFunction={fetchTransactions}
                    title="Your Transaction History"
                />
            </Container>
        </div>
    );
};

export default PastTransactions;