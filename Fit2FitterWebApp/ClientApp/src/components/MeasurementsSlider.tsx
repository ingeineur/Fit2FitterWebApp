import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Label, Icon, Card, Header } from 'semantic-ui-react';

interface IProps {
    guides: IMacroGuides;
    personal: IPersonal;
    measurements: IMeasurements;
    update: boolean;
}

interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    veg: number;
    bodyFat: number;
}

interface IPersonal {
    name: string;
    age: number;
    height: number;
    activityLevel: number;
    macroType: number;
}

interface IMeasurements {
    neck: number;
    waist: number;
    hips: number;
    thigh: number;
    chest: number;
    weight: number;
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
}

class MeasurementsSlider extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: '', updated: false
        };
    }

    getActivityLevel = () => {
        if (this.props.personal.activityLevel == 0) {
            return 1.2;
        }

        if (this.props.personal.activityLevel == 1) {
            return 1.375;
        }

        if (this.props.personal.activityLevel == 2) {
            return 1.55;
        }

        if (this.props.personal.activityLevel == 3) {
            return 1.725;
        }

        if (this.props.personal.activityLevel == 4) {
            return 1.9;
        }

        return 0;
    }

    render() {
        
        if (this.state.updated !== this.props.update)
        {
            console.log('updating total values');
            //this.setState({ updated: this.props.update });
        }

        const bmr = (10 * this.props.measurements.weight) + (6.25 * this.props.personal.height) - (5 * this.props.personal.age) - 161;
        const totalCalories = this.getActivityLevel() * bmr;
        const carb = (0.2 * totalCalories).toFixed(2);
        const protein = (0.5 * totalCalories).toFixed(2);
        const fat = (0.3 * totalCalories).toFixed(2);
        const bodyFatPercent = (((this.props.measurements.waist + this.props.measurements.hips) - this.props.measurements.neck) / 2) * 100.0;

        return (
            <Grid centered>
                <Grid.Row divided columns={2} color='pink' textAlign='center'>
                    <Grid.Column width={12} color='pink' textAlign='center'>
                        <h5>Calculated Macros</h5>
                    </Grid.Column>
                    <Grid.Column width={4} color='pink' textAlign='center'>
                        <h5>Body Fat</h5>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={4} textAlign='center'>
                    <Grid.Column color='black' textAlign='center'>
                        <h5>Carb (g): {carb}</h5>
                    </Grid.Column>
                    <Grid.Column color='black' textAlign='center'>
                        <h5>Protein (g): {protein}</h5>
                    </Grid.Column>
                    <Grid.Column color='black' textAlign='center'>
                        <h5>Fat (g): {fat}</h5>
                    </Grid.Column>
                    <Grid.Column color='blue' textAlign='center'>
                        <h5>{bodyFatPercent}</h5>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(MeasurementsSlider);