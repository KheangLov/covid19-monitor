import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import withStyles from '@material-ui/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import DescriptionIcon from '@material-ui/icons/Description';
import clsx from 'clsx';
import Grid from "@material-ui/core/Grid";
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fade from "@material-ui/core/Fade";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from "@material-ui/core/CircularProgress";
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import _ from 'lodash';
import inMemoryJWTManager from '../../inMemoryJwt';

const Alert = props => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = theme => ({
  paper: {
    padding: theme.spacing(3),
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  avatar: {
    margin: 10,
    backgroundColor: theme.palette.grey['200'],
    color: theme.palette.text.primary,
  },
  avatarContainer: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginBottom: theme.spacing(4)
    }
  },
  itemContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  },
  baseline: {
    alignSelf: 'baseline',
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      alignItems: 'center',
      width: '100%',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      marginLeft: 0
    }
  },
  inline: {
    display: 'inline-block',
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0
    }
  },
  inlineRight: {
    width: '30%',
    textAlign: 'right',
    marginLeft: 50,
    alignSelf: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
      textAlign: 'center'
    }
  },
  backButton: {
    marginRight: theme.spacing(2)
  },
  marginBottom: {
    marginBottom: theme.spacing(1),
  },
  paginateAlign: {
    justifyContent: 'flex-end'
  },
})

class CardItem extends Component {
  state = {
    expressAPIUrl: process.env.REACT_APP_EXPRESS_API_URL ? process.env.REACT_APP_EXPRESS_API_URL : 'http://localhost:4000',
    errorMessage: {},
    formData: {
      location: 'Cambodia',
    },
    createdStatus: {},
    updatedStatus: {},
    buttonDisabled: false,
    requestConfig: {},
    dataList: [],
    dialogOpen: {},
    loading: true,
    isLoading: true,
    perPage: 10,
    page: 1,
    totalEntries: 0,
    totalPages: 0,
    snackbarMessage: '',
  };

  componentDidMount() {
    if (inMemoryJWTManager.getToken()) {
      const { token: { tokenType, accessToken } } = JSON.parse(inMemoryJWTManager.getToken());
      this.setState({ requestConfig: { headers: { Authorization: `${tokenType} ${accessToken}` } } });
      this.handleList();
    } else {
      this.props.history.push("/");
    }
  }

  numberFormat = val => {
    return new Intl.NumberFormat().format(val);
  };

