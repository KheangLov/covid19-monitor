import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import CardItem from "./cards/CardItem";
import Topbar from "./Topbar";
import SectionHeader from "./typo/SectionHeader";
const backgroundShape = require("../images/shape.svg");

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["A500"],
    overflow: "hidden",
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    marginTop: 20,
    padding: 20,
    paddingBottom: 200
  },
  grid: {
    width: 1000
  },
});

class Cards extends Component {
  state = {
    totalEntries: 0,
    perPage: 0,
  };

  getFromChild = value => this.setState({ ...value });

  render() {
    const { totalEntries, perPage } = this.state;
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;
    const totalEntriesText = `List cases (total: ${totalEntries}, show: ${perPage})`;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid
              spacing={10}
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Grid item xs={12} style={{ paddingBottom: 0 }}>
                <CardItem type="form" />
              </Grid>
              <Grid item xs={12}>
                <SectionHeader
                  title={totalEntriesText}
                  subtitle="All cases from internal data"
                />
                <CardItem getFromChild={this.getFromChild} />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Cards);