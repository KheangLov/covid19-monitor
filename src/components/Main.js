import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import { withRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from '@material-ui/core/Tooltip';
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
    paddingBottom: 200,
    minHeight: "93vh",
  },
  grid: {
    width: 1200,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  paper: {
    padding: "24px 0 !important",
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
  },
});

class Main extends Component {
  state = {
    covidData: [],
    expressAPIUrl: process.env.REACT_APP_EXPRESS_API_URL ? process.env.REACT_APP_EXPRESS_API_URL : 'http://localhost:4000',
    covidAPIDomin: 'https://covid19.mathdro.id',
    loading: true,
    langLocale: 'kh'
  };

  async componentDidMount() {
    if (!inMemoryJWTManager.getLang()) {
      inMemoryJWTManager.setLang('kh');
    } else {
      await this.setState({ langLocale: inMemoryJWTManager.getLang() });
    }

    if (inMemoryJWTManager.getCaseData()) {
      const { todayData, khInternalData } = JSON.parse(inMemoryJWTManager.getCaseData());
      if (todayData && khInternalData) {
        this.setState({ covidData: [...this.state.covidData, todayData, khInternalData] });
      }
    }    
    this.setState({ loading: false });
    const { covidAPIDomin, expressAPIUrl, covidData } = this.state;

    await axios.get(`${expressAPIUrl}/v1/cases`, { params: { perPage: 0 } })
      .then(({ data: { data } }) => {
        const sumOfCase = _.sumBy(data, o => o.numberOfCase);
        const sumOfDeath = _.sumBy(data, o => o.numberOfDeath);
        const sumOfRecovered = _.sumBy(data, o => o.numberOfRecovered);
        const { numberOfCase, numberOfDeath, numberOfRecovered, date } = _.orderBy(data, ['date'], ['asc'])[data.length - 1];
        const { 
          numberOfCase: numberOfCaseYtd, 
          numberOfDeath: numberOfDeathYtd, 
          numberOfRecovered: numberOfRecoveredYtd,
        } = _.orderBy(data, ['date'], ['asc'])[data.length - 2];
        const covidDataFilter = covidData.filter(item => ![1, 2].includes(item.order));

        const todayData = {
          order: 1,
          date,
          text: date ? this.dateStringFormatted(date) : '',
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

        const patientNum = sumOfCase - sumOfDeath - sumOfRecovered;
        const khInternalData = {
          order: 2,
          text: "ករណីឆ្លងសរុប, ទិន្នន័យក្នុងប្រព័ន្ធ",
          data: [
            {
              text: 'ករណីឆ្លង',
              value: this.numberTranslate(this.numberFormat(sumOfCase)),
              color: '#ff9800',
              patient: this.numberTranslate(this.numberFormat(patientNum)),
              percent: this.numberTranslate(((patientNum * 100) / sumOfCase).toFixed(2)),
            },
            {
              text: 'ករណីស្លាប់',
              value: this.numberTranslate(this.numberFormat(sumOfDeath)),
              color: 'rgb(236, 49, 75)',   
              percent: this.numberTranslate(((sumOfDeath * 100) / sumOfCase).toFixed(2))
            },
            {
              text: 'ករណីជា',
              value: this.numberTranslate(this.numberFormat(sumOfRecovered)),
              color: 'rgb(5, 181, 132)',
              percent: this.numberTranslate(((sumOfRecovered * 100) / sumOfCase).toFixed(2))
            },
          ]
        };

        if (numberOfCaseYtd) {
          todayData.data[0].ytdForCal = numberOfCaseYtd;
          todayData.data[0].ytd = this.numberTranslate(this.numberFormat(numberOfCaseYtd));
          todayData.data[0].updown = this.formatUpdownText(numberOfCase, numberOfCaseYtd);
        }
        if (numberOfDeathYtd) {
          todayData.data[1].ytdForCal = numberOfDeathYtd;
          todayData.data[1].ytd = this.numberTranslate(this.numberFormat(numberOfDeathYtd));
          todayData.data[1].updown = this.formatUpdownText(numberOfDeath, numberOfDeathYtd);
        }
        if (numberOfRecoveredYtd) {
          todayData.data[2].ytdForCal = numberOfRecoveredYtd;
          todayData.data[2].ytd = this.numberTranslate(this.numberFormat(numberOfRecoveredYtd));
          todayData.data[2].updown = this.formatUpdownText(numberOfRecovered, numberOfRecoveredYtd);
        }

        if (numberOfCase) {
          khInternalData.data[0].today = this.numberTranslate(this.numberFormat(numberOfCase));
          todayData.data[0].value = this.numberTranslate(this.numberFormat(numberOfCase));
          todayData.data[0].valueForCal = numberOfCase;
        }
        if (numberOfDeath) {
          khInternalData.data[1].today = this.numberTranslate(this.numberFormat(numberOfDeath));
          todayData.data[1].value = this.numberTranslate(this.numberFormat(numberOfDeath));
          todayData.data[1].valueForCal = numberOfDeath;
        }
        if (numberOfRecovered) {
          khInternalData.data[2].today = this.numberTranslate(this.numberFormat(numberOfRecovered));
          todayData.data[2].value = this.numberTranslate(this.numberFormat(numberOfRecovered));
          todayData.data[2].valueForCal = numberOfRecovered;
        }
        inMemoryJWTManager.setCaseData({ todayData, khInternalData });
        this.setState({ covidData: [...covidDataFilter, todayData, khInternalData], loading: false });
      })
      .catch(err => { if (err.response && err.response.data) this.handleError(err.response.data); });

    await axios.get(`${covidAPIDomin}/api/countries/KH`)
      .then(({ data }) => {
        const patientNum = data.confirmed.value - data.deaths.value - data.recovered.value;
        const khData = {
          order: 3,
          text: "ករណីឆ្លងសរុប, ទិន្នន័យក្រៅប្រព័ន្ធ",
          data: [
            {
              text: 'ករណីឆ្លង',
              value: this.numberTranslate(this.numberFormat(data.confirmed.value)),
              color: '#ff9800',
              patient: this.numberTranslate(this.numberFormat(patientNum)),
              percent: this.numberTranslate(((patientNum * 100) / data.confirmed.value).toFixed(2)),
            },
            {
              text: 'ករណីស្លាប់',
              value: this.numberTranslate(this.numberFormat(data.deaths.value)),
              color: 'rgb(236, 49, 75)',
              percent: this.numberTranslate(((data.deaths.value * 100) / data.confirmed.value).toFixed(2))            
            },
            {
              text: 'ករណីជា',
              value: this.numberTranslate(this.numberFormat(data.recovered.value)),
              color: 'rgb(5, 181, 132)',
              percent: this.numberTranslate(((data.recovered.value * 100) / data.confirmed.value).toFixed(2))
            },
          ]
        };
        this.setState({ covidData: [...this.state.covidData, khData] });
      })
      .catch(err => console.log(err));

    await axios.get(`${this.state.covidAPIDomin}/api`)
      .then(({ data }) => {
        const patientNum = data.confirmed.value - data.deaths.value - data.recovered.value;
        const allData = {
          order: 4,
          text: 'ករណីឆ្លងទូទាំងសកលលោក',
          data: [
            {
              text: 'ករណីឆ្លង',
              value: this.numberTranslate(this.numberFormat(data.confirmed.value)),
              color: '#ff9800',
              patient: this.numberTranslate(this.numberFormat(patientNum)),
              percent: this.numberTranslate(((patientNum * 100) / data.confirmed.value).toFixed(2)),
            },
            {
              text: 'ករណីស្លាប់',
              value: this.numberTranslate(this.numberFormat(data.deaths.value)),
              color: 'rgb(236, 49, 75)',
              percent: this.numberTranslate(((data.deaths.value * 100) / data.confirmed.value).toFixed(2))
            },
            {
              text: 'ករណីជា',
              value: this.numberTranslate(this.numberFormat(data.recovered.value)),
              color: 'rgb(5, 181, 132)',
              percent: this.numberTranslate(((data.recovered.value * 100) / data.confirmed.value).toFixed(2))
            },
          ]
        };
        this.setState({ covidData: [...this.state.covidData, allData] });
      })
      .catch(err => console.log(err));
  }

  dateStringFormatted = date => {
    const { langLocale } = this.state;
    const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
    const days = ["អាទិត្យ", "ច័ន្ទ", "អង្គារ៍", "ពុធ", "ព្រហសត្បិ៍", "សុក្រ", "សៅរ៍"];
    const dateData = new Date(date);
    let dateNum = dateData.getDate();
    let yearNum = dateData.getFullYear();
    if (langLocale === 'kh') {
      dateNum = this.numberTranslate(dateNum);
      yearNum = this.numberTranslate(yearNum);
    }
    const dateString = `ថ្ងៃ${days[dateData.getDay()]} ទី${dateNum} ខែ${months[dateData.getMonth()]} ឆ្នាំ${yearNum}`;
    const returnText = this.getCurrentDate(date) === this.getCurrentDate() ? `${dateString}, ថ្ងៃនេះ` : dateString;

    return `ករណីឆ្លងសរុបប្រចាំថ្ងៃ, សំរាប់ ${returnText}`;
  };

  handleNumberTranslate = () => {
    const { covidData } = this.state;
    const newData = covidData.map(val => {
      if (val.order === 1) {
        val.text = this.dateStringFormatted(val.date);
      }
      val.data = val.data.map(v => {
        if (v.patient) {
          v.patient = this.numberTranslate(v.patient);
        }
        if (v.value) {
          v.value = this.numberTranslate(v.value);
        }
        if (v.today) {
          v.today = this.numberTranslate(v.today);
        }
        if (v.percent) {
          v.percent = this.numberTranslate(v.percent);
        }
        if (v.ytd) {
          v.ytd = this.numberTranslate(v.ytd);          
        }
        if (v.updown && v.valueForCal && v.ytdForCal) {
          v.updown = this.formatUpdownText(v.valueForCal, v.ytdForCal);
        }
        return v;
      });
      return val;
    });
    this.setState({ covidData: newData });
    const cookiedata = newData.filter(item => [1, 2].includes(item.order));
    inMemoryJWTManager.setCaseData({...cookiedata});
  };

  numberTranslate = num => {
    const { langLocale } = this.state;    
    const khNumbers = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    const signs = ['.', ','];
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

  formatUpdownText = (first, second) => {
    const { langLocale } = this.state;
    let updown = first - second;
    let text = '';
    let updownCal = Math.abs((updown / first) * 100).toFixed(2);
    text = updown > 0 ? 'កើន ' : 'ថយ ';
    updown = this.numberFormat(Math.abs(updown));
    if (langLocale === 'kh') {
      updown = this.numberTranslate(updown);
      updownCal = this.numberTranslate(updownCal);
    }
    text += `(${updown} ករណី) ស្មើរនឹង (${updownCal}%)`;
    return text;
  };

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
                  {data && data.length ? data.map(({ text: sub_text, value, color, percent, today, ytd, updown, patient }, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Paper className={classes.paper}>
                        <div className={classes.box}>
                          <Typography
                            style={{ textTransform: "capitalize", marginBottom: '0.1em' }}
                            gutterBottom
                            align="center"
                          >
                            {sub_text}
                          </Typography>
                          <Tooltip title="ចុចលើលេខដើម្បីប្តូរភាសា">
                            <Typography 
                              style={{ color, marginBottom: '0.1em' }}
                              align="center"
                              variant="h3"
                              gutterBottom
                              onClick={async () => {
                                const langLocale = inMemoryJWTManager.getLang() === 'kh' ? 'en' : 'kh';
                                await this.setState({ langLocale });
                                await inMemoryJWTManager.setLang(langLocale);
                                this.handleNumberTranslate();
                              }}
                            >
                              {value || '0'}
                            </Typography>
                          </Tooltip>
                          <Typography 
                            style={{ color }}
                            align="center"
                            variant="body2"
                            gutterBottom
                          >
                            {patient ? `អ្នកជំងឺ: ${patient}នាក់` : ''}
                            {patient && (today || percent) ? ', ' : ''}
                            {today ? `+${today}` : ''}
                            {today && percent ? ', ' : ''}
                            {percent ? `(${percent}%)` : ''}                            
                            {updown ? updown : ''}
                            {ytd && updown ? ', ' : ''}
                            {ytd ? `ម្សិលមិញ: ${ytd}` : ''}
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
