import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import { withRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from 'axios';
import _ from 'lodash';
import inMemoryJWTManager from '../inMemoryJwt';

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
    loading: true,
  };

  async componentDidMount() {
    if (inMemoryJWTManager.getCaseData()) {
      const { todayData, khInternalData } = JSON.parse(inMemoryJWTManager.getCaseData());
      this.setState({ covidData: [...this.state.covidData, todayData, khInternalData], loading: false });
    }
    const { covidAPIDomin, expressAPIUrl, covidData } = this.state;
    const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
    const days = ["អាទិត្យ", "ច័ន្ទ", "អង្គារ៍", "ពុធ", "ព្រហសត្បិ៍", "សុក្រ", "សៅរ៍"];

    await axios.get(`${expressAPIUrl}/v1/cases`)
      .then(({ data }) => {
        const sumOfCase = _.sumBy(data, o => o.numberOfCase);
        const sumOfDeath = _.sumBy(data, o => o.numberOfDeath);
        const sumOfRecovered = _.sumBy(data, o => o.numberOfRecovered);
        const { numberOfCase, numberOfDeath, numberOfRecovered, date } = _.orderBy(data, ['date'], ['asc'])[data.length - 1];
        let dateFormatKh = '';
        if (date) {
          const dateData = new Date(date);
          const dateString = `ថ្ងៃ${days[dateData.getDay()]} ទី${dateData.getDate()} ខែ${months[dateData.getMonth()]} ឆ្នាំ${dateData.getFullYear()}`;
          
          dateFormatKh += this.getCurrentDate(date) === this.getCurrentDate() ? `${dateString}, ថ្ងៃនេះ` : dateString;
        }

        const arrayExclude = [`ករណីឆ្លងសរុបប្រចាំថ្ងៃ, សំរាប់ ${dateFormatKh}`, "ករណីឆ្លងសរុប, ទិន្នន័យក្នុងប្រព័ន្ធ"];
        const covidDataFilter = covidData.filter(item => !arrayExclude.includes(item.text));

        const todayData = {
          order: 1,
          text: `ករណីឆ្លងសរុបប្រចាំថ្ងៃ, សំរាប់ ${dateFormatKh}`,
          data: [
            {
              text: 'ករណីឆ្លង',
              color: '#ff9800',
            },
            {
              text: 'ករណីស្លាប់',
              color: 'rgb(236, 49, 75)',        
            },
            {
              text: 'ករណីជា',
              color: 'rgb(5, 181, 132)',
            },
          ]
        };

        const khInternalData = {
          order: 2,
          text: "ករណីឆ្លងសរុប, ទិន្នន័យក្នុងប្រព័ន្ធ",
          data: [
            {
              text: 'ករណីឆ្លង',
              value: sumOfCase,
              color: '#ff9800',
            },
            {
              text: 'ករណីស្លាប់',
              value: sumOfDeath,
              color: 'rgb(236, 49, 75)',        
            },
            {
              text: 'ករណីជា',
              value: sumOfRecovered,
              color: 'rgb(5, 181, 132)',
              percent: (sumOfRecovered * 100) / sumOfCase
            },
          ]
        };

        if (numberOfCase) {
          khInternalData.data[0].today = numberOfCase;
          todayData.data[0].value = numberOfCase;
        }
        if (numberOfDeath) {
          khInternalData.data[1].today = numberOfDeath;
          todayData.data[1].value = numberOfDeath;
        }
        if (numberOfRecovered) {
          khInternalData.data[2].today = numberOfRecovered;
          todayData.data[2].value = numberOfRecovered;
          todayData.data[2].percent = (numberOfRecovered * 100) / numberOfCase;
        }
        inMemoryJWTManager.setCaseData({todayData, khInternalData});
        this.setState({ covidData: [...covidDataFilter, todayData, khInternalData], loading: false });
      })
      .catch(err => { if (err.response && err.response.data) this.handleError(err.response.data); });

    await axios.get(`${covidAPIDomin}/api/countries/KH`)
      .then(({ data }) => {
        const khData = {
          order: 3,
          text: "ករណីឆ្លងសរុប, ទិន្នន័យក្រៅប្រព័ន្ធ",
          data: [
            {
              text: 'ករណីឆ្លង',
              value: data.confirmed.value,
              color: '#ff9800',
            },
            {
              text: 'ករណីស្លាប់',
              value: data.deaths.value,
              color: 'rgb(236, 49, 75)',              
            },
            {
              text: 'ករណីជា',
              value: data.recovered.value,
              color: 'rgb(5, 181, 132)',
              percent: (data.recovered.value * 100) / data.confirmed.value
            },
          ]
        };
        this.setState({ covidData: [...this.state.covidData, khData] });
      })
      .catch(err => console.log(err));

    await axios.get(`${this.state.covidAPIDomin}/api`)
      .then(({ data }) => {
        const allData = {
          order: 4,
          text: 'ករណីឆ្លងទូទាំងសកលលោក',
          data: [
            {
              text: 'ករណីឆ្លង',
              value: data.confirmed.value,
              color: '#ff9800',
            },
            {
              text: 'ករណីស្លាប់',
              value: data.deaths.value,
              color: 'rgb(236, 49, 75)',
            },
            {
              text: 'ករណីជា',
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

  handleError = data => {
    if (data && data.errors && data.errors.length) {
      data.errors.forEach(({ field, messages }) => {
        let obj = {};
        obj[field] = messages.length ? messages.join(', ') : '';
        this.setState({
          errorMessage: {
            ...this.state.errorMessage,
            ...obj
          }
        });
      });
    } else if (data && data.message) {
      const { message } = data;
      this.setState({
        errorMessage: {
          email: message,
          password: message,
        }
      });
    }
  };

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
    const { covidData, loading } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div className={classes.root} style={{ textAlign: "center" }}>
          <Fade
            in={loading}
            style={{
              transitionDelay: loading ? "800ms" : "0ms",              
            }}
            unmountOnExit
          >
            <CircularProgress
              style={{                
                marginTop: 50,
                width: 40,
                height: 40
              }}
            />
          </Fade>
          {covidData && covidData.length ? _.orderBy(covidData, ['order'], ['asc']).map(({ text, data }, i) => (
            <React.Fragment key={i}>
              <Typography 
                style={{ marginTop: "3.5rem", lineHeight: "1.7" }}
                variant="h4"
                align="center"
                color="textPrimary"
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
                            {value ? this.numberFormat(value) : '0'}
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
