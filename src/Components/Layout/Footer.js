import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    footer: {
        background: theme.palette.primary.light,
    },
}));

export default function Footer() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.footer}>
                <Toolbar variant="dense">
                    <Typography variant="body1" color="inherit">
                        Copyright &#169; 2021 MINETECH. All Rights Reserved.
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}
