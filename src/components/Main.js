import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import { withRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import axios from 'axios';
import _ from 'lodash';

import Topbar from "./Topbar";

const backgroundShape = require("../images/shape.svg");

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#f8f8f8",
    overflow: "hidden",
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    paddingBottom: 200
  },
  grid: {
    width: 1200,
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  rangeLabel: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing(2)
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32
  },
  outlinedButtom: {
    textTransform: "uppercase",
    margin: theme.spacing(1)
  },
  actionButtom: {
    textTransform: "uppercase",
    margin: theme.spacing(1),
    width: 152
  },
  blockCenter: {
    padding: theme.spacing(2),
    textAlign: "center"
  },
  block: {
    padding: theme.spacing(2)
  },
  box: {
    marginBottom: 40,
    height: 65
  },
  inlining: {
    display: "inline-block",
    marginRight: 10
  },
  buttonBar: {
    display: "flex"
  },
  alignRight: {
    display: "flex",
    justifyContent: "flex-end"
  },
  noBorder: {
    borderBottomStyle: "hidden"
  },
  loadingState: {
    opacity: 0.05
  },
  loadingMessage: {
    position: "absolute",
    top: "40%",
    left: "40%"
  }
});

class Main extends Component {
  state = {
    covidData: [],
    expressAPIUrl: process.env.REACT_APP_EXPRESS_API_URL ? process.env.REACT_APP_EXPRESS_API_URL : 'http://localhost:3000',
    covidAPIDomin: 'https://covid19.mathdro.id',
  };

  componentDidMount() {
    const { covidAPIDomin, expressAPIUrl } = this.state;
    axios.get(`${expressAPIUrl}/v1/cases`)
      .then(({ data }) => {
        const sumOfCase = _.sumBy(data, o => o.numberOfCase);
        const sumOfDeath = _.sumBy(data, o => o.numberOfDeath);
        const sumOfRecovered = _.sumBy(data, o => o.numberOfRecovered);
        const todayCase = data.filter(o => this.getCurrentDate(new Date(o.date).toString()) === this.getCurrentDate())[0];

        const khInternalData = {
          order: 0,
          text: "In Cambodia, internal data API",
          data: [
            {
              text: 'Confirmed cases',
              value: sumOfCase,
              color: '#ff9800',
            },
            {
              text: 'Death cases',
              value: sumOfDeath,
              color: 'rgb(236, 49, 75)',        
            },
            {
              text: 'Recovered cases',
              value: sumOfRecovered,
              color: 'rgb(5, 181, 132)',
              percent: (sumOfRecovered * 100) / sumOfCase
            },
          ]
        };

        if (todayCase && todayCase.numberOfCase) {
          khInternalData.data[0].today = todayCase.numberOfCase;
        }
        if (todayCase && todayCase.numberOfDeath) {
          khInternalData.data[1].today = todayCase.numberOfDeath;
        }
        if (todayCase && todayCase.numberOfRecovered) {
          khInternalData.data[2].today = todayCase.numberOfRecovered;
        }

        this.setState({ covidData: [...this.state.covidData, khInternalData] });
      })
      .catch(err => { if (err.response && err.response.data) this.handleError(err.response.data); });

    axios.get(`${covidAPIDomin}/api/countries/KH`)
      .then(({ data }) => {
        const khData = {
          order: 1,
          text: "In Cambodia, Data from Muhammad Mustadi's API",
          data: [
            {
              text: 'Confirmed cases',
              value: data.confirmed.value,
              color: '#ff9800',
            },
            {
              text: 'Death cases',
              value: data.deaths.value,
              color: 'rgb(236, 49, 75)',              
            },
            {
              text: 'Recovered cases',
              value: data.recovered.value,
              color: 'rgb(5, 181, 132)',
              percent: (data.recovered.value * 100) / data.confirmed.value
            },
          ]
        };
        this.setState({ covidData: [...this.state.covidData, khData] });
      })
      .catch(err => console.log(err));

    axios.get(`${this.state.covidAPIDomin}/api`)
      .then(({ data }) => {
        const allData = {
          order: 2,
          text: 'Overall countries',
          data: [
            {
              text: 'Confirmed cases',
              value: data.confirmed.value,
              color: '#ff9800',
            },
            {
              text: 'Death cases',
              value: data.deaths.value,
              color: 'rgb(236, 49, 75)',
            },
            {
              text: 'Recovered cases',
              value: data.recovered.value,
              color: 'rgb(5, 181, 132)',
              percent: (data.recovered.value * 100) / data.confirmed.value
            },
          ]
        };
        this.setState({ covidData: [...this.state.covidData, allData] });
      })
      .catch(err => console.log(err));
  }

  getCurrentDate = (date = '') => {
    const currentDate = date ? new Date(date) : new Date();
    let month = '' + (currentDate.getMonth() + 1);
    let day = '' + currentDate.getDate();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${currentDate.getFullYear()}-${month}-${day}`;
  };

  numberFormat = val => {
    return new Intl.NumberFormat().format(val);
  };

  render() {
    const { classes } = this.props;
    const { covidData } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div className={classes.root}>
          {covidData && covidData.length ? _.orderBy(covidData, ['order'], ['asc']).map(({ text, data }, i) => (
            <React.Fragment key={i}>
              <Typography 
                style={{ marginTop: "3.5rem" }}
                variant="h4"
                align="center"
              >
                {text}
              </Typography>
              <Grid container justify="center">
                <Grid
                  spacing={4}
                  alignItems="center"
                  justify="center"
                  container
                  className={classes.grid}
                >
                  {data && data.length ? data.map(({ text: sub_text, value, color, percent, today }, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Paper className={classes.paper}>
                        <div className={classes.box}>
                          <Typography
                            style={{ textTransform: "capitalize" }}
                            gutterBottom
                            align="center"
                          >
                            {sub_text}
                          </Typography>
                          <Typography 
                            style={{ color }}
                            align="center"
                            variant="h3"
                            gutterBottom
                          >
                            {this.numberFormat(value)}
                          </Typography>
                          <Typography 
                            style={{ color }}
                            align="center"
                            variant="body2"
                            gutterBottom
                          >
                            {today ? `+${this.numberFormat(today)}` : ''}
                            {today && percent ? ', ' : ''}
                            {percent ? `(${percent.toFixed(2)}%)` : ''}
                          </Typography>
                        </div>
                      </Paper>
                    </Grid>
                  )) : ''}
                </Grid>
              </Grid>
            </React.Fragment>
          )) : ''}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(Main));
