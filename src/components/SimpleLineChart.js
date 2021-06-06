import React, { Component }from "react";
import Typography from "@material-ui/core/Typography";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import inMemoryJWTManager from '../inMemoryJwt';

class SimpleLineChart extends Component {
  state = {
    langLocale: 'kh'
  };
  
  async componentDidMount() {
    if (!inMemoryJWTManager.getLang()) {
      inMemoryJWTManager.setLang('kh');
    } else {
      await this.setState({ langLocale: inMemoryJWTManager.getLang() });
    }
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

  numberFormat = val => {
    return new Intl.NumberFormat().format(val);
  };

  render() {
    const { data, title, color } = this.props;
    return (
      <React.Fragment>
        <Typography 
          style={{ marginTop: "0", lineHeight: "1.7", marginBottom: "1rem" }}
          variant="h4"
          align="center"
          color="textPrimary"
        >
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tickFormatter={value => this.numberTranslate(value)} />
            <YAxis dataKey="case" tickFormatter={value => this.numberTranslate(value)} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(255,255,255, 0.8)',
                borderColor: '#eaeaea',
              }}
              formatter={value => {
                return [this.numberTranslate(this.numberFormat(value)), 'ករណី'];
              }}
              labelFormatter={value => this.numberTranslate(value)}
            />
            <Line 
              isAnimationActive={true} 
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-in-out"
              type="monotone" 
              dataKey="case" 
              stroke={color} 
            />
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  }
}

export default SimpleLineChart;
