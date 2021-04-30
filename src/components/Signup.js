import React, { Component } from "react";
import withStyles from "@material-ui/styles/withStyles";
import { withRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DoneIcon from "@material-ui/icons/Done";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";
import Back from "./common/Back";
import clsx from 'clsx';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import FormHelperText from '@material-ui/core/FormHelperText';
import axios from 'axios';
import inMemoryJWTManager from '../inMemoryJwt';

const backgroundShape = require("../images/shape.svg");

const logo = require("../images/logo.svg");

const numeral = require("numeral");
numeral.defaultFormat("0");

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary["A100"],
    overflow: "hidden",
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    marginTop: 10,
    padding: 20,
    paddingBottom: 500
  },
  grid: {
    margin: `0 ${theme.spacing(2)}px`
  },
  smallContainer: {
    width: "80%"
  },
  bigContainer: {
    width: "80%"
  },
  logo: {
    marginBottom: 24,
    display: "flex",
    justifyContent: "center"
  },
  stepContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  stepGrid: {
    width: "100%"
  },
  buttonBar: {
    marginTop: 32,
    display: "flex",
    justifyContent: "center"
  },
  button: {
    backgroundColor: theme.palette.primary["A100"]
  },
  backButton: {
    marginRight: theme.spacing(1)
  },
  outlinedButtom: {
    textTransform: "uppercase",
    margin: theme.spacing(1)
  },
  stepper: {
    backgroundColor: "transparent"
  },
  paper: {
    padding: theme.spacing(4),
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  topInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 42
  },
  formControl: {
    width: "100%"
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  marginBottom: {
    marginBottom: theme.spacing(3),
  },
});

const getSteps = () => {
  return ["Register", "Login", "Success"];
};

class Signup extends Component {
  state = {
    expressAPIUrl: process.env.REACT_APP_EXPRESS_API_URL ? process.env.REACT_APP_EXPRESS_API_URL : 'http://localhost:3000',
    activeStep: 0,
    receivingAccount: "",
    termsChecked: false,
    loading: true,
    labelWidth: 0,
    values: {
      amount: '',
      password: '',
      weight: '',
      weightRange: '',
      showPassword: false,
    },
    formData: {
      name: '',
      email: '',
      password: '',
    },
    errorMessage: {}
  };

  componentDidMount() {
    if (inMemoryJWTManager.getToken()) {
      this.setState({ activeStep: 2 });
    }
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
    if (this.state.activeStep === 2) {
      setTimeout(() => this.props.history.push("/"), 5000);
    }
  };

