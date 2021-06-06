import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import { withRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import SimpleLineChart from "./SimpleLineChart";
import SimplePieChart from "./SimplePieChart";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import inMemoryJWTManager from '../inMemoryJwt';
import Topbar from "./Topbar";

const numeral = require("numeral");
numeral.defaultFormat("0,000");

const backgroundShape = require("../images/shape.svg");

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#f8f8f8",
    overflow: "hidden",
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    minHeight: "93vh",    
  },
  grid: {
    width: 1200,
    margin: `${theme.spacing(6)}px ${theme.spacing(2)}px`,
    [theme.breakpoints.down("lg")]: {
      width: "calc(100% - 20px)"
    }
  },
  loadingState: {
    opacity: 0.05
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
    alignItems: "center"
  },
  outlinedButtom: {
    textTransform: "uppercase",
    margin: theme.spacing(1)
  },
  actionButtom: {
    textTransform: "uppercase",
    margin: theme.spacing(1),
    width: 152,
    height: 36
  },
  blockCenter: {
    padding: theme.spacing(2),
    textAlign: "center"
  },
  block: {
    padding: theme.spacing(2)
  },
  loanAvatar: {
    display: "inline-block",
    verticalAlign: "center",
    width: 16,
    height: 16,
    marginRight: 10,
    marginBottom: -2,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main
  },
  interestAvatar: {
    display: "inline-block",
    verticalAlign: "center",
    width: 16,
    height: 16,
    marginRight: 10,
    marginBottom: -2,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light
  },
  inlining: {
    display: "inline-block",
    marginRight: 10
  },
  buttonBar: {
    display: "flex"
  },
  noBorder: {
    borderBottomStyle: "hidden"
  },
  mainBadge: {
    textAlign: "center",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  chartCart: {
    padding: `0 ${theme.spacing(1)}px`,
    marginBottom: theme.spacing(3)
  }
});

class Dashboard extends Component {
  state = {
    loading: true,
    amount: 15000,
    period: 3,
    start: 0,
    monthlyInterest: 0,
    totalInterest: 0,
    monthlyPayment: 0,
    totalPayment: 0,
    data: {},
    pieData: {},
    langLocale: 'kh',
    expressAPIUrl: process.env.REACT_APP_EXPRESS_API_URL ? process.env.REACT_APP_EXPRESS_API_URL : 'http://localhost:4000',
  };

  async componentDidMount() {
    if (!inMemoryJWTManager.getLang()) {
        inMemoryJWTManager.setLang('kh');
    } else {
        await this.setState({ langLocale: inMemoryJWTManager.getLang() });
    }
    this.handleGetData();
  }

  numberTranslate = num => {
    const { langLocale } = this.state;    
    const khNumbers = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    const signs = ['.', ',', '-'];
    let newNum = '';
    if (typeof num !== 'string') num = num.toString();
    [...num].forEach(n => {
      if (signs.includes(n)) {
        newNum += n;
        return true;
      }
      newNum += langLocale === 'kh' ? khNumbers[n] : (langLocale !== 'kh' && khNumbers.indexOf(n) > -1 ? khNumbers.indexOf(n) : n);
    });
    return newNum;
  };

  handleGetData = async () => {
    const { expressAPIUrl } = this.state;
    const dateRange = {
        from: moment().subtract(1, 'months').add(1, 'day').format('YYYY-MM-DD'), 
        to: moment().add(1, 'day').format('YYYY-MM-DD')
    };
    
    await axios.get(`${expressAPIUrl}/v1/cases`, { params: { perPage: 0 } })
        .then(({ data: { data } }) => {
            const originalData = _.orderBy(data, ['date'], ['asc']);
            const sumOfCase = _.sumBy(originalData, o => o.numberOfCase);
            const sumOfDeath = _.sumBy(originalData, o => o.numberOfDeath);
            const sumOfRecovered = _.sumBy(originalData, o => o.numberOfRecovered);
            const pieData = {
                data: [
                    {
                        name: 'ករណីព្យាបាល', 
                        value: sumOfCase - sumOfDeath - sumOfRecovered,
                        color: '#ff9800'
                    },
                    {
                        name: 'ករណីស្លាប់', 
                        value: sumOfDeath,
                        color: '#ec314b'
                    },
                    {
                        name: 'ករណីជា', 
                        value: sumOfRecovered,
                        color: '#05b584'
                    },
                ],
            };
            this.setState({ pieData, loading: false });
        })
        .catch(err => { if (err.response && err.response.data) this.handleError(err.response.data); });

    await axios.get(`${expressAPIUrl}/v1/cases`, { params: { perPage: 0, dateRange } })
        .then(({ data: { data } }) => {
            const originalData = _.orderBy(data, ['date'], ['asc']);
            const daysText = `${this.numberTranslate(30)} ថ្ងៃចុងក្រោយ`
            const lineData = {
                caseData: {
                    title: `ករណីឆ្លង ${daysText}`, 
                    data: [],
                    color: '#ff9800'
                },
                caseDeath: {
                    title: `ករណីស្លាប់ ${daysText}`, 
                    data: [],
                    color: '#ec314b'
                },
                caseRecovered: {
                    title: `ករណីជា ${daysText}`, 
                    data: [],
                    color: '#05b584'
                },
            };
            originalData.forEach(v => {
                lineData.caseData.data.push({
                    name: moment(v.date).format('DD-MM-YYYY'),
                    case: v.numberOfCase,
                });
                lineData.caseDeath.data.push({
                    name: moment(v.date).format('DD-MM-YYYY'),
                    case: v.numberOfDeath,
                });
                lineData.caseRecovered.data.push({
                    name: moment(v.date).format('DD-MM-YYYY'),
                    case: v.numberOfRecovered,
                });
            });            
            this.setState({ data: lineData });
        })
        .catch(err => { if (err.response && err.response.data) this.handleError(err.response.data); });
  };

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;
    const { data, loading, pieData } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <div className={classes.root} style={{ textAlign: "center" }}>
            <Fade
                in={loading}
                style={{
                transitionDelay: loading ? "100ms" : "0ms",              
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
            <Grid container justify="center" className={classes.grid}>
                {pieData && Object.keys(pieData).length > 0 && (
                    <Grid item xs={12} md={8} className={classes.chartCart}>
                        <Paper
                            className={classes.paper}
                            style={{ position: "relative" }}
                        >
                            <SimplePieChart data={pieData.data} title={pieData.title} />                    
                        </Paper>
                    </Grid>
                )}
                {data && Object.keys(data).map((key, index) => (
                    <Grid item xs={12} md={8} className={classes.chartCart} key={index}>
                        <Paper
                            className={classes.paper}
                            style={{ position: "relative" }}
                        >
                            <SimpleLineChart data={data[key].data} title={data[key].title} color={data[key].color} />                    
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(Dashboard));