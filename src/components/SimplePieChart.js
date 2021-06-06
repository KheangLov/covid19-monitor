import React, { Component }from "react";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/styles/withStyles";
import {
    PieChart,
    Pie,
    Cell,
    Sector,
    ResponsiveContainer,
    Legend,
    Tooltip
} from "recharts";
import inMemoryJWTManager from '../inMemoryJwt';

const styles = theme => ({
    pieOut: {
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    pieIn: {
        [theme.breakpoints.down('xs')]: {
            display: 'block',
        },
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    }
});


class SimplePieChart extends Component {
  state = {
    langLocale: 'kh',
    activeIndex: 0,
  };
  
  async componentDidMount() {
    if (!inMemoryJWTManager.getLang()) {
      inMemoryJWTManager.setLang('kh');
    } else {
      await this.setState({ langLocale: inMemoryJWTManager.getLang() });
    }
  }

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

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

  renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`ករណី: ${this.numberTranslate(this.numberFormat(value))}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(ជាភាគរយ ${this.numberTranslate((percent * 100).toFixed(2))}%)`}
        </text>
      </g>
    );
  };

  numberFormat = val => {
    return new Intl.NumberFormat().format(val);
  };

  render() {
    const { data, title, classes } = this.props;
    return (
      <React.Fragment>
        {title && (
            <Typography 
                style={{ margin: "0", lineHeight: "1.7" }}
                variant="h4"
                align="center"
                color="textPrimary"
            >
                {title}
            </Typography>
        )}
        <ResponsiveContainer width="100%" height={300} className={classes.pieOut}>
            <PieChart margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                <Pie
                    isAnimationActive={true} 
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    activeIndex={this.state.activeIndex}
                    activeShape={this.renderActiveShape}
                    dataKey="value"
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    labelLine={false}
                    onMouseEnter={this.onPieEnter}
                >
                    {data && data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color}/>
                    ))}
                </Pie>
                <Legend     
                    wrapperStyle={{
                        bottom: 0
                    }} 
                />
            </PieChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={300} className={classes.pieIn}>
            <PieChart margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data && data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Legend     
                    wrapperStyle={{
                        bottom: 0
                    }} 
                />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255, 0.8)',
                        borderColor: '#eaeaea',
                    }}
                    formatter={(value, name) => [this.numberTranslate(this.numberFormat(value)), name]} 
                />
            </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(SimplePieChart);
