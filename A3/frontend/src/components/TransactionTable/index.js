
import { useEffect, useState } from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, TextField, MenuItem, Stack, Chip,
    IconButton, CircularProgress, Pagination, Alert
} from "@mui/material";
import { FilterList as FilterListIcon } from '@mui/icons-material';

// Dropdown constants
const transactionTypes = [
    { value: 'adjustment', label: 'Adjustment' },
    { value: 'purchase', label: 'Purchase' },
    { value: 'redemption', label: 'Redemption' },
    { value: 'event', label: 'Event' },
    { value: 'promotion', label: 'Promotion' },
    { value: 'transfer', label: 'Transfer' }
];

const operators = [
    { value: 'gte', label: 'Greater than or equal to amount' },
    { value: 'lte', label: 'Less than or equal to amount' },
];

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

const TransactionTable = ({
    fetchFunction,
    onRowClick = null,
    title = "",
    columns = [], // additional columns for the manager transaction list
    additionalFilters = null,
}) => {
    const [filters, setFilters] = useState({
        type: '',
        relatedId: '',
        promotionId: '',
        amount: '',
        operator: '',
        page: 1,
        limit: 10
    });

    const [transactions, setTransactions] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [clearFilter, setClearFilter] = useState(false);

    const fetchTransactions = async () => {
        if (!validateSearch(filters)) {
            return;
        }


        setLoading(true);
        setError(null);
        try {
            const { results, count } = await fetchFunction(filters);
            setTransactions(results);
            setCount(Math.ceil(count / limit) || 1);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, limit]);

    const handleSearch = () => {
        setPage(1);
        setFilters({ ...filters, page: 1 });
        fetchTransactions();
    };

    const validateSearch = (filters) => {
        if (filters.amount !== '' && filters.operator === '') {
            alert('Please select an operator for the amount filter.');
            return false;
        }
        if (filters.operator !== '' && filters.amount === '') {
            alert('Please select an amount for the operator.');
            return false;
        }
        return true;
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        setFilters({ ...filters, page: value });
    };

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(1);
        setFilters({ ...filters, page: 1, limit: parseInt(event.target.value, 10) });
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const clearFilters = () => {
        setPage(1);
        setFilters({
            type: '',
            relatedId: '',
            promotionId: '',
            amount: '',
            operator: '',
            page: 1,
            limit: limit
        });

        setClearFilter(true);
    };

    useEffect(() => {
        fetchTransactions();
    }, [clearFilter]);

    const defaultColumns = [
        { key: 'id', label: 'Transaction ID' },
        {
            key: 'type',
            label: 'Type',
            render: (value) => (
                <Chip
                    label={value}
                    color={chipColour(value)}
                    size="small"
                    sx={{ marginLeft: '10px' }}
                />
            )
        },
        { key: 'spent', label: 'Spent', render: (value) => value || 'N/A' },
        { key: 'promotionId', label: 'Promotion IDs', render: (value) => value || 'N/A' },
        { key: 'relatedId', label: 'Related ID', render: (value) => value || 'N/A' },
        { key: 'amount', label: 'Amount', render: (value) => value || 'N/A' },
        { key: 'remark', label: 'Remark', render: (value) => value || 'N/A' },
        { key: 'createdBy', label: 'Created By' },
    ];

    const mergedColumns = [...defaultColumns, ...columns];
    // const paginatedTransactions = transactions.slice((page - 1) * limit, page * limit);

    return (
        <div className="transactions-container">
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>{title}</Typography>
            </Box>

            <Box sx={{ gap: 2 }}>
                <IconButton
                    color={showFilters ? 'primary' : 'default'}
                    onClick={toggleFilters}
                    aria-label="toggle filters"
                >
                    <Typography variant="body1" marginRight={5}>Filters</Typography>
                    <FilterListIcon />
                </IconButton>

                {showFilters && (
                    <Box
                        component="form"
                        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, mt: 2 }}
                    >
                        <TextField
                            select label="Type" value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            helperText="Select transaction type"
                        >
                            {transactionTypes.map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Related ID" type="number" value={filters.relatedId}
                            onChange={(e) => setFilters({ ...filters, relatedId: e.target.value })}
                            helperText="Enter related ID"
                        />

                        <TextField
                            label="Promotion ID" type="number" value={filters.promotionId}
                            onChange={(e) => setFilters({ ...filters, promotionId: e.target.value })}
                            helperText="Enter promotion ID"
                        />

                        <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                            <TextField
                                label="Amount" type="number" value={filters.amount}
                                onChange={(e) => setFilters({ ...filters, amount: e.target.value })}
                                helperText="Enter amount"
                            />

                            <TextField
                                select label="Operator" value={filters.operator}
                                onChange={(e) => setFilters({ ...filters, operator: e.target.value })}
                                helperText="Select operator"
                            >
                                {operators.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </TextField>
                        </Stack>

                        {additionalFilters && additionalFilters(filters, setFilters)}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Chip
                                label="Clear Filters"
                                variant="outlined"
                                onClick={clearFilters}
                                sx={{ cursor: 'pointer' }}
                            />
                        </Box>

                        <Button variant="contained" onClick={handleSearch}>
                            Search
                        </Button>
                    </Box>
                )}
            </Box>

            <TableContainer component={Paper} sx={{ marginTop: 2, overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {mergedColumns.map(col => (
                                <TableCell key={col.key}>{col.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={mergedColumns.length} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : error ? (
                            <TableRow><TableCell colSpan={mergedColumns.length} align="center">Error: {error.message}</TableCell></TableRow>
                        ) : transactions.length === 0 ? (
                            <TableRow><TableCell colSpan={mergedColumns.length} align="center">No transactions found</TableCell></TableRow>
                        ) : (
                            transactions.map((t) => (
                                <TableRow key={t.id} hover onClick={() => onRowClick?.(t)}>
                                    {mergedColumns.map(col => (
                                        <TableCell key={col.key}>
                                            {col.render ? col.render(t[col.key], t) : t[col.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                    count={count}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />

                <TextField
                    type="number"
                    label="Rows per page"
                    variant="outlined"
                    value={limit}
                    onChange={handleLimitChange}
                    sx={{ marginLeft: 2 }}
                />
            </Box>
        </div>
    );
};

export default TransactionTable;
