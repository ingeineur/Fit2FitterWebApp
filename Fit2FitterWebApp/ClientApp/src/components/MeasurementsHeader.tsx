import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Grid } from 'semantic-ui-react';

interface IProps {
    measurements: IMeasurements;
    age: number;
    targetWeight: number;
    update: boolean;
}

interface IMeasurements {
    neck: number;
    upperArm: number
    waist: number;
    hips: number;
    thigh: number;
    chest: number;
    weight: number
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
}

class MeasurementsHeader extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: '', updated: false
        };
    }

    getBodyFatIndicator = (age: number, bodyFat: number) => {
        if (age <= 20) {
            if (11.3 <= bodyFat && bodyFat <= 15.7) {
                return 'LEAN';
            }
            if (15.7 < bodyFat && bodyFat <= 21.5) {
                return 'IDEAL';
            }
            if (21.5 < bodyFat && bodyFat <= 29.0) {
                return 'AVERAGE';
            }
            if (29.0 < bodyFat && bodyFat <= 34.6) {
                return 'ABOVE AVERAGE';
            }
        }
        if (21 <= age && age <= 25) {
            if (11.9 <= bodyFat && bodyFat <= 18.4) {
                return 'LEAN';
            }
            if (18.4 < bodyFat && bodyFat <= 23.8) {
                return 'IDEAL';
            }
            if (23.8 < bodyFat && bodyFat <= 29.6) {
                return 'AVERAGE';
            }
            if (29.6 < bodyFat && bodyFat <= 35.2) {
                return 'ABOVE AVERAGE';
            }
        }
        if (26 <= age && age <= 30) {
            if (12.5 <= bodyFat && bodyFat <= 19.0) {
                return 'LEAN';
            }
            if (19.0 < bodyFat && bodyFat <= 24.5) {
                return 'IDEAL';
            }
            if (24.5 < bodyFat && bodyFat <= 31.5) {
                return 'AVERAGE';
            }
            if (31.5 < bodyFat && bodyFat <= 35.8) {
                return 'ABOVE AVERAGE';
            }
        }
        if (31 <= age && age <= 35) {
            if (13.2 <= bodyFat && bodyFat <= 19.6) {
                return 'LEAN';
            }
            if (19.6 < bodyFat && bodyFat <= 25.1) {
                return 'IDEAL';
            }
            if (25.1 < bodyFat && bodyFat <= 32.1) {
                return 'AVERAGE';
            }
            if (32.1 < bodyFat && bodyFat <= 36.4) {
                return 'ABOVE AVERAGE';
            }
        }
        if (36 <= age && age <= 40) {
            console.log("--------------> should at leats here");
            if (13.8 <= bodyFat && bodyFat <= 22.2) {
                return 'LEAN';
            }
            if (22.2 < bodyFat && bodyFat <= 27.3) {
                return 'IDEAL';
            }
            if (27.3 < bodyFat && bodyFat <= 32.7) {
                return 'AVERAGE';
            }
            if (32.7 < bodyFat && bodyFat <= 37.0) {
                return 'ABOVE AVERAGE';
            }
        }
        if (41 <= age && age <= 45) {
            if (14.4 <= bodyFat && bodyFat <= 22.8) {
                return 'LEAN';
            }
            if (22.8 < bodyFat && bodyFat <= 27.9) {
                return 'IDEAL';
            }
            if (27.9 < bodyFat && bodyFat <= 34.4) {
                return 'AVERAGE';
            }
            if (34.4 < bodyFat && bodyFat <= 37.7) {
                return 'ABOVE AVERAGE';
            }
        }
        if (46 <= age && age <= 50) {
            if (15.0 <= bodyFat && bodyFat <= 23.4) {
                return 'LEAN';
            }
            if (23.4 < bodyFat && bodyFat <= 28.6) {
                return 'IDEAL';
            }
            if (28.6 < bodyFat && bodyFat <= 35.0) {
                return 'AVERAGE';
            }
            if (35.0 < bodyFat && bodyFat <= 38.3) {
                return 'ABOVE AVERAGE';
            }
        }
        if (51 <= age && age <= 55) {
            if (15.6 <= bodyFat && bodyFat <= 24.0) {
                return 'LEAN';
            }
            if (24.0 < bodyFat && bodyFat <= 29.2) {
                return 'IDEAL';
            }
            if (29.2 < bodyFat && bodyFat <= 35.6) {
                return 'AVERAGE';
            }
            if (35.6 < bodyFat && bodyFat <= 38.9) {
                return 'ABOVE AVERAGE';
            }
        }
        if (56 <= age) {
            if (16.3 <= bodyFat && bodyFat <= 24.6) {
                return 'LEAN';
            }
            if (24.6 < bodyFat && bodyFat <= 29.8) {
                return 'IDEAL';
            }
            if (29.8 < bodyFat && bodyFat <= 37.2) {
                return 'AVERAGE';
            }
            if (37.2 < bodyFat && bodyFat <= 39.5) {
                return 'ABOVE AVERAGE';
            }
        }

        return 'AVERAGE';
    }

    getColour = (level: string) => {
        if (level === 'LEAN') {
            return 'blue';
        }

        if (level === 'IDEAL') {
            return 'green';
        }

        if (level === 'AVERAGE') {
            return 'yellow';
        }

        return 'red';
    }

    render() {

        var divLabelStyle1 = {
            color: '#0a0212',
        };

        var divLabelStyle2 = {
            color: '#0a0212',
            backgroundColor: 'Yellow'
        };

        var divLabelStyle3 = {
            color: '#fffafa',
            backgroundColor:'Red'
        };

        var divLabelStyle4 = {
            color: '#fffafa',
            fontFamily: 'Comic Sans MS',
            fontSize: '20px'
        };

        if (this.state.updated !== this.props.update)
        {
            this.setState({ updated: this.props.update });
        }

        const bodyFatPercent = (((parseFloat(this.props.measurements.waist.toString()) + parseFloat(this.props.measurements.hips.toString())) - parseFloat(this.props.measurements.neck.toString())) / 2);
        const level = this.getBodyFatIndicator(this.props.age, bodyFatPercent);
        return (
            <Grid centered>
                <Grid.Row divided color='pink' textAlign='center'>
                    <Grid.Column color='pink' textAlign='center'>
                        <div style={divLabelStyle4}>
                            <a>Full Body Assessments</a>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row divided columns={3} textAlign='center'>
                    <Grid.Column color={this.getColour(level)} textAlign='center'>
                        <div><a>Body Fat %:</a></div>
                        <div style={divLabelStyle1}><a>{bodyFatPercent.toFixed(3)}</a></div>
                    </Grid.Column>
                    <Grid.Column color={this.getColour(level)} textAlign='center'>
                        <div><a>Body Fat:</a></div>
                        <div style={divLabelStyle1}><a>{level}</a></div>
                    </Grid.Column>
                    <Grid.Column color={this.getColour(level)} textAlign='center'>
                        <div><a>Weight Goal:</a></div>
                        <div style={divLabelStyle1}><a>{this.props.targetWeight} kg</a></div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(MeasurementsHeader);