  handleBack = () => {
    if (inMemoryJWTManager.getToken() && this.state.activeStep === 2) {
      inMemoryJWTManager.ereaseToken();
    }    
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  handleChange = event => {
    this.setState({
      formData: {
        ...this.state.formData,
        [event.target.name]: event.target.value 
      }
    });
  };

  handleTerms = event => {
    this.setState({ termsChecked: event.target.checked });
  };

  handleClickShowPassword = () => {
    this.setState({ values: { ...this.state.values, showPassword: !this.state.values.showPassword } });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
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
  }

  handleRegister = () => {
    axios.post(`${this.state.expressAPIUrl}/v1/auth/register`, this.state.formData)
      .then(({ data }) => {        
        inMemoryJWTManager.setToken(data);
        this.setState({ activeStep: 2 });
      })
      .catch(err => {
        const { response: { data } } = err;
        this.handleError(data);
      });
  };

  handleLogin = () => {
    axios.post(`${this.state.expressAPIUrl}/v1/auth/login`, this.state.formData)
      .then(({ data }) => {        
        inMemoryJWTManager.setToken(data);
        this.handleNext() 
      })
      .catch(err => {
        const { response: { data } } = err;
        this.handleError(data);
      });
  };

  stepActions() {
    if (this.state.activeStep === 0) {
      return "Go to Login";
    }
    if (this.state.activeStep === 1) {
      return "Login";
    }
    return "Go to Data";
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep, loading, values, errorMessage } = this.state;
    let user = {};
    const token = inMemoryJWTManager.getToken();
    if (token) {
      user = JSON.parse(token).user;
    }

    const noEmailError = !errorMessage.email;
    const noPasswordError = !errorMessage.password;
    const noNameError = !errorMessage.name;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <Back />
          <Grid container justify="center">
            <Grid
              spacing={10}
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Grid item xs={12} style={{ padding: "0" }}>
                <div className={classes.logo}>
                  <img width={100} height={100} src={logo} alt="" />
                </div>
                <div className={classes.stepContainer}>
                  <div className={classes.stepGrid}>
                    <Stepper
                      classes={{ root: classes.stepper }}
                      activeStep={activeStep}
                      alternativeLabel
                    >
                      {steps.map(label => {
                        return (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </div>
                  {activeStep === 0 && (
                    <div className={classes.smallContainer}>
                      <Paper className={classes.paper}>
                        <FormControl fullWidth className={clsx(classes.marginBottom)} variant="outlined">
                          <InputLabel error={!noNameError} htmlFor="outlined-adornment-name">Name</InputLabel>
                          <OutlinedInput
                            error={!noNameError}
                            id="outlined-adornment-name"
                            aria-describedby="outlined-name-helper-text"
                            labelWidth={45}
                            name="name"
                            onChange={this.handleChange}
                          />
                          <FormHelperText error={!noNameError} id="outlined-password-helper-text">
                            {!noNameError && errorMessage.name}
                          </FormHelperText>
                        </FormControl>
                        <FormControl fullWidth className={clsx(classes.marginBottom)} variant="outlined">
                          <InputLabel error={!noEmailError} htmlFor="outlined-adornment-email">Email</InputLabel>
                          <OutlinedInput
                            error={!noEmailError}
                            id="outlined-adornment-email"
                            type="email"
                            name="email"
                            aria-describedby="outlined-email-helper-text"
                            labelWidth={42}
                            onChange={this.handleChange}
                          />
                          <FormHelperText error={!noEmailError} id="outlined-password-helper-text">
                            {!noEmailError && errorMessage.email}
                          </FormHelperText>
                        </FormControl>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel error={!noPasswordError} htmlFor="outlined-adornment-password">Password</InputLabel>
                          <OutlinedInput
                            error={!noPasswordError}
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            name="password"
                            onChange={this.handleChange}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={this.handleClickShowPassword}
                                  onMouseDown={this.handleMouseDownPassword}
                                  edge="end"
                                >
                                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            }
                            labelWidth={70}
                          />
                          <FormHelperText error={!noPasswordError} id="outlined-password-helper-text">
                            {!noPasswordError && errorMessage.password}
                          </FormHelperText>
                        </FormControl>
                      </Paper>
                    </div>
                  )}
                  {activeStep === 1 && (
                    <div className={classes.smallContainer}>
                      <Paper className={classes.paper}>
                        <FormControl fullWidth className={clsx(classes.marginBottom)} variant="outlined">
                          <InputLabel error={!noEmailError} htmlFor="outlined-adornment-email">Email</InputLabel>
                          <OutlinedInput
                            error={!noEmailError}
                            id="outlined-adornment-email"
                            type="email"
                            name="email"
                            aria-describedby="outlined-email-helper-text"
                            labelWidth={42}
                            onChange={this.handleChange}
                          />
                          <FormHelperText error={!noEmailError} id="outlined-password-helper-text">
                            {!noEmailError && errorMessage.email}
                          </FormHelperText>
                        </FormControl>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel error={!noPasswordError} htmlFor="outlined-adornment-password">Password</InputLabel>
                          <OutlinedInput
                            error={!noPasswordError}
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            name="password"
                            onChange={this.handleChange}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={this.handleClickShowPassword}
                                  onMouseDown={this.handleMouseDownPassword}
                                  edge="end"
                                >
                                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            }
                            labelWidth={70}
                          />
                          <FormHelperText error={!noPasswordError} id="outlined-password-helper-text">
                            {!noPasswordError && errorMessage.password}
                          </FormHelperText>
                        </FormControl>
                      </Paper>
                    </div>
                  )}
                  {activeStep === 2 && (
                    <div className={classes.smallContainer}>
                      <Paper className={classes.paper}>
                        <div>
                          <div style={{ marginBottom: 32 }}>
                            <Typography variant="subtitle1" gutterBottom style={{ color: "rgb(5, 181, 132)" }}>
                              Login Success
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Here are some user's info.
                            </Typography>
                          </div>
                          <div>
                            <Typography color="secondary" gutterBottom>
                              User
                            </Typography>
                            {user ? (
                              <List component="nav">                                
                                {user.email ? (
                                  <ListItem>
                                    <ListItemIcon>
                                      <DoneIcon style={{ color: "rgb(5, 181, 132)" }} />
                                    </ListItemIcon>
                                    <ListItemText
                                      inset
                                      primary={user.email}
                                    />
                                  </ListItem>
                                ) : ''}
                                {user.name ? (
                                  <ListItem>
                                    <ListItemIcon>
                                      <DoneIcon style={{ color: "rgb(5, 181, 132)" }} />
                                    </ListItemIcon>
                                    <ListItemText
                                      inset
                                      primary={user.name}
                                    />
                                  </ListItem>
                                ) : ''}                                
                              </List>
                            ) : ''}
                          </div>
                        </div>
                      </Paper>
                    </div>
                  )}
                  {activeStep === 3 && (
                    <div className={classes.bigContainer}>
                      <Paper className={classes.paper}>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <div style={{ width: 380, textAlign: "center" }}>
                            <div style={{ marginBottom: 32 }}>
                              <Typography
                                variant="h6"
                                style={{ fontWeight: "bold" }}
                                gutterBottom
                              >
                                Collecting your data
                              </Typography>
                              <Typography variant="body1" gutterBottom>
                                We are processing your request
                              </Typography>
                            </div>
                            <div>
                              <Fade
                                in={loading}
                                style={{
                                  transitionDelay: loading ? "800ms" : "0ms"
                                }}
                                unmountOnExit
                              >
                                <CircularProgress
                                  style={{
                                    marginBottom: 32,
                                    width: 100,
                                    height: 100
                                  }}
                                />
                              </Fade>
                            </div>
                          </div>
                        </div>
                      </Paper>
                    </div>
                  )}
                  {activeStep !== 3 && (
                    <div className={classes.buttonBar}>
                      {activeStep !== 2 ? (
                        <Button
                          disabled={activeStep === 0}
                          onClick={this.handleBack}
                          className={classes.backButton}
                          size="large"
                        >
                          Back
                        </Button>
                      ) : (
                        <Button
                          disabled={activeStep === 0}
                          onClick={this.handleBack}
                          className={classes.backButton}
                          size="large"
                        >
                          Logout
                        </Button>
                      )}
                      {activeStep === 0 ? (
                        <Button 
                          variant="contained" 
                          color="secondary" 
                          size="large"
                          onClick={this.handleRegister}
                          style={
                            this.state.receivingAccount.length
                              ? { background: classes.button, color: "white", marginRight: "10px" }
                              : { marginRight: "10px" }
                          }
                        >
                          Register
                        </Button>
                      ) : ''}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.stepActions() === "Login" ? this.handleLogin : this.handleNext}
                        size="large"
                        style={
                          this.state.receivingAccount.length
                            ? { background: classes.button, color: "white" }
                            : {}
                        }
                      >
                        {this.stepActions()}
                      </Button>
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(Signup));
