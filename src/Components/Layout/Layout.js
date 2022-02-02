import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

// layouts
import Header from './Header';
import Footer from './Footer';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: 'calc(100vh - 131px)',
    },
}));

export default function Layout({ children }) {
    const classes = useStyles();


    return (
        <div>
            <Header />
            <Paper elevation={0} className={classes.root}>
                {children}
            </Paper>
            <Footer />
        </div>
    )
}