  getCurrentDate = (date = '') => {
    const currentDate = date ? new Date(date) : new Date();
    let month = '' + (currentDate.getMonth() + 1);
    let day = '' + currentDate.getDate();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${currentDate.getFullYear()}-${month}-${day}`;
  };

  handleChange = event => {
    this.setState({
      formData: {
        ...this.state.formData,
        [event.target.name]: event.target.value 
      }
    });
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
          numberOfCase: message,
          numberOfDeath: message,
          numberOfRecovered: message,
        }
      });
    }
  }

  handleResetInput = () => {    
    const { formData } = this.state;
    const inputs = ['numberOfCase', 'numberOfDeath', 'numberOfRecovered'];
      
    for (let key in formData)
      if (inputs.includes(key)) 
        document.querySelector(`input[name="${key}"]`).value = '';
  };

  handleList = () => {
    const { expressAPIUrl, requestConfig, perPage, page } = this.state;
    axios.get(`${expressAPIUrl}/v1/cases`, 
      { params: { page, perPage } }, 
      requestConfig
    )
      .then(({ data: { data, totalEntries, totalPages } }) => {
        this.setState({ dataList: data, totalEntries, totalPages, isLoading: false });
        this.props.getFromChild({ totalEntries, perPage});
      })
      .catch(err => { if (err.response && err.response.data) this.handleError(err.response.data); });
  };
 
  handleCreate = date => {
    this.setState({ buttonDisabled: true });
    const { expressAPIUrl, formData, requestConfig } = this.state;
    formData.date = date;

    axios.post(`${expressAPIUrl}/v1/cases`, formData, requestConfig)
      .then(({ status, statusText }) => {
        this.handleResetInput();
        this.setState({ 
          createdStatus: { status, statusText },
          errorMessage: {},
          formData: {
            location: 'Cambodia',
          },
          buttonDisabled: false
        });
      })
      .catch(err => {
        this.setState({ buttonDisabled: false });
        if (err.response && err.response.data) {
          this.handleError(err.response.data);
        }
      });
  };

  handleUpdate = id => {
    this.setState({ buttonDisabled: true });
    const { expressAPIUrl, formData, requestConfig } = this.state;

    axios.patch(`${expressAPIUrl}/v1/cases/${id}`, _.omit(formData, ['_id', 'date', 'location']), requestConfig)
      .then(({ status, statusText }) => {
        this.handleResetInput();
        this.handleList();
        this.setState({
          edit: false,
          updatedStatus: { status, statusText },
          errorMessage: {},
          formData: {
            location: 'Cambodia',
          },
          buttonDisabled: false
        });
        this.handleClose(id);
      })
      .catch(err => {
        this.setState({ buttonDisabled: false });
        if (err.response && err.response.data) {
          this.handleError(err.response.data);
        }
      });
  };

  handleClickOpen = id => {
    let obj = this.state.dialogOpen;
    obj[`dialog_${id}`] = true;
    this.setState({ dialogOpen: obj });
  };

  handleClose = id => {
    let obj = this.state.dialogOpen;
    obj[`dialog_${id}`] = false;
    this.setState({ dialogOpen: obj });
  };

  handleGetDialyCase = () => {
    axios.get('https://flask-covid19-api-script.herokuapp.com/api/run_script')
      .then(res => this.setState({ snackbarMessage: res.message }))
      .catch(err => {
        this.setState({ buttonDisabled: false });
        if (err.response && err.response.data) {
          this.handleError(err.response.data);
        }
      });
  };

  handleClose = () => this.setState({ snackbarMessage: '' });

  render() {
    const { classes, type } = this.props;
    const { errorMessage, createdStatus, updatedStatus, buttonDisabled, dataList, edit, formData, dialogOpen, loading, page, totalPages, isLoading, snackbarMessage } = this.state;
    const token = inMemoryJWTManager.getToken();
    const { user } = JSON.parse(token);
    const currentDate = this.getCurrentDate();
    const noNumOfCasesError = !errorMessage.numberOfCase;
    const noNumOfDeathError = !errorMessage.numberOfDeath;
    const noNumOfRecoveredError = !errorMessage.numberOfRecovered;
    
    return (
      <div className={classes.root}>
        {(!type || type !== 'form') && isLoading ? (
          <div style={{ textAlign: "center" }}>
            <Fade
              in={loading}
              style={{
                transitionDelay: loading ? "100ms" : "0ms",              
              }}
            >
              <CircularProgress
                style={{
                  marginBottom: 30,
                  width: 40,
                  height: 40
                }}
              />
            </Fade>
          </div>
        ) : ''}
        {!type || type !== 'form' ? dataList.map(({ _id, numberOfCase, numberOfRecovered, numberOfDeath, date }) => (
          <Paper className={classes.paper} style={{ marginBottom: "20px" }} key={_id}>
            <div className={classes.itemContainer} key={_id}>
              <div className={classes.avatarContainer}>
                <Avatar className={classes.avatar}>
                  <DescriptionIcon />
                </Avatar>
              </div>
              <div className={classes.baseline}>
                <div className={classes.inline}>
                  <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                    Confirmed Cases
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {this.numberFormat(numberOfCase)}
                  </Typography>
                </div>
                <div className={classes.inline}>
                  <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                    Death
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {this.numberFormat(numberOfDeath)}
                  </Typography>
                </div>
                <div className={classes.inline}>
                  <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                    Recovered
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {this.numberFormat(numberOfRecovered)}
                  </Typography>
                </div>
              </div>
              <div className={classes.inlineRight}>
                <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                  Date
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {this.getCurrentDate(new Date(date).toString())}
                </Typography>
                {user && user.role === 'admin' && (
                  <React.Fragment>
                    <Button variant="contained" color="primary" onClick={this.handleClickOpen.bind(this, _id)}>
                      Edit
                    </Button>
                    <Dialog open={dialogOpen && dialogOpen[`dialog_${_id}`] ? dialogOpen[`dialog_${_id}`] : false} onClose={this.handleClose.bind(this, _id)} aria-labelledby="form-dialog-title">
                      {updatedStatus && updatedStatus.status && parseInt(updatedStatus.status) === 201 ? (
                        <DialogTitle id="form-dialog-title" style={{ marginLeft: "8px", color: "rgb(5, 181, 132)" }} display="inline" color='textSecondary' variant="body2">
                          {updatedStatus.statusText ? updatedStatus.statusText : 'Edit'} success!
                        </DialogTitle>
                      ) : ''}
                      <DialogContent>
                        <FormControl fullWidth className={clsx(classes.marginBottom)} variant="outlined">
                          <InputLabel error={!noNumOfCasesError} htmlFor={`outlined-adornment-cases-${_id}`}>Number of cases</InputLabel>
                          <OutlinedInput
                            error={!noNumOfCasesError}
                            id={`outlined-adornment-cases-${_id}`}
                            aria-describedby={`outlined-cases-helper-text-${_id}`}
                            labelWidth={115}
                            name="numberOfCase"
                            onChange={this.handleChange}
                            defaultValue={numberOfCase && numberOfCase}
                          />
                          <FormHelperText error={!noNumOfCasesError} id={`outlined-cases-helper-text-${_id}`} style={!noNumOfCasesError ? { marginBottom: "10px" } : {}}>
                            {!noNumOfCasesError && errorMessage.numberOfCase}
                          </FormHelperText>
                        </FormControl>
                        <FormControl fullWidth className={clsx(classes.marginBottom)} variant="outlined">
                          <InputLabel error={!noNumOfDeathError} htmlFor={`outlined-adornment-death-${_id}`}>Number of death</InputLabel>
                          <OutlinedInput
                            error={!noNumOfDeathError}
                            id={`outlined-adornment-death-${_id}`}
                            aria-describedby={`outlined-death-helper-text-${_id}`}
                            labelWidth={120}
                            name="numberOfDeath"
                            onChange={this.handleChange}
                            defaultValue={numberOfDeath && numberOfDeath}
                          />
                          <FormHelperText error={!noNumOfDeathError} id={`outlined-death-helper-text-${_id}`} style={!noNumOfDeathError ? { marginBottom: "10px" } : {}}>
                            {!noNumOfDeathError && errorMessage.numberOfDeath}
                          </FormHelperText>
                        </FormControl>
                        <FormControl fullWidth className={clsx(classes.marginBottom)} variant="outlined">
                          <InputLabel error={!noNumOfRecoveredError} htmlFor={`outlined-adornment-recovered-${_id}`}>Number of recovered</InputLabel>
                          <OutlinedInput
                            error={!noNumOfRecoveredError}
                            id={`outlined-adornment-recovered-${_id}`}
                            aria-describedby={`outlined-recovered-helper-text-${_id}`}
                            labelWidth={150}
                            name="numberOfRecovered"
                            onChange={this.handleChange}
                            defaultValue={numberOfRecovered && numberOfRecovered}
                          />
                          <FormHelperText error={!noNumOfRecoveredError} id={`outlined-recovered-helper-text-${_id}`} style={!noNumOfRecoveredError ? { marginBottom: "10px" } : {}}>
                            {!noNumOfRecoveredError && errorMessage.numberOfRecovered}
                          </FormHelperText>
                        </FormControl>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.handleClose.bind(this, _id)} color="primary">
                          Cancel
                        </Button>
                        <Button disabled={buttonDisabled} onClick={this.handleUpdate.bind(this, _id)} color="primary">
                          Edit
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </React.Fragment>
                )}
              </div>
            </div>
          </Paper>
        )) : (
          <Paper className={classes.paper}>
            <div className={classes.itemContainer}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography style={{ marginBottom: '1rem' }} color='secondary' gutterBottom>
                    Add cases for -&nbsp;
                    <span style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                      {edit ? this.getCurrentDate(formData.date) : currentDate}
                    </span> 
                    &nbsp;-&nbsp;
                    <span onClick={this.handleGetDialyCase} style={{ fontSize: 16, cursor: 'pointer' }}>
                      Get dialy cases
                    </span>
                    <Snackbar open={snackbarMessage ? true : false} autoHideDuration={5000} onClose={this.handleClose}>
                      <Alert onClose={this.handleClose} severity="success">
                        {snackbarMessage}
                      </Alert>
                    </Snackbar>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth className={clsx(classes.marginBottom)} variant="outlined">
                    <InputLabel error={!noNumOfCasesError} htmlFor="outlined-adornment-cases">Number of cases</InputLabel>
                    <OutlinedInput
                      error={!noNumOfCasesError}
                      id="outlined-adornment-cases"
                      aria-describedby="outlined-cases-helper-text"
                      labelWidth={115}
                      name="numberOfCase"
                      onChange={this.handleChange}
                      defaultValue={formData && formData.numberOfCase ? formData.numberOfCase : ''}
                    />
                    <FormHelperText error={!noNumOfCasesError} id="outlined-cases-helper-text" style={!noNumOfCasesError ? { marginBottom: "10px" } : {}}>
                      {!noNumOfCasesError && errorMessage.numberOfCase}
                    </FormHelperText>
                  </FormControl>
                  <FormControl fullWidth className={clsx(classes.marginBottom)} variant="outlined">
                    <InputLabel error={!noNumOfDeathError} htmlFor="outlined-adornment-death">Number of death</InputLabel>
                    <OutlinedInput
                      error={!noNumOfDeathError}
                      id="outlined-adornment-death"
                      aria-describedby="outlined-death-helper-text"
                      labelWidth={120}
                      name="numberOfDeath"
                      onChange={this.handleChange}
                      defaultValue={formData && formData.numberOfDeath ? formData.numberOfDeath : ''}
                    />
                    <FormHelperText error={!noNumOfDeathError} id="outlined-death-helper-text" style={!noNumOfDeathError ? { marginBottom: "10px" } : {}}>
                      {!noNumOfDeathError && errorMessage.numberOfDeath}
                    </FormHelperText>
                  </FormControl>
                  <FormControl fullWidth className={clsx(classes.marginBottom)} variant="outlined">
                    <InputLabel error={!noNumOfRecoveredError} htmlFor="outlined-adornment-recovered">Number of recovered</InputLabel>
                    <OutlinedInput
                      error={!noNumOfRecoveredError}
                      id="outlined-adornment-recovered"
                      aria-describedby="outlined-recovered-helper-text"
                      labelWidth={150}
                      name="numberOfRecovered"
                      onChange={this.handleChange}
                      defaultValue={formData && formData.numberOfRecovered ? formData.numberOfRecovered : ''}
                    />
                    <FormHelperText error={!noNumOfRecoveredError} id="outlined-recovered-helper-text" style={!noNumOfRecoveredError ? { marginBottom: "10px" } : {}}>
                      {!noNumOfRecoveredError && errorMessage.numberOfRecovered}
                    </FormHelperText>
                  </FormControl>
                  <Button 
                    disabled={buttonDisabled}
                    variant="contained" 
                    color="secondary"
                    size="large"
                    onClick={this.handleCreate.bind(this, currentDate)}
                  >
                    Add
                  </Button>
                  {createdStatus && createdStatus.status && parseInt(createdStatus.status) === 201 ? (
                    <Typography style={{ marginLeft: "8px", color: "rgb(5, 181, 132)" }} display="inline" color='textSecondary' variant="body2">
                      {createdStatus.statusText ? createdStatus.statusText : 'Add'} success!
                    </Typography>
                  ) : ''}
                </Grid>
              </Grid>
            </div>
          </Paper>
        )}
        {!type || type !== 'form' ? (
          <Pagination 
            count={totalPages} 
            page={page} 
            color="primary" 
            classes={{ ul: classes.paginateAlign }}
            onChange={async (e, pg) => {
              await this.setState({ dataList: [], isLoading: true, page: pg });
              setTimeout(() => this.handleList(), 500);
            }}
          />
        ) : ''}
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(CardItem));
