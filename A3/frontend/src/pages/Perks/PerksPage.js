import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import LogoutButton from '../../components/auth/LogoutButton';
import PromotionsList from './Promotions/PromotionsList';
import EventsList from './Events/EventsList';
import '../../styles/auth.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`perks-tabpanel-${index}`}
      aria-labelledby={`perks-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PerksPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1 className="dashboard-title">What's New</h1>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/dashboard" style={{ marginRight: '20px', textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
              Dashboard
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>
      
      <Container className="dashboard-main">
        <Box sx={{ width: '100%', mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            What's New
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="perks tabs"
            >
              <Tab label="Promotions" id="perks-tab-0" aria-controls="perks-tabpanel-0" />
              <Tab label="Events" id="perks-tab-1" aria-controls="perks-tabpanel-1" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/promotions/create"
              >
                Create Promotion
              </Button>
            </Box>
            <PromotionsList />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/events/create"
              >
                Create Event
              </Button>
            </Box>
            <EventsList />
          </TabPanel>
        </Box>
      </Container>
    </div>
  );
};

export default PerksPage;
