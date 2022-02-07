import * as React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { IMeasurements, calcBodyFatPercent, getBodyFatIndicator, getColour, getBodyfatForeColour } from '../models/measurement';

interface IProps {
    measurements: IMeasurements;
    age: number;
    height: number;
    targetWeight: number;
    update: boolean;
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

    render() {

        var divLabelStyle1 = {
            color: '#0a0212',
        };

        if (this.state.updated !== this.props.update)
        {
            this.setState({ updated: this.props.update });
        }

        const bodyFatPercent = calcBodyFatPercent(this.props.height, parseFloat(this.props.measurements.neck.toString()), parseFloat(this.props.measurements.waist.toString()), parseFloat(this.props.measurements.hips.toString()));
        const level = getBodyFatIndicator(this.props.age, bodyFatPercent);
        return (
            <Grid centered>
                <Grid.Row columns={3} textAlign='center'>
                    <Grid.Column color={getColour(level)} textAlign='center'>
                        <div><a>Body Fat %:</a></div>
                        <div style={divLabelStyle1}><a>{bodyFatPercent.toFixed(3)}</a></div>
                    </Grid.Column>
                    <Grid.Column color={getColour(level)} textAlign='center'>
                        <div><a>Body Type:</a></div>
                        <div style={divLabelStyle1}><a>{level}</a></div>
                    </Grid.Column>
                    <Grid.Column color={getColour(level)} textAlign='center'>
                        <div><a>Weight Goal:</a></div>
                        <div style={divLabelStyle1}><a>{this.props.targetWeight} kg</a></div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(MeasurementsHeader);