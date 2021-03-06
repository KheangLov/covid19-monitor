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
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import FormHelperText from '@material-ui/core/FormHelperText';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
// import CreateIcon from '@material-ui/icons/Create';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
import FacebookIcon from '@material-ui/icons/Facebook';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import clsx from 'clsx';
import axios from 'axios';
import Back from "./common/Back";
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
    paddingBottom: 80,
    minHeight: "100vh"
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
    backgroundColor: "transparent",
    maxWidth: "550px",
    margin: "0 auto",
  },
  paper: {
    padding: theme.spacing(4),
    textAlign: "left",
    color: theme.palette.text.secondary,
    maxWidth: "400px",
    margin: "0 auto",
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
  textOverflow: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  googleLoginButton: {
    padding: "8px",
    width: "100%",
    fontSize: "0.9375rem",
    transition: "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    fontFamily: "inherit !important",
    fontWeight: 500,
    lineHeight: "1.75",
    borderRadius: "4px !important",
    justifyContent: "center",
    cursor: "pointer",
    marginBottom: theme.spacing(2),
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  facebookLoginButton: {
    padding: "8px",
    fontSize: "0.9375rem",
    width: "100%",
    color: "#ffffff",
    backgroundColor: "#303f9f",
    boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
    boxSizing: "border-box",
    transition: "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    fontFamily: "inherit !important",
    fontWeight: 500,
    lineHeight: "1.75",
    borderRadius: "4px",
    border: 0,
    cursor: "pointer",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  facebookIcon: {
    marginRight: "8px",    
    display: "inline",
    position: "relative",
    top: "0.3rem",
  },
  avatarSize: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  divideFlex: {
    padding: 3,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  noPadding: {
    padding: 0,
  },
  buttonEditProfile: {
    padding: 0,
    minWidth: 0,
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

const getSteps = () => {
  return ["????????????????????????", "?????????????????????????????????", "??????????????????"];
};

class Signup extends Component {
  state = {
    expressAPIUrl: process.env.REACT_APP_EXPRESS_API_URL ? process.env.REACT_APP_EXPRESS_API_URL : 'http://localhost:4000',
    activeStep: inMemoryJWTManager.getToken() ? 2 : 1,
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
    errorMessage: {},
    dialogOpen: false,
    buttonDisabled: false,
    disableSocialButtons: false,
  };

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
      buttonDisabled: false,
    }));
  };

  redirectInMs = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
    if (this.state.activeStep === 2) {
      setTimeout(() => window.location.href = '/', 5000);
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
          },
          buttonDisabled: false,
        });
      });
    } else if (data && data.message) {
      const { message } = data;
      this.setState({
        errorMessage: {
          email: message,
          password: message,
        },
        buttonDisabled: false,
      });
    }
  };

  handleRegister = () => {
    this.setState({ buttonDisabled: true });
    axios.post(`${this.state.expressAPIUrl}/v1/auth/register`, this.state.formData)
      .then(({ data }) => {        
        inMemoryJWTManager.setToken(data);
        this.setState({ activeStep: 2, buttonDisabled: false });
      })
      .catch(err => {
        const { response: { data } } = err;
        this.handleError(data);
      });
  };

  handleLogin = () => {
    this.setState({ buttonDisabled: true });
    axios.post(`${this.state.expressAPIUrl}/v1/auth/login`, this.state.formData)
      .then(({ data }) => {
        inMemoryJWTManager.setToken(data);
        this.handleNext();
      })
      .catch(err => {
        const { response: { data } } = err;
        this.handleError(data);
      });
  };

  responseFacebook = ({ accessToken: access_token }) => {
    if (access_token) {
      this.setState({ disableSocialButtons: true, buttonDisabled: true });
      axios.post(`${this.state.expressAPIUrl}/v1/auth/facebook`, { access_token })
        .then(({ data }) => {
          inMemoryJWTManager.setToken(data);
          this.handleNext();
          this.setState({ disableSocialButtons: false, buttonDisabled: false });
        })
        .catch(err => {
          const { response: { data } } = err;
          this.handleError(data);
          this.setState({ disableSocialButtons: false, buttonDisabled: false });
        });
    }
    return false;
  };

  responseGoogle = ({ accessToken: access_token }) => {
    if (access_token) {
      this.setState({ disableSocialButtons: true, buttonDisabled: true });
      axios.post(`${this.state.expressAPIUrl}/v1/auth/google`, { access_token })
        .then(({ data }) => {
          inMemoryJWTManager.setToken(data);
          this.handleNext();
          this.setState({ disableSocialButtons: false, buttonDisabled: false });
        })
        .catch(err => {
          const { response: { data } } = err;
          this.handleError(data);
          this.setState({ disableSocialButtons: false, buttonDisabled: false });
        });
    }
    return false;
  };

  handleDialog = () => this.setState({ dialogOpen: !this.state.dialogOpen });

  stepActions() {
    if (this.state.activeStep === 0) {
      return "???????????????????????????????????????????????????";
    }
    if (this.state.activeStep === 1) {
      return "?????????????????????????????????";
    }
    return "??????????????????????????????????????????";
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep, loading, values, errorMessage, buttonDisabled, disableSocialButtons } = this.state;
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
                          <InputLabel error={!noNameError} htmlFor="outlined-adornment-name">???????????????</InputLabel>
                          <OutlinedInput
                            error={!noNameError}
                            id="outlined-adornment-name"
                            aria-describedby="outlined-name-helper-text"
                            labelWidth={45}
                            name="name"
                            onChange={this.handleChange}
                          />
                          <FormHelperText error={!noNameError} id="outlined-name-helper-text">
                            {!noNameError && errorMessage.name}
                          </FormHelperText>
                        </FormControl>
                        <FormControl fullWidth className={clsx(classes.marginBottom)} variant="outlined">
                          <InputLabel error={!noEmailError} htmlFor="outlined-adornment-email">??????????????????</InputLabel>
                          <OutlinedInput
                            error={!noEmailError}
                            id="outlined-adornment-email"
                            type="email"
                            name="email"
                            aria-describedby="outlined-email-helper-text"
                            labelWidth={50}
                            onChange={this.handleChange}
                          />
                          <FormHelperText error={!noEmailError} id="outlined-email-helper-text">
                            {!noEmailError && errorMessage.email}
                          </FormHelperText>
                        </FormControl>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel error={!noPasswordError} htmlFor="outlined-adornment-password">???????????????????????????</InputLabel>
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
                            labelWidth={90}
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
                        <GoogleLogin
                          clientId="182967407939-1qlgmahe2o06v5uj9rcof7kiaedvrf1i.apps.googleusercontent.com"
                          buttonText="??????????????????????????????????????????????????????????????????"
                          onSuccess={this.responseGoogle}
                          onFailure={this.responseGoogle}
                          className={classes.googleLoginButton}
                          cookiePolicy={'single_host_origin'}
                          disabled={disableSocialButtons}
                        />
                        <FacebookLogin
                          appId="162878389053284"
                          fields="name,email,picture"
                          callback={this.responseFacebook}
                          cssClass={classes.facebookLoginButton}
                          icon={(<FacebookIcon className={classes.facebookIcon} />)}
                          textButton="?????????????????????????????????????????????????????????????????????"
                          isDisabled={disableSocialButtons}
                        />
                        <Box display="flex" p={1} alignItems="center" className={classes.divideFlex}>
                          <Box p={1} flexGrow={1} className={classes.noPadding}>
                            <Divider />
                          </Box>
                          <Box p={1}>
                            ?????????
                          </Box>
                          <Box p={1} flexGrow={1} className={classes.noPadding}>
                            <Divider />
                          </Box>
                        </Box>
                        <FormControl fullWidth className={clsx(classes.marginBottom)} variant="outlined">
                          <InputLabel error={!noEmailError} htmlFor="outlined-adornment-email">??????????????????</InputLabel>
                          <OutlinedInput
                            error={!noEmailError}
                            id="outlined-adornment-email"
                            type="email"
                            name="email"
                            aria-describedby="outlined-email-helper-text"
                            labelWidth={50}
                            onChange={this.handleChange}
                          />
                          <FormHelperText error={!noEmailError} id="outlined-password-helper-text">
                            {!noEmailError && errorMessage.email}
                          </FormHelperText>
                        </FormControl>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel error={!noPasswordError} htmlFor="outlined-adornment-password">???????????????????????????</InputLabel>
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
                            labelWidth={90}
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
                              ????????????????????????????????????????????????????????????
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              ??????????????????????????????????????????????????????????????????????????????????????????
                            </Typography>
                          </div>
                          <div>
                            <Box display="flex" p={1} alignItems="center" className={classes.divideFlex}>
                              <Box p={1} flexGrow={1} className={classes.noPadding}>
                                <Typography color="secondary" gutterBottom>
                                  ????????????????????????
                                </Typography>
                              </Box>
                              {/* <Box p={1} className={classes.noPadding}>
                                <Button 
                                  size="small" 
                                  startIcon={<CreateIcon />}
                                  className={classes.buttonEditProfile}
                                  onClick={this.handleDialog.bind(this)}
                                >
                                  ??????????????????
                                </Button>
                                <Dialog open={dialogOpen} onClose={this.handleDialog.bind(this)} aria-labelledby="form-dialog-title">
                                  <DialogContent>
                                    <FormControl fullWidth className={clsx(classes.marginBottom)} variant="outlined">
                                      <InputLabel error={false} htmlFor={`outlined-adornment-cases`}>Number of cases</InputLabel>
                                      <OutlinedInput
                                        error={false}
                                        id={`outlined-adornment-cases`}
                                        aria-describedby={`outlined-cases-helper-text`}
                                        labelWidth={115}
                                        name="numberOfCase"
                                        onChange={() => {}}
                                        defaultValue=""
                                      />
                                      <FormHelperText error={false} id={`outlined-cases-helper-text`}>
                                        text
                                      </FormHelperText>
                                    </FormControl>
                                  </DialogContent>
                                  <DialogActions style={{ padding: "15px 24px" }}>
                                    <Button onClick={this.handleDialog.bind(this)} color="primary" className={classes.buttonEditProfile}>
                                      ?????????
                                    </Button>
                                    <Button disabled={false} onClick={() => {}} color="primary" className={classes.buttonEditProfile}>
                                      ??????
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </Box> */}
                            </Box>
                            {user ? (
                              <List component="nav">
                                <ListItem style={{ justifyContent: "center", marginBottom: "15px" }}>
                                  <Avatar 
                                    alt={user.name && user.name.toUpperCase()} 
                                    src={user.picture ? user.picture : '1.png'} 
                                    className={classes.avatarSize}
                                  />
                                </ListItem>
                                {user.email ? (
                                  <ListItem>                                    
                                    <ListItemIcon>
                                      <DoneIcon style={{ color: "rgb(5, 181, 132)" }} />
                                    </ListItemIcon>
                                    <Tooltip title={user.email}>
                                      <ListItemText
                                        classes={{ 
                                          root: classes.textOverflow,
                                          primary: classes.textOverflow,
                                        }}
                                        inset
                                        primary={user.email}
                                      />
                                    </Tooltip>
                                  </ListItem>
                                ) : ''}
                                {user.name ? (
                                  <ListItem>
                                    <ListItemIcon>
                                      <DoneIcon style={{ color: "rgb(5, 181, 132)" }} />
                                    </ListItemIcon>
                                    <Tooltip title={user.name}>
                                      <ListItemText
                                        classes={{ 
                                          root: classes.textOverflow,
                                          primary: classes.textOverflow,
                                        }}
                                        inset
                                        primary={user.name}
                                      />
                                    </Tooltip>
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
                                ??????????????????????????????????????????
                              </Typography>
                              <Typography variant="body1" gutterBottom>
                                ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
                              </Typography>
                            </div>
                            <div>
                              <Fade
                                in={loading}
                                style={{
                                  transitionDelay: loading ? "300ms" : "0ms"
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
                          ??????
                        </Button>
                      ) : (
                        <Button
                          disabled={activeStep === 0}
                          onClick={this.handleBack}
                          className={classes.backButton}
                          size="large"
                        >
                          ???????????????????????????????????????
                        </Button>
                      )}
                      {activeStep === 0 ? (
                        <div style={{ position: 'relative' }}>
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
                            disabled={buttonDisabled}
                          >
                            ????????????????????????
                          </Button>
                          {buttonDisabled && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </div>
                      ) : ''}
                      <div style={{ position: 'relative' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.stepActions() === "?????????????????????????????????" ? this.handleLogin : this.redirectInMs}
                          size="large"
                          style={
                            this.state.receivingAccount.length
                              ? { background: classes.button, color: "white" }
                              : {}
                          }
                          disabled={buttonDisabled}
                        >
                          {this.stepActions()}
                        </Button>
                        {buttonDisabled && <CircularProgress size={24} className={classes.buttonProgress} />}
                      </div>
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
